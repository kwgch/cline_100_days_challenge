## 2. アーキテクチャ設計書

### 2.1. システム構成図

```mermaid
graph TD
    subgraph Browser
        UI[User Interface (HTML/CSS/JS)] -- User Input --> Controller
        Controller -- Text --> Preprocessor
        Preprocessor -- Tokenized Input --> InferenceEngine
        Controller -- Load Command --> ModelLoader
        ModelLoader -- Model --> InferenceEngine
        InferenceEngine -- Attention Tensors & Output --> Postprocessor
        Postprocessor -- Formatted Data --> VisualizationEngine
        Postprocessor -- Output Text --> UI
        VisualizationEngine -- Rendering Commands --> UI
        UI -- User Interaction (Layer/Head Selection) --> VisualizationEngine
    end

    subgraph Backend/Preprocessing (事前に実施)
        OriginalModel(DistilBERT Model - e.g., SavedModel) --> Converter(TensorFlow.js Converter)
        Converter -- Optimized & Attention Output --> TFJSModel[TFJS GraphModel Files]
    end

    TFJSModel -- Loads --> ModelLoader

    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style Controller fill:#ccf,stroke:#333,stroke-width:2px
    style ModelLoader fill:#ccf,stroke:#333,stroke-width:2px
    style Preprocessor fill:#ccf,stroke:#333,stroke-width:2px
    style InferenceEngine fill:#ccf,stroke:#333,stroke-width:2px
    style Postprocessor fill:#ccf,stroke:#333,stroke-width:2px
    style VisualizationEngine fill:#ccf,stroke:#333,stroke-width:2px
    style TFJSModel fill:#lightgrey,stroke:#333,stroke-width:2px
```

### 2.2. コンポーネント定義

*   **UI (User Interface):**
    *   役割: ユーザーとのインタラクションを担当。テキスト入力、実行ボタン、レイヤー/ヘッド選択、結果表示、アテンション可視化描画領域を提供。
    *   実装: HTML, CSS, JavaScript (フレームワークは任意: React, Vue, Angular, Vanilla JS など)
*   **Controller:**
    *   役割: UI イベントをハンドリングし、各コンポーネントへの処理を指示する。アプリケーション全体の制御フローを管理。
    *   実装: JavaScript
*   **Model Loader:**
    *   役割: 事前に変換された TensorFlow.js モデルファイルを非同期で読み込む。
    *   実装: JavaScript (TensorFlow.js `tf.loadGraphModel` API を使用)
*   **Preprocessor:**
    *   役割: ユーザーが入力したテキストを、モデルが必要とする形式（トークン ID、アテンションマスクなど）に変換する。Tokenizer の処理を含む。
    *   実装: JavaScript (Hugging Face Tokenizers の JS 実装や、それに準ずる処理)
*   **Inference Engine:**
    *   役割: 読み込まれたモデルと前処理済みの入力データを用いて、推論を実行し、モデルの出力（最終的な予測結果とアテンション重みテンソル）を取得する。
    *   実装: JavaScript (TensorFlow.js `model.executeAsync` API を使用)
*   **Postprocessor:**
    *   役割: 推論エンジンの出力（テンソル）を、UI 表示や可視化エンジンが扱いやすい形式（例: 文字列、整形された数値配列）に変換する。
    *   実装: JavaScript (TensorFlow.js Tensor API を使用)
*   **Visualization Engine:**
    *   役割: 整形されたアテンションデータを受け取り、ユーザーの選択（レイヤー/ヘッド）に応じて、指定された形式（ヘッドビュー、モデルビュー）で Canvas や SVG 上に可視化を描画する。インタラクション（マウスオーバーなど）を処理する。
    *   実装: JavaScript (描画ライブラリ: D3.js, Konva.js, p5.js, or native Canvas/SVG API)
*   **TFJS Model:**
    *   役割: TensorFlow.js で読み込み可能な形式に変換された DistilBERT モデルファイル (`model.json` とバイナリの重みファイル群)。アテンション重みがNamed Outputとして定義されている必要がある。

### 2.3. データフロー

1.  **初期化:** アプリケーション起動時に、Model Loader が TFJS Model を非同期で読み込む。UI はロード状態を表示。
2.  **テキスト入力:** ユーザーが UI にテキストを入力する。
3.  **推論開始:** ユーザーが実行ボタンをクリック。Controller がイベントを捕捉。
4.  **前処理:** Controller は Preprocessor にテキストを渡し、トークン ID とアテンションマスクに変換させる。
5.  **推論実行:** Controller は Inference Engine に、読み込み済みのモデルと前処理済みデータを渡して推論実行を指示。
6.  **出力取得:** Inference Engine はモデルの出力テンソル（予測結果、全レイヤーのアテンション重み）を返す。
7.  **後処理:** Controller は Postprocessor に出力テンソルを渡し、表示・可視化に適した形式に変換させる。
8.  **結果表示:** Controller は整形された予測結果を UI に渡して表示させる。
9.  **可視化データ準備:** Controller は整形されたアテンションデータを Visualization Engine に渡す。
10. **可視化描画:** Visualization Engine は、初期設定（例: レイヤー0、ヘッド0）またはユーザーが UI で選択したレイヤー/ヘッドに基づき、アテンションを Canvas/SVG 上に描画する。
11. **インタラクション:** ユーザーが UI でレイヤーやヘッドを選択すると、Visualization Engine が対応するアテンションデータを再描画する。マウスオーバーなどのイベントも Visualization Engine が処理。

### 2.4. 技術スタック

*   **フロントエンド:** HTML5, CSS3, JavaScript (ES6+)
*   **機械学習:** TensorFlow.js (`@tensorflow/tfjs`)
*   **トークナイザ:** Hugging Face Tokenizers の JS 実装、または SentencePiece.js など、使用する DistilBERT モデルに合わせたもの。
*   **可視化:** D3.js, p5.js, Konva.js, Chart.js, または Native Canvas/SVG API (要件に応じて選択)
*   **UI フレームワーク (任意):** React, Vue, Angular, Svelte など
*   **開発環境:** Node.js, npm/yarn, Webpack/Vite などのモジュールバンドラ

### 2.5. モデル準備 (前提条件)

*   使用する DistilBERT モデル (例: Hugging Face から入手) を TensorFlow SavedModel 形式で準備する。
*   SavedModel をエクスポートする際に、各レイヤーのアテンションスコアをモデルの出力として含めるように定義する (`output_attentions=True` に相当する設定)。
*   TensorFlow.js Converter (`tensorflowjs_converter`) を使用し、アテンション出力を含む SavedModel を TensorFlow.js GraphModel 形式に変換する。
    ```bash
    tensorflowjs_converter --input_format=tf_saved_model \
                           --output_node_names='output_0,output_1,attention_scores_layer_0,...' \
                           --saved_model_tags=serve \
                           /path/to/saved_model \
                           /path/to/tfjs_model
    ```
    ※ `--output_node_names` には、モデルの最終出力と、各レイヤーのアテンションスコアに対応するテンソル名を指定する必要がある。
