## 研究成果インタラクティブ解説HTML 設計書

### 1. はじめに

本設計書は、仕様書で定義された「研究成果インタラクティブ解説HTML」の具体的な実装方針を定めるものです。HTML構造、CSSスタイリング、JavaScriptによるインタラクションロジックについて記述します。

### 2. 全体構造 (HTML)

単一のHTMLファイル (`index.html`) で構成します。主要なセクションとIDは以下の通りです。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>インタラクティブ解説：べき乗則の背後に同期現象の存在</title>
    <link rel="stylesheet" href="style.css">
    <!-- Plotly.js の読み込み -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<body>
    <header>
        <h1>インタラクティブ解説：べき乗則の背後に同期現象の存在</h1>
    </header>

    <main>
        <section id="research-overview">
            <h2>研究の概要</h2>
            <!-- 内容は仕様書 2.2.1. に基づく -->
            <article>
                <h3>研究のポイント</h3>
                <p>...</p>
            </article>
            <article>
                <h3>研究の背景</h3>
                <p>...</p>
            </article>
            <!-- 他、成果、意義・展望、用語解説 -->
            <div id="tooltip-container" class="tooltip-hidden"></div>
        </section>

        <section id="taylors-law-section">
            <h2>テイラーの法則（TL）の解説と視覚化</h2>
            <div class="content-wrapper">
                <div class="explanation-area">
                    <!-- 内容は仕様書 2.2.2. 左側に基づく -->
                    <p>TLの定義: \(y = ax^b\)</p>
                    <p>両対数プロットでは...</p>
                </div>
                <div class="visualization-area">
                    <div id="tl-plot-taylor" class="plot-container"></div>
                    <div class="controls">
                        <button id="btn-async-data">非同期状態のデータ</button>
                        <button id="btn-sync-data">同期状態のデータ</button>
                        <button id="btn-strong-sync-data">強い同期状態のデータ</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="synchronization-section">
            <h2>同期現象の解説と視覚化</h2>
            <div class="content-wrapper">
                <div class="explanation-area">
                    <!-- 内容は仕様書 2.2.3. 左側に基づく -->
                    <p>同期現象の定義...</p>
                    <p>波形比例性 (waveform proportionality) とは...</p>
                </div>
                <div class="visualization-area">
                    <div id="timeseries-plot" class="plot-container"></div>
                    <div id="tl-plot-sync" class="plot-container"></div>
                    <div class="controls">
                        <label for="coupling-strength-slider">結合の強さ:</label>
                        <input type="range" id="coupling-strength-slider" min="0" max="100" value="0">
                        <span id="coupling-strength-value">0</span>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <h3>論文情報</h3>
        <!-- 内容は仕様書 2.3. に基づく -->
        <p>雑誌名: Physical Review Letters</p>
        <p>DOI: <a href="https://doi.org/10.1103/PhysRevLett.134.167202" target="_blank" rel="noopener noreferrer">10.1103/PhysRevLett.134.167202</a></p>
        <!-- 他、問合せ先、作成者情報 -->
    </footer>

    <script src="data.js"></script> <!-- サンプルデータや計算ロジック -->
    <script src="script.js"></script>
</body>
</html>
```

### 3. スタイル (CSS - `style.css`)

*   **レイアウト**:
    *   主要セクション (``, ``) は縦に配置。
    *   各視覚化セクション内の「解説エリア」と「インタラクティブグラフエリア」(`content-wrapper`) はFlexboxやCSS Gridを使用して横並びに配置（レスポンシブ対応として、画面幅が狭い場合は縦並びも考慮）。
*   **フォント・配色**:
    *   全体的に可読性の高いサンセリフ体フォントを使用。
    *   配色は研究内容の科学的なイメージを損なわない、落ち着いたトーンを基本とする。アクセントカラーを適度に用いてインタラクティブ要素を際立たせる。
*   **グラフコンテナ**:
    *   `.plot-container` は適切な幅と高さを指定。
*   **用語解説ツールチップ**:
    *   `#tooltip-container` は通常非表示。JavaScriptで特定用語にマウスオーバーした際に内容をセットし、マウスカーソル付近に表示。
*   **レスポンシブデザイン**:
    *   メディアクエリを使用して、スマートフォンやタブレット端末でも適切に閲覧できるように調整する。

### 4. インタラクションと動的要素 (JavaScript - `script.js`)

**4.1. 共通機能**
*   **グラフ描画ライブラリ**: Plotly.js を使用。
*   **DOM要素の取得**: `document.getElementById` や `document.querySelector` を使用して、操作対象のHTML要素を取得。

**4.2. 研究概要セクション (`#research-overview`)**
*   **用語解説**:
    *   特定の用語（例: `テイラーの法則`）にマウスオーバーイベントリスナーを設定。
    *   `data-term-key` に対応する解説文を `data.js` 内のオブジェクトから取得し、`#tooltip-container` に表示。

**4.3. テイラーの法則（TL）解説・視覚化セクション (`#taylors-law-section`)**
*   **初期表示**:
    *   ページ読み込み時に、`#tl-plot-taylor` に「非同期状態のデータ」に基づくTLプロットをPlotly.jsで描画。
        *   x軸: log(平均M), y軸: log(分散V)。
        *   補助線: $$b=1$$ と $$b=2$$ の線。
*   **データセット選択ボタン**:
    *   各ボタン (`#btn-async-data`, `#btn-sync-data`, `#btn-strong-sync-data`) にクリックイベントリスナーを設定。
    *   クリックされると、対応するサンプルデータ（`data.js` 内に定義）を取得し、`Plotly.react` または `Plotly.newPlot` を使用して `#tl-plot-taylor` のグラフを更新。

**4.4. 同期現象解説・視覚化セクション (`#synchronization-section`)**
*   **初期表示**:
    *   `#timeseries-plot`: 「結合の強さ」スライダーの初期値（例: 0、非同期状態）に対応する時系列データをPlotly.jsで描画。複数（例: 2-3本）の時系列を表示。
    *   `#tl-plot-sync`: 上記時系列データから計算される（平均、分散）ペアに基づき、TLプロットをPlotly.jsで描画。
*   **結合の強さ調整スライダー (`#coupling-strength-slider`)**:
    *   `input` イベントリスナーを設定。
    *   スライダーの値が変更されるたびに以下を実行:
        1.  現在のスライダー値を `#coupling-strength-value` に表示。
        2.  スライダーの値（結合の強さ）に基づいて、新しい時系列データを生成または選択（`data.js` 内の関数またはデータを使用）。
            *   **簡易モデルの例**: 結合振動子モデル（例: 位相振動子モデル）をクライアントサイドで簡易的に計算。結合強度パラメータをスライダー値と連動させる。
                *   0に近い値: 各振動子が独立に振る舞う（非同期）。
                *   中間値: 位相が揃い始める（同期）。
                *   100に近い値: 波形が相似形になる（波形比例性）。
        3.  `#timeseries-plot` を新しい時系列データで更新。
        4.  新しい時系列データから（平均、分散）のペアを計算。
        5.  `#tl-plot-sync` を計算された（平均、分散）ペアで更新し、同期の強まりに伴うTLの変化（特に指数2への遷移）を視覚化。

**4.5. データ管理 (`data.js`)**
*   このファイルには、グラフ表示用のサンプルデータや、動的にデータを生成するための簡易的な数理モデルのロジックを記述。
*   **サンプルデータ構造 (例)**:

```javascript
// data.js
const sampleData = {
    async: { // 非同期
        timeSeries: [
            { name: 'series1', x: [1, 2, 3, ...], y: [10, 12, 9, ...] },
            { name: 'series2', x: [1, 2, 3, ...], y: [5, 4, 6, ...] }
        ],
        taylorPoints: [ // {mean, variance} のペア
            { mean: 50, variance: 200 },
            { mean: 60, variance: 250 },
            // ...
        ]
    },
    sync: { // 同期
        // ...
    },
    strongSync: { // 強い同期 (波形比例性)
        // ...
    }
};

const termExplanations = {
    "taylors-law": "テイラーの法則とは、平均と分散の間に成立するべき乗則のことです。",
    // ... 他の用語
};

// 結合強度に応じた時系列データ生成関数 (簡易版)
function generateTimeSeriesData(couplingStrength) {
    // couplingStrength (0-100) に基づいて時系列データを生成するロジック
    // 例: 2つのサイン波を生成し、couplingStrengthに応じて位相差や振幅比を調整
    const N = 100; // データ点数
    const x = Array.from({length: N}, (_, i) => i);
    let y1 = [], y2 = [];

    const phase_shift = (1 - couplingStrength / 100) * Math.PI; // 結合が強いほど位相差0
    const amplitude_ratio = 1 + (couplingStrength / 100) * 0.5; // 結合が強いほど振幅が似る（ここではy2をy1の定数倍に近づける）


    for (let i = 0; i  70) { // 強い同期の模擬
             y2.push(y1[i] * amplitude_ratio * (1 + (Math.random()-0.5)*0.1) ); // y1の定数倍に近い形
        } else {
             y2.push(Math.sin(i * 0.1 + phase_shift) + Math.random() * 0.2);
        }
    }
    return [
        { name: 'series1', x: x, y: y1, type: 'scatter', mode: 'lines' },
        { name: 'series2', x: x, y: y2, type: 'scatter', mode: 'lines' }
    ];
}

// 時系列データからテイラーの法則プロット用データを計算する関数
function calculateTaylorPoints(timeSeriesArray) {
    // timeSeriesArray内の各時系列データの平均と分散を計算し、
    // [{mean, variance}, ...] の形式で返す
    // このデモでは、単純化のため、複数の時系列「区間」や「グループ」があると仮定して、
    // 各グループの平均と分散をプロットする。
    // ここでは、簡略化のため固定のサンプルデータを返すか、
    // もしくは、複数の時系列データがあるとして、それぞれの平均・分散を計算する。
    // 今回の研究の文脈では、空間的に異なる地点の個体群時系列などが該当する。
    // このインタラクティブデモでは、複数の「模擬的な個体群」の平均と分散をプロットする。
    // 簡単のため、ここでは固定値を返す。実際の研究では多数のデータ点が必要。
    if (!timeSeriesArray || timeSeriesArray.length === 0) return [];

    let points = [];
    // 例えば、timeSeriesArrayの各要素が1つの「個体群」の時系列データだとして
    // それぞれの平均と分散を計算する。
    // この例では、簡略化のため、与えられた時系列全体を1つのデータセットとして、
    //そこから複数のサブセットの平均・分散を出すのは複雑なので、
    //ここでは「結合の強さ」に応じて事前に用意されたような点を返すようにする。

    // デモ用：結合の強さに応じてTLプロットの点のばらつきと傾きが変わるようにする
    const strength = parseFloat(document.getElementById('coupling-strength-slider').value);
    const numPoints = 10;
    const baseMean = 50;
    const baseVariance = 200;

    for (let i = 0; i p.mean), y: points.map(p=>p.variance), mode: 'markers', type: 'scatter' }];
}
```

**4.6. Plotly.js グラフ設定**
*   **TLプロット (`#tl-plot-taylor`, `#tl-plot-sync`)**:
    *   `type: 'scatter'`, `mode: 'markers'`
    *   `layout`: x軸ラベル `log(平均M)`、y軸ラベル `log(分散V)`。軸の範囲はデータに応じて自動調整または固定。
    *   補助線 (指数 $$b=1, b=2$$): `layout.shapes` を使用して線を描画。両対数プロットなので、傾き1と2の直線となる。
*   **時系列グラフ (`#timeseries-plot`)**:
    *   `type: 'scatter'`, `mode: 'lines'`
    *   `layout`: x軸ラベル `時間`、y軸ラベル `値`。

### 5. ファイル構成

```
/ (ルートディレクトリ)
|-- index.html
|-- style.css
|-- script.js
|-- data.js
```

### 6. 使用ライブラリとバージョン

*   **Plotly.js**: 最新版をCDN (`https://cdn.plot.ly/plotly-latest.min.js`) から利用。

### 7. その他考慮事項

*   **アクセシビリティ**:
    *   ボタンやスライダーなどのインタラクティブ要素に適切な `aria-label` を付与。
    *   キーボード操作でのアクセスも考慮（特にスライダー）。
    *   色のコントラスト比に注意。
*   **パフォーマンス**:
    *   クライアントサイドでの数理モデル計算は、負荷が高くなりすぎないように簡易的なものに留める。
    *   Plotly.jsのグラフ更新は `Plotly.react` を使用することで、効率的な再描画を目指す。
*   **エラーハンドリング**:
    *   データの読み込み失敗や予期せぬ値に対する基本的なエラーハンドリングは考慮しない（プロトタイプとしての単純化）。

この設計書に基づき、HTML、CSS、JavaScriptファイルを実装することで、仕様書で定義されたインタラクティブな解説ページを作成できます。
