# 魔法陣ジェネレーター 設計ノート

## 1. はじめに

このドキュメントは、「魔法陣ジェネレーター」アプリケーションの技術的な設計と内部ロジックについて記述したものです。今後の機能追加や改修の際の参考となることを目的としています。

## 2. プロジェクト構造

-   `index.html`: アプリケーションのメインとなるHTMLファイル。UI要素（入力欄、ボタン、Canvas）を定義し、CSSファイルとJavaScriptファイルを読み込みます。
-   `style.css`: アプリケーションの見た目を定義するCSSファイル。ダークテーマ、レスポンシブ対応、UI要素のスタイリングが含まれます。
-   `script.js`: アプリケーションの主要なロジックを記述したJavaScriptファイル。魔法陣の生成、描画、アニメーション処理を担当します。
-   `README.md`: プロジェクトの概要、使い方などを記載したドキュメント。

## 3. `script.js` の主要な機能とロジック

`script.js` は、以下の主要な部分から構成されています。

### 3.1. 初期化処理

-   `DOMContentLoaded` イベント内で実行されます。
-   HTMLから必要なDOM要素（テキスト入力欄、生成ボタン、Canvas要素）を取得します。
-   Canvasの2Dコンテキストを取得し、内部解像度（`canvasSize`）を設定します。
-   アニメーション制御用のグローバル変数（`animationFrameId`, `currentRotation`, `isAnimating`, `currentMagicCircleData`, `drawingAnimationId`）を初期化します。
-   ページロード時にCanvasに案内メッセージを表示します。

### 3.2. データ準備: `prepareMagicCircleData(text)`

-   **役割**: ユーザーが入力したテキストに基づいて、魔法陣を描画するために必要な全てのパラメータを計算し、オブジェクトとして返します。
-   **入力**: ユーザーが入力した文字列 (`text`)。
-   **処理**:
    -   テキストの長さや文字コードから、点の数 (`numPoints`)、基本半径 (`radius`)、中心座標 (`centerX`, `centerY`) を決定します。
    -   テキストからハッシュ的な計算で `colorSeed` を生成し、これを基に基本線の色 (`lineColor`)、線の太さ (`baseLineWidth`)、色のバリエーション数 (`numVariations`)、色の配列 (`colors`) を決定します。
    -   魔法陣のレイアウト構造（外周リング、シンボルリング内外半径、中央コア半径）を定義します。
-   **出力**: 上記の全パラメータを含むオブジェクト (`data`)。

### 3.3. 描画処理: `drawMagicCircle(data, progress = 1)`

-   **役割**: `prepareMagicCircleData` で生成されたデータと、生成アニメーションの進行度 (`progress`) に基づいて、Canvasに魔法陣を描画します。
-   **入力**:
    -   `data`: `prepareMagicCircleData` が返したオブジェクト。
    -   `progress` (オプション, デフォルト値1): 生成アニメーションの進行度 (0.0: 開始直後 〜 1.0: 完成)。
-   **処理**:
    1.  `ctx.clearRect()`: Canvasをクリアします。
    2.  **発光・回転の準備**: `isAnimating` (完成後アニメーション中か) と `progress` の値に応じて、`ctx.shadowColor`, `ctx.shadowBlur` (発光) や `ctx.rotate` (回転) を設定します。これらは `progress` が1に達し、かつ `isAnimating` がtrueの場合にのみ有効になります。
    3.  **段階的アルファ適用**: `applyProgressiveAlpha(elementProgressStart, elementDuration)` ヘルパー関数を使用し、各描画要素の表示タイミングとフェードイン効果を制御します。`ctx.globalAlpha` を `progress` に応じて調整します。
    4.  **描画シーケンス**:
        -   外側のリング（二重円）
        -   古代文字風シンボル（`drawAncientSymbol` を呼び出し）
        -   中央コアの幾何学図形（多角形、星形、放射線、装飾点、回転図形など）
        各要素は、`progress` の値と `applyProgressiveAlpha` によって、設定されたタイミングで徐々に表示されます。
-   **注意点**: `ctx.save()` と `ctx.restore()` を適切に使用し、回転やアルファ値の変更が他の描画部分に影響しないようにしています。

### 3.4. シンボル描画: `drawAncientSymbol(ctx, seed, cx, cy, size, rotation, baseLineWidth)`

-   **役割**: 単一の古代文字風シンボルを描画します。
-   **入力**: Canvasコンテキスト、シンボル形状を決定するシード値 (`seed`)、中心座標 (`cx`, `cy`)、サイズ (`size`)、回転角度 (`rotation`)、基本線の太さ (`baseLineWidth`)。
-   **処理**:
    -   `seed` に基づいて、シンボルを構成する線分の数や角度、長さを決定します。
    -   `ctx.translate` と `ctx.rotate` を使用して、指定された位置と角度にシンボルを描画します。
    -   線の太さは `baseLineWidth` を基に調整されます。
-   **注意点**: この関数は `drawMagicCircle` から呼び出され、その際の `ctx.globalAlpha` の値を引き継いで描画します。

### 3.5. アニメーション制御

-   **`startDrawingAnimation()` (生成アニメーション)**:
    -   約2.5秒 (`duration`) かけて `progress` を0から1に変化させます。
    -   `requestAnimationFrame` を使用したループ内で、毎フレーム `drawMagicCircle(currentMagicCircleData, progress)` を呼び出します。
    -   `progress` が1に達したら、このアニメーションを終了し、`startAnimationLoop()` を呼び出して完成後アニメーションへ移行します。
    -   アニメーションIDは `drawingAnimationId` で管理されます。
-   **`startAnimationLoop()` (完成後アニメーション)**:
    -   魔法陣が完成した後に呼び出され、回転と発光のアニメーションを開始します。
    -   `requestAnimationFrame` ループ内で `currentRotation` を更新し、`drawMagicCircle(currentMagicCircleData, 1)` を呼び出して再描画します。
    -   アニメーションIDは `animationFrameId` で管理されます。
    -   `isAnimating` フラグを `true` に設定します。
-   **`stopAnimationLoop()` (完成後アニメーション停止)**:
    -   `animationFrameId` をキャンセルし、`isAnimating` を `false` に設定します。
    -   発光効果を消すために、`isAnimating = false` の状態で `drawMagicCircle` を一度呼び出します。

### 3.6. イベントハンドラ

-   `generateButton` の `click` イベント:
    1.  既存の全てのアニメーション（生成中 `drawingAnimationId`、完成後 `animationFrameId`）を停止します。
    2.  `inputText.value` からテキストを取得します。
    3.  `prepareMagicCircleData(text)` を呼び出して、新しい魔法陣のデータを生成し `currentMagicCircleData` に格納します。
    4.  `startDrawingAnimation()` を呼び出して、新しい生成アニメーションを開始します。

## 4. スタイリング (`style.css`) のポイント

-   **ダークテーマ**: 背景色を `#0a0a10`、コンテナ背景を `#1a1a2a` とし、文字色やアクセントカラーもそれに合わせて調整しています。
-   **レスポンシブ対応**: `display: flex` を用いた中央配置や、`viewport` 設定により、基本的なレスポンシブ対応を行っています。
-   **UI要素**: ボタンや入力欄もダークテーマに合わせたスタイルを適用。ボタンにはホバーエフェクトも付与。
-   **Canvas**: 枠線の色をテーマに合わせ、JavaScript側での発光効果を想定してCSSでの `box-shadow` はコメントアウトしています。
-   **モバイル対応**: `touch-action: manipulation;` を `body` に設定し、スマートフォンでのタップ操作時に意図しない画面のズームやスクロールを防いでいます。

## 5. 今後の改善・拡張案 (開発者向け)

-   **コードのモジュール化**: `script.js` が長大化してきたため、描画ロジック、アニメーション制御、データ処理などを別々のモジュールに分割することを検討。
-   **パラメータの外部化・設定UI**: 魔法陣の複雑さ、色、アニメーション速度などをユーザーが調整できるUIを追加する。
-   **描画パターンの追加と選択**: `prepareMagicCircleData` や `drawMagicCircle` 内で、より多様な図形パターンやシンボル生成アルゴリズムを実装し、選択可能にする。
-   **パフォーマンス最適化**:
    -   特にシンボル数や線の数が多い場合に備え、オフスクリーンCanvasを用いたプリレンダリングや、描画処理の最適化を検討。
    -   不要な再計算を避けるためのキャッシュ戦略。
-   **テスト**: 主要な関数のユニットテストや、表示確認のための簡単なテストケースの導入。
-   **エラーハンドリング**: より堅牢なエラーハンドリング（例: Canvas未対応ブラウザなど）。
