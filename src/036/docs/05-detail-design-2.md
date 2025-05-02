**ステップ 1: アテンション出力付きモデルの準備**

distilbert_tfjs_model に格納済

**ステップ 2: アテンションデータの抽出と整形**

アテンション出力付きモデルをロードすると、`model.executeAsync()` の結果 (`outputTensors`) は、`last_hidden_state` に加えて `attention_layer_0`, `attention_layer_1`, ... といったキーを持つ**配列**になるはずです。

以下の関数は `script.js` に実装済みで、推論後に呼び出してアテンションデータを JavaScript 配列に変換します。

```javascript
// アテンションデータを JavaScript 配列に変換する関数 (詳細設計書 C の実装例)
async function formatAttentionOutput(outputTensorsArray, numExpectedLayers = 6, numExpectedHeads = 12) {
    const attentionMatrices = Array(numExpectedLayers).fill(null); // 配列を初期化
    const promises = [];
    let detectedLayers = 0;

    console.log('Formatting attention outputs from array (corrected order)...');

    // ログに基づき、アテンションテンソルの配列内インデックスを定義
    // Tensor[0]: attention_layer_0
    // Tensor[1]: last_hidden_state (無視)
    // Tensor[2]: attention_layer_1
    // ...
    // Tensor[6]: attention_layer_5
    const attentionIndices = [0, 2, 3, 4, 5, 6]; // アテンションに対応するインデックス

    // 配列の実際の長さも考慮
    const maxLayersToCheck = Math.min(numExpectedLayers, attentionIndices.length);

    for (let i = 0; i < maxLayersToCheck; i++) {
        const tensorIndexInArray = attentionIndices[i]; // 正しいインデックスを使用
        const layerNum = i; // レイヤー番号 (0-5)
        const key = `attention_layer_${layerNum}`; // デバッグ用のキー名

        // 配列の範囲チェック
        if (tensorIndexInArray >= outputTensorsArray.length) {
             console.warn(`Index ${tensorIndexInArray} out of bounds for outputTensorsArray (length ${outputTensorsArray.length}). Skipping layer ${layerNum}.`);
             continue; // 次のレイヤーへ
        }

        const tensor = outputTensorsArray[tensorIndexInArray];

        if (tensor && tensor instanceof tf.Tensor) {
            // 形状チェック (アテンションの形状か確認)
            if (tensor.shape.length === 4 && tensor.shape[0] === 1 && tensor.shape[1] === numExpectedHeads && tensor.shape[2] > 0 && tensor.shape[3] > 0) {
                detectedLayers++;
                promises.push(
                    tensor.array().then(arr => {
                        // arr の形状は [1, num_heads, seq_len, seq_len]
                        attentionMatrices[layerNum] = arr[0]; // [num_heads, seq_len, seq_len] を格納
                    }).catch(err => {
                        console.error(`Error converting ${key} (Tensor[${tensorIndexInArray}]) to array:`, err);
                        attentionMatrices[layerNum] = null;
                    })
                );
            } else {
                 // 形状がアテンションと異なる場合は警告
                 console.warn(`Unexpected shape for ${key} (Tensor[${tensorIndexInArray}]):`, tensor.shape);
                 attentionMatrices[layerNum] = null;
             }
        } else {
            console.warn(`Attention tensor for layer ${layerNum} (Tensor[${tensorIndexInArray}]) not found or not a Tensor.`);
            attentionMatrices[layerNum] = null; // 存在しない場合は null
        }
    }

    // 全てのアテンションテンソルの変換を待つ
    await Promise.all(promises);
    console.log(`Attention matrices extracted for ${detectedLayers} layers from array (corrected order).`);

    // attentionMatrices は Array<number[][][] | null> (レイヤーごとの [heads, seq, seq] 配列)
    return attentionMatrices;
}
```

**ステップ 3: 可視化用のトークンを生成**

可視化には、入力テキストがどのようにトークン化されたかを示す文字列配列が必要です。

以下の関数は `script.js` に実装済みです。

```javascript
function generateTokensForVis(tokenizedOutputs, tokenizerInstance) {
    if (!tokenizedOutputs || !tokenizedOutputs.input_ids || !tokenizerInstance) {
        return [];
    }
    try {
        const inputIds = Array.from(tokenizedOutputs.input_ids.data, bigint => Number(bigint));
        const seqLen = inputIds.length;
        const tokens = [];

        // 各 ID を個別にデコード (サブワード境界が失われる可能性あり)
        for (const id of inputIds) {
            // skip_special_tokens=false でないと [CLS] などがデコードできない
            // clean_up_tokenization_spaces=false でサブワード前のスペースなどを保持試行
            let token = tokenizerInstance.decode([id], {
                 skip_special_tokens: false,
                 clean_up_tokenization_spaces: false // これが効果あるか要確認
                });
            tokens.push(token);
        }

        if (tokens.length !== seqLen) {
            console.warn("Generated token length mismatch!");
        }
        console.log("Generated Tokens for Vis (may be inaccurate):", tokens);
        return tokens;

    } catch(error) {
        console.error("Failed to generate tokens for visualization:", error);
        return Array(tokenizedOutputs?.input_ids?.dims?.[1] || 0).fill('[ERR]');
    }
}
```

**ステップ 4: 可視化ライブラリ (D3.js) の導入と HTML 修正**

1.  **D3.js の読み込み:** `index.html` の `` 内に D3.js の CDN スクリプトタグが追加されています。
    ```html
    <head>
        <!-- ... 他のタグ ... -->
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js" type="module"></script>
        <!-- D3.js を追加 -->
        <script src="https://d3js.org/d3.v7.min.js"></script>
        <!-- transformers.js (type="module" を確認) -->
        <script src="https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0" type="module"></script>
        <!-- 自分のスクリプト (type="module" にする必要があるかも) -->
        <script src="script.js" type="module"></script>
        <style>
            /* ... スタイル ... */
            /* 可視化用のスタイルを追加 */
            .attention-line {
                stroke-width: 1.5;
                transition: stroke-opacity 0.2s ease-in-out; /* スムーズな変化 */
            }
            .token-text {
                font-size: 12px;
                cursor: default; /* テキスト選択を防ぐ */
            }
            .token-text:hover {
                font-weight: bold;
            }
        </style>
    </head>

    ```
    *注意: `script.js` も `type="module"` で読み込むように変更する必要があるかもしれません。*

2.  **HTML 要素の追加:** `index.html` の `` 内に、レイヤーとヘッドを選択する UI と、可視化を描画する SVG コンテナが追加されています。
    ```html
    <body>
        <h1>TensorFlow.js DistilBERT Attention Visualization</h1>
        <textarea id="textInput" rows="3" cols="50">Hello, how are you?</textarea><br>
        <button id="runButton">Run Inference & Visualize</button>

        <div id="status">Ready.</div>
        <pre id="resultDisplayArea"></pre>

        <!-- 可視化コントロール -->
        <div>
            Layer: <select id="layerSelector"></select>
            Head: <select id="headSelector"></select>
        </div>

        <!-- 可視化描画エリア -->
        <div id="visualization">
            <svg id="attentionSvg" width="800" height="600"></svg>
        </div>

        <!-- スクリプト読み込みは body の最後に移動推奨 -->
        <!-- <script src="..."></script> -->
    </body>

    ```

**ステップ 5: 可視化エンジンの実装 (`script.js` に追加)**

詳細設計書 D の D3.js コードをベースに、`script.js` 内に関数として実装されています。

可視化エンジンの実装については、`script.js` を参照してください。

---
