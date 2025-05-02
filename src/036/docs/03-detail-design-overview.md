## 3. 詳細設計書 (概要)

### 3.1. UI コンポーネント

*   **TextInputArea:**
    *   `` 要素で実装。
    *   入力内容を Controller に連携。
*   **RunButton:**
    *   `` 要素で実装。
    *   クリックイベントで Controller の推論実行フローをトリガー。
*   **LayerSelector:**
    *   `` 要素で実装。
    *   DistilBERT のレイヤー数に応じて選択肢を動的に生成。
    *   選択変更イベントで Visualization Engine に通知。
*   **HeadSelector:**
    *   `` 要素で実装。
    *   DistilBERT のヘッド数に応じて選択肢を動的に生成。
    *   選択変更イベントで Visualization Engine に通知。
*   **VisualizationCanvas:**
    *   `` または `` 要素で実装。
    *   Visualization Engine が描画を担当。
    *   マウスイベント（移動、クリック）を捕捉し、Visualization Engine に連携。
*   **ResultDisplayArea:**
    *   `` や `` 要素で実装。
    *   Controller から受け取ったモデルの推論結果を表示。
*   **LoadingIndicator:**
    *   モデルロード中や推論中に表示するスピナーやプログレスバー。

### 3.2. Model Loader

*   `loadModel(modelUrl)` 関数:
    *   `tf.loadGraphModel(modelUrl)` を非同期で呼び出す。
    *   ロードの進捗、成功、失敗を管理し、Promise またはコールバックで Controller に通知する。
    *   ロードされたモデルオブジェクトを保持する。

### 3.3. Preprocessor

*   `preprocess(text, tokenizer, maxLength)` 関数:
    *   `tokenizer.encode(text)` を使用してテキストをトークン ID に変換。
    *   `maxLength` に合わせてパディングとトランケーションを行う。
    *   アテンションマスクを生成する。
    *   結果を TensorFlow.js のテンソル (`tf.tensor2d`) として返す (`input_ids`, `attention_mask`)。
    *   Tokenizer は事前にロードしておく必要がある。

### 3.4. Inference Engine

*   `runInference(model, inputTensors)` 関数:
    *   `model.executeAsync(inputTensors)` を呼び出す。
    *   `inputTensors` は Preprocessor が生成した `input_ids` と `attention_mask` を含むオブジェクト (モデルの入力シグネチャに合わせる)。
    *   戻り値はテンソルの配列または Named Output を含むオブジェクト。アテンションスコアのテンソルが含まれていることを期待する。
    *   `tf.tidy()` を使用して中間テンソルのメモリリークを防ぐ。

### 3.5. Postprocessor

*   `formatOutput(outputTensors, tokenizer)` 関数:
    *   モデルの最終出力テンソル (例: logits) を処理し、予測結果のテキストを生成 (例: `tf.argMax`, `tokenizer.decode`)。
    *   アテンションスコアのテンソル群を JavaScript の多次元配列に変換 (`tensor.arraySync()` または `tensor.array()`)。
    *   結果を Controller が扱いやすいオブジェクト形式で返す。

### 3.6. Visualization Engine

*   `init(canvasElement, initialAttentionData)`: Canvas/SVG の初期設定。
*   `update(attentionData, selectedLayer, selectedHead)`:
    *   `attentionData` (全レイヤー/ヘッド分) から `selectedLayer` と `selectedHead` に対応するアテンションスコア配列を取得。
    *   現在の可視化モード (Head View / Model View) に応じて描画処理を呼び出す。
*   `drawHeadView(attentionScores, tokens)`:
    *   Canvas API または SVG を使用してトークンを描画。
    *   トークン間にアテンションスコアに応じた線（太さ、色）を描画。
    *   マウスオーバー時のハイライト処理を実装。
*   `drawModelView(allAttentionScores, tokens)`: (オプション)
    *   全レイヤー/ヘッドのアテンションを俯瞰的に描画。
*   イベントハンドラ: マウス移動、クリックなどを処理し、ハイライト表示などを更新。

### 3.7. API/インターフェース

*   **Controller -> ModelLoader:** `loadModel(url)`
*   **Controller -> Preprocessor:** `preprocess(text, tokenizer, maxLength)`
*   **Controller -> InferenceEngine:** `runInference(model, inputTensors)`
*   **Controller -> Postprocessor:** `formatOutput(outputTensors, tokenizer)`
*   **Controller -> UI:** `displayResults(text)`, `showLoading(bool)`, `updateVisualizationData(data)`
*   **Controller -> VisualizationEngine:** `update(data, layer, head)`
*   **UI -> Controller:** `onTextInput(text)`, `onRunClick()`, `onLayerSelect(layer)`, `onHeadSelect(head)`
*   **VisualizationEngine -> UI (描画):** Canvas/SVG API 呼び出し

---

**注意点:**

*   この設計書は概要レベルであり、実際の開発ではさらに詳細なクラス設計、エラーハンドリング、状態管理、テスト計画などが必要になります。
*   **アテンションデータの取得とモデル変換が最も重要な前提条件かつ技術的なハードル**となります。使用する DistilBERT モデルが SavedModel 形式でアテンションを出力できること、そしてそれを TFJS Converter が正しく処理できることが不可欠です。
*   可視化部分の実装は、選択する描画ライブラリや表現したい詳細度によって複雑さが大きく変わります。BertViz のようなリッチな表現を目指す場合は、相応の開発コストがかかります。
*   パフォーマンスチューニング（特に大規模なアテンションデータの処理と描画）が重要になる可能性があります。


