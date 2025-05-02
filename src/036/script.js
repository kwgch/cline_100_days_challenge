// https://huggingface.co/Xenova/distilbert-base-uncased/blob/main/tokenizer.json
// https://huggingface.co/Xenova/distilbert-base-uncased/blob/main/tokenizer_config.json
import * as transformers from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';
const modelName = 'Xenova/distilbert-base-uncased';
let tokenizer = null;
let model = null;

// --- 要素の参照 (グローバルまたは initialize 後に取得) ---
let initialLoadingElement;
let inferenceLoadingElement;
let runButton;
let statusDiv;
let resultDisplayArea;

// --- 初期化関数 ---
async function initialize() {
    console.log("Initializing...");
    statusDiv = document.getElementById('status'); // 先に取得
    statusDiv.innerText = 'Initializing... Loading Tokenizer...';
    // Load tokenizer
    tokenizer = await transformers.AutoTokenizer.from_pretrained(modelName);
    console.log("Tokenizer loaded.");
    statusDiv.innerText = 'Initializing... Loading Model...';
    // Load model (パスを環境に合わせて確認)
    model = await tf.loadGraphModel('distilbert_tfjs_model/model.json');
    console.log("Model loaded");
    statusDiv.innerText = 'Initialization Complete. Ready.';
}
// アテンションデータを JavaScript 配列に変換する関数 (配列入力版 - 順序修正)
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

// --- Visualization Engine ---
let visData = {
    tokens: [],
    attentionMatrices: [], // [layer][head][from][to]
    numLayers: 0,
    numHeads: 0,
    seqLen: 0
};
let selectedLayer = 0;
let selectedHead = 0;

const svg = d3.select("#attentionSvg");
// const svgWidth = +svg.attr("width");
const svgHeight = +svg.attr("height");
// ★ margin をスマホ用に調整 ★
// const margin = { top: 20, right: 150, bottom: 20, left: 150 };
const margin = { top: 20, right: 100, bottom: 20, left: 100 };
// const margin = { top: 20, right: 50, bottom: 20, left: 50 }; // 左右マージンを減らす
// const innerWidth = svgWidth - margin.left - margin.right;
// const innerHeight = svgHeight - margin.top - margin.bottom;

const container = document.getElementById('visualization');
const containerWidth = container.clientWidth; // 親コンテナの現在の幅を取得
const svgWidth = containerWidth; // SVG幅をコンテナ幅に合わせる
const innerWidth = svgWidth - margin.left - margin.right; // 新しい内部幅

const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
const gLines = g.append("g").attr("class", "attention-lines");
const gTokensLeft = g.append("g").attr("class", "tokens-left");
const gTokensRight = g.append("g").attr("class", "tokens-right")
    .attr("transform", `translate(${innerWidth}, 0)`);

const layerSelector = document.getElementById('layerSelector');
const headSelector = document.getElementById('headSelector');

// スケール (updateVisualizationData で設定)
let yScale = d3.scalePoint();
let opacityScale = d3.scaleLinear().range([0.05, 0.8]).clamp(true); // clamp で範囲内に収める

function setupVisualizationControls() {
    layerSelector.innerHTML = '';
    let firstAvailableLayerIndex = -1;
    // null でないレイヤーのインデックスをオプションにする
    visData.attentionMatrices.forEach((layerData, index) => {
        if (layerData !== null) {
            const option = document.createElement('option');
            option.value = index; // レイヤーのインデックス (0-5) を値にする
            option.text = `Layer ${index}`;
            layerSelector.appendChild(option);
            if (firstAvailableLayerIndex === -1) {
                firstAvailableLayerIndex = index; // 最初に有効なレイヤーインデックスを記録
            }
        }
    });

    // 最初に選択可能なレイヤーを選択状態にする
    selectedLayer = firstAvailableLayerIndex !== -1 ? firstAvailableLayerIndex : 0; // 有効なものがなければ0
    layerSelector.value = selectedLayer;


    headSelector.innerHTML = '';
    for (let i = 0; i < visData.numHeads; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = `Head ${i}`;
        headSelector.appendChild(option);
    }
    // 最初に選択可能なヘッドを選択状態にする
    selectedHead = 0; // デフォルトは0
    headSelector.value = selectedHead;

    // イベントリスナー (変更なし)
    layerSelector.onchange = () => {
        selectedLayer = +layerSelector.value;
        updateAttentionVisualization();
    };
    headSelector.onchange = () => {
        selectedHead = +headSelector.value;
        updateAttentionVisualization();
    };
}

function updateAttentionVisualization() {
    if (!visData.attentionMatrices || visData.numLayers === 0 || visData.numHeads === 0) return;

    const layerData = visData.attentionMatrices[selectedLayer];
    if (!layerData) {
        console.warn(`No attention data for layer ${selectedLayer}`);
        g.selectAll("*").remove();
        return;
    }
    const attentionScores = layerData[selectedHead]; // [seqLen, seqLen]

    const maxScore = d3.max(attentionScores, row => d3.max(row));
    opacityScale.domain([0, maxScore || 0.1]);

    // --- トークン描画 (x座標修正) ---
    gTokensLeft.selectAll(".token-text")
        .data(visData.tokens, (d, i) => i)
        .join(
            enter => enter.append("text")
                .attr("class", "token-text")
                .attr("x", 0) // ★ 修正: テキスト右端を x=0 に ★
                .attr("y", (d, i) => yScale(i))
                .attr("dy", "0.32em")
                .attr("text-anchor", "end") // 右揃え
                .text(d => d)
                .on("mouseover", (event, i) => handleTokenMouseOver(event, i)) // イベントハンドラにインデックスを渡す
                .on("mouseout", handleMouseOut),
            update => update
                .attr("y", (d, i) => yScale(i)) // Y座標は更新される可能性あり
                .text(d => d),
            exit => exit.remove()
        );

    gTokensRight.selectAll(".token-text")
        .data(visData.tokens, (d, i) => i)
        .join(
            enter => enter.append("text")
                .attr("class", "token-text")
                .attr("x", 0) // ★ 修正: テキスト左端を x=0 (gTokensRight内で) に ★
                .attr("y", (d, i) => yScale(i))
                .attr("dy", "0.32em")
                .attr("text-anchor", "start") // 左揃え
                .text(d => d)
                .on("mouseover", (event, i) => handleTokenMouseOver(event, i))
                .on("mouseout", handleMouseOut),
            update => update
                .attr("y", (d, i) => yScale(i))
                .text(d => d),
            exit => exit.remove()
        );


    // --- アテンション線描画 (x1, x2 修正) ---
    const lineMargin = 5; // テキストと線の間の隙間 (ピクセル)

    const attentionData = [];
    for (let i = 0; i < visData.seqLen; i++) {
        for (let j = 0; j < visData.seqLen; j++) {
            // パディングトークンへのアテンションは描画しない
            if (visData.tokens[i] === '[PAD]' || visData.tokens[j] === '[PAD]') continue;
            attentionData.push({ from: i, to: j, score: attentionScores[i][j] });
        }
    }

    gLines.selectAll(".attention-line")
        .data(attentionData.filter(d => d.score > 0.01), d => `${d.from}-${d.to}`)
        .join(
            enter => enter.append("line")
                .attr("class", "attention-line")
                .attr("x1", lineMargin) // ★ 修正: 左トークン右端 + マージン ★
                .attr("y1", d => yScale(d.from))
                .attr("x2", innerWidth - lineMargin) // ★ 修正: 右トークン左端 - マージン ★
                // .attr("x2", innerWidth ) // ★ 修正: 右トークン左端 - マージン ★
                .attr("y2", d => yScale(d.to))
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("data-from", d => d.from)
                .attr("data-to", d => d.to)
                .on("mouseover", handleLineMouseOver)
                .on("mouseout", handleMouseOut)
                .on("click", handleLineClick) // ★ クリックリスナーを追加 ★
                .attr("stroke-opacity", d => opacityScale(d.score)),
            update => update
                .attr("x1", lineMargin) // ★ 修正 ★
                .attr("y1", d => yScale(d.from))
                .attr("x2", innerWidth - lineMargin) // ★ 修正 ★
                .attr("y2", d => yScale(d.to))
                .attr("stroke-opacity", d => opacityScale(d.score)),
            exit => exit.remove()
        );
}


function updateVisualizationData(tokens, attentionMatrices) {
    visData.tokens = tokens;
    visData.attentionMatrices = attentionMatrices;
    visData.numLayers = attentionMatrices.filter(layer => layer !== null).length;
    const firstValidLayerData = attentionMatrices.find(layer => layer !== null);
    visData.numHeads = firstValidLayerData ? firstValidLayerData.length : 0;
    visData.seqLen = tokens.length;

    if (visData.numLayers === 0 || visData.numHeads === 0 || visData.seqLen === 0) {
        console.warn("Insufficient valid data for visualization.");
        g.selectAll("*").remove();
        layerSelector.innerHTML = '<option>N/A</option>';
        headSelector.innerHTML = '<option>N/A</option>';
        // SVGサイズをリセットまたは最小にする
        svg.attr("width", 300).attr("height", 100); // 例
        return;
    }

    // --- SVG サイズとスケールの動的計算 ---
    const container = document.getElementById('visualization');
    const containerWidth = container.clientWidth; // 親コンテナの現在の幅を取得

    const svgWidth = containerWidth; // SVG幅をコンテナ幅に合わせる
    const innerWidth = svgWidth - margin.left - margin.right; // 新しい内部幅

    // 最小高さを確保 (例: 1トークンあたり18px)
    const minHeightPerToken = 18; // この値を調整して行間を制御
    const requiredHeight = minHeightPerToken * visData.seqLen;
    const svgHeight = requiredHeight + margin.top + margin.bottom; // SVG全体の高さ
    const innerHeight = requiredHeight; // 描画領域の高さ

    // SVG 要素のサイズを更新
    svg.attr("width", svgWidth)
       .attr("height", svgHeight); // 高さを動的に設定

    // g 要素の位置を更新 (マージンが変わった場合)
    g.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 右側トークン群の位置を更新
    gTokensRight.attr("transform", `translate(${innerWidth}, 0)`);

    // Y スケールの range を更新
    yScale.domain(d3.range(visData.seqLen)).range([0, innerHeight]).padding(0.5);
    // --- 動的計算ここまで ---

    setupVisualizationControls();
    updateAttentionVisualization();
}

function handleTokenMouseOver(event, tokenIndex) {
    gLines.selectAll(".attention-line")
        .classed("dimmed", true); // 一旦すべて暗く
    gLines.selectAll(".attention-line")
        .filter(lineData => lineData.from === tokenIndex || lineData.to === tokenIndex) // 該当する線を選択
        .classed("dimmed", false) // 暗くするのを解除
        .attr("stroke-opacity", 0.9) // 強調
        .raise(); // 最前面へ
}

function handleLineMouseOver(event, d) {
    gLines.selectAll(".attention-line").classed("dimmed", true);
    d3.select(event.target)
        .classed("dimmed", false)
        .attr("stroke-opacity", 0.9)
        .raise();
    // 対応するトークンを強調表示 (実装は省略)
    gTokensLeft.selectAll(".token-text").filter((td, i) => i === d.from).style("font-weight", "bold");
    gTokensRight.selectAll(".token-text").filter((td, i) => i === d.to).style("font-weight", "bold");
}

function handleMouseOut(event, d) {
    gLines.selectAll(".attention-line")
        .classed("dimmed", false) // 暗くするのを解除
        .attr("stroke-opacity", ld => opacityScale(ld.score)); // 元の透明度に戻す
    // トークンの強調表示を解除
    gTokensLeft.selectAll(".token-text").style("font-weight", null);
    gTokensRight.selectAll(".token-text").style("font-weight", null);
}

// ★ 新しい関数: 線がクリックされたときの処理 ★
function handleLineClick(event, d) {
    // d オブジェクトから情報を取得
    const fromToken = visData.tokens[d.from];
    const toToken = visData.tokens[d.to];
    const score = d.score;

    // ステータス表示エリアを取得して更新
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        // スコアを小数点以下4桁で表示
        statusDiv.innerText = `Attention Score: "${fromToken}" (L) --> "${toToken}" (R) = ${score.toFixed(4)}`;
    }

    // (オプション) クリックされた線を一時的に強調表示
    gLines.selectAll(".attention-line").attr("stroke", "steelblue").attr("stroke-width", 1.5); // 他の線をリセット
    d3.select(event.target) // クリックされた要素を選択
        .attr("stroke", "red") // 色を変更
        .attr("stroke-width", 2.5) // 太くする
        .raise(); // 最前面へ
}

// --- DOMContentLoaded イベントリスナー ---
document.addEventListener('DOMContentLoaded', async () => {
    // ローディング要素を取得
    initialLoadingElement = document.getElementById('initial-loading');
    inferenceLoadingElement = document.getElementById('inference-loading');
    runButton = document.getElementById('runButton');
    resultDisplayArea = document.getElementById('resultDisplayArea');

    try {
        await initialize(); // initialize の完了を待つ
    } catch (error) {
        console.error("Initialization failed:", error);
        if (initialLoadingElement) {
            initialLoadingElement.innerHTML = `<p style="color: red; text-align: center;">Initialization Failed!<br>${error.message}</p>`;
        }
        if (statusDiv) statusDiv.innerText = 'Initialization Failed!';
        return; // 初期化失敗時はここで終了
    } finally {
         // 初期ロードオーバーレイをフェードアウトさせて非表示
         if (initialLoadingElement) {
            initialLoadingElement.style.opacity = '0';
            setTimeout(() => { initialLoadingElement.style.display = 'none'; }, 300); // 0.3秒後に非表示
         }
    }

    // ----- Run Button Event Listener -----
    runButton.addEventListener('click', async () => {
        const textInput = document.getElementById('textInput').value;
        console.log("Running for input:", textInput);

        // --- UI 更新: ローディング開始 ---
        runButton.disabled = true;
        if (inferenceLoadingElement) inferenceLoadingElement.style.display = 'flex';
        statusDiv.innerText = 'Processing...';
        resultDisplayArea.innerText = ''; // 前回の結果をクリア
        // ---

        let inputIdsTensorInt32;
        let attentionMaskTensorInt32;
        let tokenizedOutputs; // catch/finally でアクセスするため外で宣言

        try {
            // 1. Preprocess with tokenizer
            console.log("Tokenizing...");
            statusDiv.innerText = 'Processing... Tokenizing...';
            tokenizedOutputs = await tokenizer(textInput, { // await をつける (非同期の場合がある)
                padding: 'max_length',
                truncation: true,
                max_length: 128,
            });
            console.log("Tokenized outputs (from tokenizer):", tokenizedOutputs);

            // 2. Create tf.Tensor manually
            console.log("Creating TensorFlow.js Tensors...");
            statusDiv.innerText = 'Processing... Creating Tensors...';
            const inputIdsData = tokenizedOutputs.input_ids.data;
            const inputIdsShape = tokenizedOutputs.input_ids.dims;
            const attentionMaskData = tokenizedOutputs.attention_mask.data;
            const attentionMaskShape = tokenizedOutputs.attention_mask.dims;
            const inputIdsNumberArray = Array.from(inputIdsData, bigint => Number(bigint));
            const attentionMaskNumberArray = Array.from(attentionMaskData, bigint => Number(bigint));
            inputIdsTensorInt32 = tf.tensor(inputIdsNumberArray, inputIdsShape, 'int32');
            attentionMaskTensorInt32 = tf.tensor(attentionMaskNumberArray, attentionMaskShape, 'int32');
            const modelInputsForExecution = {
                'input_ids': inputIdsTensorInt32,
                'attention_mask': attentionMaskTensorInt32
            };
            console.log("Ready for execution with Tensors (int32):", modelInputsForExecution);

            // 3. Run inference
            console.log('Running inference with executeAsync...');
            statusDiv.innerText = 'Processing... Running Inference...';
            const outputTensors = await model.executeAsync(modelInputsForExecution);
            console.log("Raw Output Tensors:", outputTensors);

            // --- 結果処理 (tf.tidy はベクトル抽出部分でのみ使用) ---
            let resultText = "";
            const lastHiddenStateIndex = 1;
            const attentionIndices = [0, 2, 3, 4, 5, 6];
            let clsVectorSnippet = "[CLS] vector not extracted.";

            tf.tidy(() => { // ベクトル抽出のみ tidy で囲む
                if (Array.isArray(outputTensors) && outputTensors.length > lastHiddenStateIndex && outputTensors[lastHiddenStateIndex] instanceof tf.Tensor) {
                    const lastHiddenStateTensor = outputTensors[lastHiddenStateIndex];
                    resultText += `Output ('last_hidden_state' @ index ${lastHiddenStateIndex}) Shape: ${lastHiddenStateTensor.shape}\n`;
                    const clsVector = lastHiddenStateTensor.slice([0, 0, 0], [1, 1, lastHiddenStateTensor.shape[2]]);
                    const clsVectorSqueezed = clsVector.squeeze();
                    const vectorLength = clsVectorSqueezed.shape[0];
                    const snippetLength = Math.min(10, vectorLength);
                    const clsVectorFirst10 = clsVectorSqueezed.slice([0], [snippetLength]);
                    const clsVectorArray = clsVectorFirst10.arraySync();
                    clsVectorSnippet = `[${clsVectorArray.map(v => v.toFixed(4)).join(', ')}, ...]`;
                } else {
                    resultText += 'Could not find last_hidden_state tensor.\n';
                }
                 // アテンション形状表示は省略しても良い
                // attentionIndices.forEach(...);
            }); // tf.tidy の終わり

            resultText += `\n[CLS] Vector Snippet: ${clsVectorSnippet}\n`;
            resultDisplayArea.innerText = resultText; // 推論結果部分を表示

            // 4a. Get attention matrices
            console.log("Formatting attention matrices...");
            statusDiv.innerText = 'Processing... Formatting Attentions...';
            const attentionMatrices = await formatAttentionOutput(outputTensors);

            // 4b. Generate tokens for visualization
            const tokensForVis = generateTokensForVis(tokenizedOutputs, tokenizer);

            // 4c. Update visualization
            console.log("Updating visualization...");
            statusDiv.innerText = 'Processing... Updating Visualization...';
            if (attentionMatrices && tokensForVis.length > 0 && attentionMatrices.length > 0) {
                resultDisplayArea.innerText += `\nTokens for Vis: ${JSON.stringify(tokensForVis)}`;
                updateVisualizationData(tokensForVis, attentionMatrices);
                statusDiv.innerText = 'Processing Complete. Visualization updated.'; // 成功時の最終ステータス
            } else {
                statusDiv.innerText = 'Processing Complete. Visualization update failed (no data?).';
                g.selectAll("*").remove(); // 可視化をクリア
            }

            // 5. Dispose output tensors
            tf.dispose(outputTensors);
            console.log("Output tensors disposed.");

        } catch (error) {
            console.error('Error during processing:', error);
            resultDisplayArea.innerText = `Error: ${error.message}\n${error.stack}`;
            statusDiv.innerText = 'Error occurred during processing.'; // エラー時のステータス
        } finally {
            // --- UI 更新: ローディング終了 ---
            runButton.disabled = false;
            if (inferenceLoadingElement) inferenceLoadingElement.style.display = 'none';
            // statusDiv は try または catch 内で最終状態が設定されている
            // ---

            // 6. Dispose input tensors
            if (inputIdsTensorInt32) tf.dispose(inputIdsTensorInt32);
            if (attentionMaskTensorInt32) tf.dispose(attentionMaskTensorInt32);
            console.log("Input tensors disposed.");
        }
    });
});

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
