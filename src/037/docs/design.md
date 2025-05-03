## 設計書概要

### 1. 全体構成

*   **index.html**: UIレイアウトを定義。以下の要素を含む:
    *   タイトル (`h1`)
    *   ステータス表示用 `div` (`#status`)
    *   入力プロンプト用 `textarea` (`#prompt`)
    *   最大生成長設定用 `input[type=number]` (`#maxLength`)
    *   生成実行ボタン (`#generateButton`)
    *   生成中インジケーター `span` (`#loadingIndicator`)
    *   生成結果表示用 `div` (`#output`)
    *   確率表示用 `div` (`#probabilities`)
    *   `transformers.js` ライブラリと `script.js` を `` で読み込む。
*   **script.js**: アプリケーションの主要ロジックを実装。
    *   `initialize`: モデル (`AutoModelForCausalLM`) とトークナイザー (`AutoTokenizer`) の非同期読み込みと初期化。
    *   `generateText`: ボタンクリック時に呼び出され、テキストエンコード、生成ループ、デコード、UI更新を行う。
    *   `softmax`: Logitsを確率に変換するヘルパー関数。
    *   グローバル変数: `model`, `tokenizer` インスタンスを保持。
    *   定数: モデルパス (`MODEL_PATH`), 表示する確率上位件数 (`TOP_K_PROBS`)。
*   **CSS**: `index.html` 内の `` タグで基本的なレイアウトとスタイルを定義。
*   **モデルファイル**: `MODEL_PATH` で指定されたディレクトリに配置された量子化ONNXモデル (`decoder_model_merged.onnx` 等) とトークナイザー関連ファイル (`config.json`, `tokenizer.json`, `spiece.model` 等)。

### 2. データフロー (`generateText` 関数の詳細)

1.  **入力取得**: `#prompt` から入力テキスト、`#maxLength` から最大生成トークン数を取得。
2.  **UI更新**: ボタン無効化、インジケーター表示。
3.  **エンコード**: `tokenizer(inputText, { return_tensors: 'pt' })` を呼び出し、入力テキストをテンソル形式の `input_ids` に変換。`.data` プロパティから数値配列を取得。
4.  **BOSトークン処理**: `tokenizer.bos_token_id` が数値であれば、配列の先頭に追加。
5.  **生成ループ開始**: `generatedTokenIds` を初期化し、`maxNewTokens` 回繰り返す。
6.  **入力テンソル作成**: ループ内で、現在の `generatedTokenIds` から `transformers.js` の `Tensor` オブジェクト (`input_ids`, `attention_mask`) を作成（型は `int64`）。
7.  **モデル推論**: `model.forward(inputs)` を `await` で呼び出し、モデルの出力を取得。
8.  **Logits抽出**: 出力オブジェクトから `logits` テンソルを取得。
9.  **確率計算**: `logits` テンソルの最後のトークンに対応する部分を取り出し、`softmax` 関数で確率分布（数値配列）に変換。
10. **上位確率抽出**: 確率分布をソートし、上位 `TOP_K_PROBS` 件の `{id, prob}` オブジェクトを取得。
11. **確率表示**: 上位トークンを `tokenizer.decode` でデコードし、IDと確率と共に `#probabilities` エリアのHTMLを更新。
12. **次トークン選択**: 最も確率の高いトークンのID (`topProbs.id`) を `nextTokenId` として取得 (`argmax`)。
13. **EOS判定**: `nextTokenId` が `tokenizer.eos_token_id` と一致すればループを終了。
14. **ID更新**: `nextTokenId` を `generatedTokenIds` 配列に追加。
15. **部分結果表示**: 現在の `generatedTokenIds` をデコードし、`#output` に表示（生成中を示す `...` を付加）。
16. **ループ終了後**: 最終的な `generatedTokenIds` をデコードし、`#output` を最終結果で更新。
17. **UI復元**: ボタン有効化、インジケーター非表示。
18. **エラー処理**: `try...catch` ブロックで初期化および生成中のエラーを捕捉し、コンソールとUIに表示。

### 3. 主要コンポーネント (`script.js` 内)

*   **`initialize()`**:
    *   `AutoTokenizer.from_pretrained(MODEL_PATH, { local_files_only: true })` でトークナイザーをロード。
    *   `AutoModelForCausalLM.from_pretrained(MODEL_PATH, { quantized: true, progress_callback: ... })` で量子化ONNXモデルをロード。
*   **`generateText()`**: 上記データフローのロジックを実装。非同期処理 (`async`/`await`) を多用。
*   **`softmax(logitsArray)`**: 標準的なソフトマックス計算を実装。
*   **入力テンソル作成**: ループ内で `generatedTokenIds` (数値配列) から `BigInt64Array` を経由して `transformers.js` の `Tensor` オブジェクト (`input_ids`, `attention_mask`) を生成。
*   **Logits データアクセス**: `logits.dims` と `logits.data.slice()` を使って特定のトークン位置の logits を抽出。

### 4. 実装上のポイント・課題

*   **`transformers.js` API 依存**: `Tensor` クラスのコンストラクタ、`forward` メソッドの引数・戻り値、テンソルデータへのアクセス方法 (`.data`, `.dims`) は `transformers.js` のバージョンや内部実装に依存するため、ライブラリ更新時に互換性がなくなる可能性がある。
*   **BOS/EOS トークン**: トークナイザー設定から `bos_token_id`, `eos_token_id` が正しく取得できるかに依存する。現状 `tokenizer.tokenizer_config` が `undefined` であり、ID がハードコードされていないため、別のモデル/トークナイザーでは動作しない可能性がある。
*   **パフォーマンス**: JavaScriptでのループ処理、テンソル作成、データ抽出、DOM更新が繰り返されるため、長い文章の生成では処理時間がかかる。
*   **エラーハンドリング**: 現在は汎用的なエラー表示のみ。ネットワークエラー、モデル読み込みエラー、推論エラーなど、原因に応じた詳細なフィードバックがあるとより良い。
