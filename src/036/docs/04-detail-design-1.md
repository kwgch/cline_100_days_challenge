## 1. 詳細設計書 (改訂版)

### 1.1. UI コンポーネント (変更なし)

*   `TextInputArea`: テキスト入力用。
*   `RunButton`: 推論実行トリガー。
*   `LayerSelector`: アテンション表示対象レイヤー選択 (0 から 5 for DistilBERT base)。
*   `HeadSelector`: アテンション表示対象ヘッド選択 (DistilBERT base は 12 ヘッドのはず)。
*   `VisualizationCanvas`: アテンション描画領域 (SVG を推奨)。
*   `ResultDisplayArea`: 推論結果 (last\_hidden\_state の形状など) 表示。
*   `LoadingIndicator`: 処理中表示。
*   `TokenDisplayArea` (追加): 入力テキストのトークン列を表示するエリア (可視化と対応付けるため)。

### 1.2. Model Loader (変更なし)

*   `loadModel(modelUrl)`: アテンション出力付きの `model.json` を `tf.loadGraphModel()` で読み込む。
*   （model.json は ./distilbert_tfjs_model/model.json にある）

### 1.3. Preprocessor (詳細化)

*   **役割:** ユーザー入力テキストをトークナイズし、モデル入力テンソル (`input_ids`, `attention_mask`) を生成する。
*   **トークナイザ:**
    *   `distilbert-base-uncased` に対応するトークナイザが必要。Hugging Face が提供する `@xenova/transformers` ライブラリ (CDNあり) の `AutoTokenizer` を利用するのが最も簡単。
    *   または、Python で使用した `tokenizer` の設定 (`vocab.txt` など) を基に、他の JavaScript トークナイザライブラリ (例: `tokenizers.js`) を設定するか、自前で実装する。**ここでは `@xenova/transformers` の利用を推奨。**
*   **処理フロー:**
    1.  `AutoTokenizer.from_pretrained('Xenova/distilbert-base-uncased')` でトークナイザインスタンスを取得 (初回は時間がかかる可能性あり)。
    2.  `tokenizer(text, { padding: 'max_length', truncation: true, max_length: MAX_SEQUENCE_LENGTH, return_tensors: 'tf' })` を呼び出し、指定した最大長 (`MAX_SEQUENCE_LENGTH`) でパディング・切り詰めを行い、TensorFlow.js テンソル形式で `input_ids` と `attention_mask` を得る。
    3.  `tokenizer.convert_ids_to_tokens()` を使って、可視化表示用のトークン文字列配列も取得する。
*   **インターフェース:** `preprocess(text)` は `{ inputs: { input_ids: tf.Tensor, attention_mask: tf.Tensor }, tokens: string[] }` 形式のオブジェクトを返す。

### 1.4. Inference Engine (変更点)

*   **役割:** モデルと入力テンソルを受け取り、推論を実行し、出力テンソル (last\_hidden\_state および全レイヤーのアテンション) を取得する。
*   **処理フロー:**
    1.  `model.executeAsync(inputs)` を実行。`inputs` は Preprocessor が生成した `{ input_ids: ..., attention_mask: ... }` オブジェクト。
    2.  戻り値は、SavedModel 保存時に定義した出力名を持つオブジェクトとなる (例: `{ last_hidden_state: tf.Tensor, attention_layer_0: tf.Tensor, ..., attention_layer_5: tf.Tensor }`)。
*   **インターフェース:** `runInference(model, inputs)` は出力テンソルを含むオブジェクトを返す。

### 1.5. Postprocessor (詳細化)

*   **役割:** Inference Engine の出力テンソルを JavaScript で扱いやすい形式に変換し、メモリを解放する。
*   **処理フロー:**
    1.  `last_hidden_state` テンソルの形状などを取得し、表示用情報を作成。テンソル自体は不要なら `dispose()` する。
    2.  各アテンションテンソル (`attention_layer_i`) について、`tensor.array()` (非同期) または `tensor.arraySync()` (同期、UI フリーズ注意) を使って JavaScript の多次元配列に変換する。
        *   アテンションテンソルの形状は `[batch_size, num_heads, sequence_length, sequence_length]`。今回は `batch_size=1` なので、`[1, num_heads, seq_len, seq_len]`。
        *   変換後の JavaScript 配列の形状もこれに対応する (例: `number[][][][]`)。
    3.  元のテンソルは `tf.dispose()` でメモリ解放する (`tf.tidy()` の外で非同期処理する場合)。
*   **インターフェース:** `formatOutput(outputTensors)` は `{ lastHiddenStateInfo: object, attentionMatrices: Array>>> }` のようなオブジェクトを返す (attentionMatrices はレイヤーごとのアテンション配列を含む配列)。

### 1.6. Visualization Engine (詳細化 - D3.js を使用)

*   **役割:** 整形されたアテンションデータとトークン配列を受け取り、ユーザーが選択したレイヤー/ヘッドに対応するアテンションを SVG 上に描画する (Head View)。インタラクションを提供する。
*   **ライブラリ:** **D3.js** を利用。SVG 操作、データバインディング、スケール、イベント処理に適している。
*   **データ構造:**
    *   入力: `tokens: string[]`, `attentionMatrices: number[][][][]` (レイヤー, ヘッド, トークンFrom, トークンTo), `selectedLayer: number`, `selectedHead: number`
    *   処理対象データ: `attentionScores: number[][]` (形状 `[seq_len, seq_len]`) = `attentionMatrices[selectedLayer][selectedHead]` (バッチサイズ 0 番目)
*   **Head View 描画ロジック:**
    1.  **SVG セットアップ:** D3 で SVG 要素を作成し、描画領域とマージンを設定。
    2.  **トークン表示:**
        *   左右にトークンリストを表示するための G (group) 要素を作成。
        *   `tokens` 配列をデータとしてバインドし、各トークンに対応する `` 要素を SVG 上に配置。左右のリストで同じ Y 座標になるようにスケール (`d3.scalePoint` など) を使用。
        *   `` 要素にマウスオーバーイベントリスナーを追加。
    3.  **アテンション線描画:**
        *   アテンション線を描画するための G 要素を作成。
        *   `attentionScores` 行列をフラットなリスト (例: `{ fromIndex: number, toIndex: number, score: number }`) に変換。
        *   変換したリストをデータとしてバインドし、各要素に対応する `` 要素を描画。
        *   線の始点 (`x1`, `y1`) は左側トークンの位置、終点 (`x2`, `y2`) は右側トークンの位置に対応させる。
        *   線の `stroke-width` または `stroke-opacity` を `score` の値に基づいて設定 (例: `d3.scaleLinear` でスコアを透明度 0-1 にマップ)。閾値を設けて低いスコアの線は描画しないことも可能。
        *   線の `stroke` (色) をヘッドごとに固定の色にする (複数ヘッド同時表示の場合) か、固定色にする。
        *   線にマウスオーバーイベントリスナーを追加。
    4.  **インタラクション (マウスオーバー):**
        *   トークンにマウスオーバー: そのトークンから出ている線、およびそのトークンに入ってくる線をハイライト (例: `stroke-opacity` を 1 にする)。他の線は薄くする。
        *   線にマウスオーバー: その線をハイライト。対応する左右のトークンも強調表示。
        *   マウスが外れたら元の表示に戻す。
*   **インターフェース:**
    *   `init(svgContainerSelector, initialTokens, initialAttentionMatrices)`
    *   `update(selectedLayer, selectedHead)`: 選択されたレイヤー/ヘッドのアテンションを描画。
    *   `updateData(tokens, attentionMatrices)`: 新しい推論結果でデータを更新。

### 1.7. データフロー (アテンション含む)

1.  初期化: Model Loader がモデル読み込み。
2.  テキスト入力 & 実行ボタンクリック。
3.  Controller -> Preprocessor: テキストをトークンID、アテンションマスク、トークン文字列に変換 (`preprocess`)。
4.  Controller -> UI: トークン文字列を `TokenDisplayArea` に表示。
5.  Controller -> Inference Engine: モデルと入力テンソルで推論実行 (`runInference`)。出力テンソル (アテンション含む) を取得。
6.  Controller -> Postprocessor: 出力テンソルを整形し、アテンションスコアを JavaScript 配列に変換 (`formatOutput`)。メモリ解放。
7.  Controller -> UI: 推論結果情報 (`lastHiddenStateInfo`) を `ResultDisplayArea` に表示。
8.  Controller -> Visualization Engine: トークン文字列と整形済みアテンション配列を渡して初期化またはデータ更新 (`init` または `updateData`)。
9.  Controller -> Visualization Engine: デフォルトまたはユーザー選択のレイヤー/ヘッドで描画指示 (`update`)。
10. UI (Layer/Head Selector) -> Controller: 選択変更イベント。
11. Controller -> Visualization Engine: 新しい選択で描画更新 (`update`)。

### 1.8. 技術スタック (更新)

*   **フロントエンド:** HTML5, CSS3, JavaScript (ES6+)
*   **機械学習:** TensorFlow.js (`@tensorflow/tfjs`) (CDN)
*   **トークナイザ:** **`@xenova/transformers`** (CDN)
*   **可視化:** **D3.js** (CDN)
*   **UI フレームワーク (任意):** Vanilla JS, React, Vue など

---

## 2. 主要コンポーネントの実装例 (JavaScript スニペット)

**注意:** これらは骨子であり、完全なコードではありません。エラーハンドリング、UI との連携、詳細な D3.js のコードなどは省略しています。

**A. トークナイザのロードと前処理 (@xenova/transformers を使用)**

```javascript
// CDN から @xenova/transformers を import する場合 (ES Modules)
// import { AutoTokenizer } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@latest';

// または script タグでロードし、グローバル変数 `transformers` を使う場合
// const { AutoTokenizer } = transformers; // 仮のグローバル変数名

let tokenizer;
const MAX_SEQUENCE_LENGTH = 128;
const modelName = 'Xenova/distilbert-base-uncased'; // transformers.js 用のモデル名

async function initializeTokenizer() {
    try {
        console.log(`Tokenizer (${modelName}) loading...`);
        tokenizer = await AutoTokenizer.from_pretrained(modelName);
        console.log('Tokenizer loaded.');
    } catch (error) {
        console.error('Tokenizer loading failed:', error);
    }
}

async function preprocess(text) {
    if (!tokenizer) {
        throw new Error('Tokenizer not initialized.');
    }
    try {
        // トークナイズ実行、パディング、トランケーション、TFJSテンソル形式で返す
        const inputs = await tokenizer(text, {
            padding: 'max_length',
            truncation: true,
            max_length: MAX_SEQUENCE_LENGTH,
            return_tensors: 'tf' // TensorFlow.js テンソルを要求
        });

        // 可視化用のトークン文字列を取得 (input_ids を使用)
        // tokenizer.convert_ids_to_tokens は Pytorch/TF 版の機能であり、
        // transformers.js で同等の機能があるか要確認。なければ input_ids から vocab を参照する必要あり。
        // 仮の処理:
        const tokens = tokenizer.convert_ids_to_tokens(inputs.input_ids.arraySync()[0]); // 同期処理、要確認
         // [CLS], [SEP] や Padding トークンが含まれる

        return { inputs, tokens };

    } catch (error) {
        console.error('Preprocessing failed:', error);
        throw error;
    }
}

// 実行例
// initializeTokenizer().then(() => {
//   preprocess("The cat sat on the mat.").then(({ inputs, tokens }) => {
//     console.log("Input IDs:", inputs.input_ids.shape);
//     console.log("Attention Mask:", inputs.attention_mask.shape);
//     console.log("Tokens:", tokens);
//     inputs.input_ids.dispose(); // 不要になったら破棄
//     inputs.attention_mask.dispose();
//   });
// });
```
*注釈: `@xenova/transformers` で `convert_ids_to_tokens` が期待通りに動作するか、代替手段が必要か確認が必要です。*

**B. 推論実行とアテンション取得**

```javascript
async function runInference(model, inputs) {
    if (!model || !inputs) {
        throw new Error('Model or inputs not provided.');
    }
    console.log('Running inference...');
    try {
        // model.executeAsync を使用 (GraphModel の場合)
        // inputs は { input_ids: tf.Tensor, attention_mask: tf.Tensor }
        const outputTensors = await model.executeAsync(inputs);
        console.log('Inference completed.');
        // outputTensors は { last_hidden_state: tf.Tensor, attention_layer_0: tf.Tensor, ... }
        return outputTensors;
    } catch (error) {
        console.error('Inference failed:', error);
        throw error;
    }
}
```

**C. アテンションデータの整形 (Postprocessor)**

```javascript
async function formatOutput(outputTensors) {
    const numLayers = Object.keys(outputTensors).filter(k => k.startsWith('attention_layer_')).length;
    const attentionMatrices = [];

    console.log('Formatting outputs...');

    const lastHiddenStateInfo = {
        shape: outputTensors.last_hidden_state.shape
        // 必要に応じて他の情報も追加
    };
    // last_hidden_state テンソル自体はここでは不要なので破棄
    outputTensors.last_hidden_state.dispose();

    const promises = [];
    for (let i = 0; i  {
                attentionMatrices[i] = arr; // arr の形状は [1, num_heads, seq_len, seq_len]
                tensor.dispose(); // 変換が終わったら元のテンソルを破棄
            })
        );
    }

    // 全てのアテンションテンソルの変換を待つ
    await Promise.all(promises);
    console.log('Attention matrices extracted.');

    // attentionMatrices は Array (レイヤーごとのアテンション配列を含む)
    return { lastHiddenStateInfo, attentionMatrices };
}

// 実行例 (推論後)
// runInference(model, processedData.inputs).then(outputTensors => {
//   formatOutput(outputTensors).then(({ lastHiddenStateInfo, attentionMatrices }) => {
//     console.log("Last Hidden State Info:", lastHiddenStateInfo);
//     console.log("Attention Matrices Layers:", attentionMatrices.length);
//     if (attentionMatrices.length > 0) {
//       console.log("Shape of Layer 0 Attention:",
//         [attentionMatrices[0].length, // Batch size (1)
//          attentionMatrices[0][0].length, // Num heads
//          attentionMatrices[0][0][0].length, // Seq len
//          attentionMatrices[0][0][0][0].length // Seq len
//         ]);
//     }
//     // ここで Visualization Engine にデータを渡す
//   });
// });
```

**D. D3.js を使った Head View の描画（骨子）**

```javascript
// --- VisualizationEngine (Conceptual) ---
let svg;
let tokens = [];
let attentionMatrices = [];
let selectedLayer = 0;
let selectedHead = 0;
const width = 800;
const height = 600;
const margin = { top: 50, right: 150, bottom: 50, left: 150 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

function initVisualization(containerSelector, initialTokens, initialMatrices) {
    tokens = initialTokens;
    attentionMatrices = initialMatrices;

    svg = d3.select(containerSelector)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 初期描画
    updateVisualization();
}

function updateVisualizationData(newTokens, newMatrices) {
    tokens = newTokens;
    attentionMatrices = newMatrices;
    // 必要に応じてスケールなども更新
    updateVisualization(); // 再描画
}


function updateVisualization(layer = selectedLayer, head = selectedHead) {
    selectedLayer = layer;
    selectedHead = head;

    if (!attentionMatrices || attentionMatrices.length === 0 || !tokens || tokens.length === 0) return;

    // 選択されたレイヤー/ヘッドのアテンションスコアを取得 (バッチサイズ0番目)
    // attentionMatrices[layer][head][0] は seq_len x seq_len の行列のはず
    const attentionScores = attentionMatrices[selectedLayer][selectedHead][0];
    const seqLen = tokens.length; // or attentionScores.length

    // 描画内容をクリア (効率的な更新は d3 の enter/update/exit パターンを使う)
    svg.selectAll("*").remove();

    // Y軸スケール (トークン配置用)
    const yScale = d3.scalePoint()
        .domain(d3.range(seqLen))
        .range([0, innerHeight])
        .padding(0.5);

    // --- 左側トークン描画 ---
    svg.append("g").attr("class", "tokens-left")
       .selectAll(".token-text-left")
       .data(tokens)
       .enter()
       .append("text")
       .attr("x", -10) // 左マージン外
       .attr("y", (d, i) => yScale(i))
       .attr("dy", "0.32em") // 垂直中央揃え
       .attr("text-anchor", "end")
       .text(d => d)
       .on("mouseover", handleTokenMouseOver)
       .on("mouseout", handleMouseOut);

    // --- 右側トークン描画 ---
    svg.append("g").attr("class", "tokens-right")
        .attr("transform", `translate(${innerWidth}, 0)`) // 右端へ移動
        .selectAll(".token-text-right")
        .data(tokens)
        .enter()
        .append("text")
        .attr("x", 10) // 右マージン内
        .attr("y", (d, i) => yScale(i))
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .text(d => d)
        .on("mouseover", handleTokenMouseOver)
        .on("mouseout", handleMouseOut);

    // --- アテンション線描画 ---
    const attentionData = [];
    for (let i = 0; i  d.score)]) // スコアの最大値に応じて調整
        .range([0, 0.8]); // 透明度 0 から 0.8

    svg.append("g").attr("class", "attention-lines")
        .selectAll(".attention-line")
        .data(attentionData.filter(d => d.score > 0.01)) // スコアが低い線は描画しない
        .enter()
        .append("line")
        .attr("class", "attention-line")
        .attr("x1", d => 0) // 左側トークンの x 座標 (マージン内)
        .attr("y1", d => yScale(d.from))
        .attr("x2", d => innerWidth) // 右側トークンの x 座標 (マージン内)
        .attr("y2", d => yScale(d.to))
        .attr("stroke", "steelblue") // ヘッドごとに色を変える場合は工夫が必要
        .attr("stroke-opacity", d => opacityScale(d.score))
        .attr("stroke-width", 1.5)
        .attr("data-from", d => d.from) // マウスオーバー用にインデックスを保持
        .attr("data-to", d => d.to)
        .on("mouseover", handleLineMouseOver)
        .on("mouseout", handleMouseOut);

}

function handleTokenMouseOver(event, d, i) {
    const index = i; // データバインドされたインデックス
    svg.selectAll(".attention-line")
        .attr("stroke-opacity", lineData => {
            const fromIndex = parseInt(lineData.from);
            const toIndex = parseInt(lineData.to);
            // このトークンが起点または終点の場合、強調表示
            return (fromIndex === index || toIndex === index) ? 0.9 : 0.1;
        });
}

function handleLineMouseOver(event, d) {
    svg.selectAll(".attention-line").attr("stroke-opacity", 0.1); // 他を薄く
    d3.select(this).attr("stroke-opacity", 0.9).raise(); // 自分を強調して最前面へ
    // 対応するトークンも強調表示 (省略)
}

function handleMouseOut(event, d) {
    // 元の透明度に戻す
    const opacityScale = d3.scaleLinear()
        .domain([0, d3.max(attentionMatrices[selectedLayer][selectedHead][0].flat())]) // 再計算が必要な場合あり
        .range([0, 0.8]);
    svg.selectAll(".attention-line")
       .filter(lineData => lineData.score > 0.01) // 描画した線のみ対象
       .attr("stroke-opacity", lineData => opacityScale(lineData.score));
    // トークンの強調表示も解除 (省略)
}

// --- 使い方 ---
// // HTML に  を用意
// const container = "#visualization";
// initVisualization(container, initialTokens, initialAttentionMatrices);
// // LayerSelector/HeadSelector の変更イベントで updateVisualization(newLayer, newHead) を呼ぶ
// // 新しい推論結果が出たら updateVisualizationData(newTokens, newMatrices) を呼ぶ
```

---



