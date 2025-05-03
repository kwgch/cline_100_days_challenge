// HTML要素の取得 (probabilities を追加)
const statusElement = document.getElementById('status');
const promptElement = document.getElementById('prompt');
const generateButton = document.getElementById('generateButton');
const outputElement = document.getElementById('output');
const maxLengthElement = document.getElementById('maxLength');
const loadingIndicator = document.getElementById('loadingIndicator');
const probabilitiesElement = document.getElementById('probabilities'); // 確率表示用

// --- 設定 ---
const MODEL_PATH = 'onnx_model_quantized'; // 量子化モデルのパス
const TOP_K_PROBS = 5; // 表示する上位確率の数

// --- グローバル変数 ---
let model = null; // AutoModelForCausalLM オブジェクト
let tokenizer = null; // AutoTokenizer オブジェクト

// --- 初期化処理 (pipeline の代わりに Model と Tokenizer をロード) ---
async function initialize() {
    statusElement.innerText = 'Transformers.js モデルとトークナイザーを初期化中...';
    try {
        // HTMLからクラスを取得
        const AutoTokenizer = window.AutoTokenizer;
        const AutoModelForCausalLM = window.AutoModelForCausalLM;
        if (!AutoTokenizer || !AutoModelForCausalLM) {
             throw new Error("Transformers.js (AutoTokenizer or AutoModelForCausalLM) が読み込まれていません。");
        }

        statusElement.innerText = `トークナイザー (${MODEL_PATH}) を読み込み中...`;
        tokenizer = await AutoTokenizer.from_pretrained(MODEL_PATH, { local_files_only: true }); // ローカルファイルのみ
        console.log('トークナイザー読み込み完了');
        console.log('Tokenizer config:', tokenizer.tokenizer_config); // 今度は取得できるはず

        statusElement.innerText = `モデル (${MODEL_PATH}) を読み込み中... (量子化モデル)`;
        model = await AutoModelForCausalLM.from_pretrained(MODEL_PATH, {
            quantized: true, // 量子化モデルであることを指定
            progress_callback: (progress) => {
                if (progress.status === 'progress' && progress.file.toLowerCase().endsWith('.onnx')) {
                    const percent = progress.total > 0 ? ((progress.loaded / progress.total) * 100).toFixed(1) : 0;
                    statusElement.innerText = `モデルファイル読み込み中: ${progress.file} (${percent}%)`;
                } else if (progress.status !== 'ready' && progress.status !== 'done'){
                    statusElement.innerText = `モデル読み込みステータス: ${progress.status}...`;
                }
            }
        });
        console.log('モデル読み込み完了');

        // 準備完了
        statusElement.innerText = '準備完了！文章を入力して生成ボタンを押してください。';
        generateButton.disabled = false;
        generateButton.innerText = '文章を生成';

    } catch (error) {
        console.error('初期化中にエラーが発生しました:', error);
        statusElement.innerText = `エラー: 初期化に失敗しました。(${error.message})`;
        alert(`初期化エラー:\n${error.message}\n\nモデルパス(${MODEL_PATH})やファイル構成を確認してください。`);
    }
}

// --- ソフトマックス関数 ---
// Transformers.js に組み込みの可能性もあるが、見当たらないので自作
// TensorFlow.js があれば tf.softmax を使えるが、依存を増やさないため簡易実装
function softmax(logitsArray) {
    const maxLogit = Math.max(...logitsArray);
    const expLogits = logitsArray.map(l => Math.exp(l - maxLogit));
    const sumExpLogits = expLogits.reduce((a, b) => a + b, 0);
    return expLogits.map(e => e / sumExpLogits);
}

// --- 文章生成関数 (forward を使い、確率を表示) ---
async function generateText() {
    if (!model || !tokenizer) {
        alert('モデルまたはトークナイザーがまだ準備できていません。');
        return;
    }

    const inputText = promptElement.value.trim();
    if (!inputText) {
        alert('文章の始まりを入力してください。');
        return;
    }

    const maxNewTokens = parseInt(maxLengthElement.value, 10);
    if (isNaN(maxNewTokens) || maxNewTokens <= 0) {
         alert('最大生成トークン数には正の整数を入力してください。');
         return;
     }

    // UI更新
    generateButton.disabled = true;
    loadingIndicator.style.display = 'inline-block';
    outputElement.innerText = '生成中...';
    probabilitiesElement.innerHTML = '生成中...'; // 確率エリアも更新
    console.log(`Generating text with max_new_tokens: ${maxNewTokens}`);

    try {
        // 1. 入力テキストをエンコード
        const { input_ids: initialInputIdsTensor } = tokenizer(inputText, {
            return_tensors: 'pt', // PyTorch形式でIDを取得 (内部で使われるため)
            padding: false,
            truncation: false
        });
        // transformers.js v2.15.0 時点で .tolist() が使えるか不明。dataSyncで代用
        // let currentInputIds = initialInputIdsTensor[0].tolist(); // .tolist() があれば
        let currentInputIds = Array.from(initialInputIdsTensor.data); // .data で TypedArray を取得し Array に変換
        //  // BOS トークン処理 (rinna/gpt2 は T5Tokenizer ベースなので要確認)
        //  if (currentInputIds[0] !== tokenizer.bos_token_id && tokenizer.bos_token_id !== null) {
        //       console.log(`Prepending BOS token ID (${tokenizer.bos_token_id})`);
        //       currentInputIds.unshift(tokenizer.bos_token_id);
        //  }
        // console.log("Initial Encoded input_ids:", currentInputIds);
        // ★★★ BOS トークン処理を修正 ★★★
        // tokenizer.bos_token_id が number 型で、かつ currentInputIds の先頭と異なる場合にのみ unshift する
        if (typeof tokenizer.bos_token_id === 'number' && currentInputIds[0] !== tokenizer.bos_token_id) {
            console.log(`Prepending BOS token ID (${tokenizer.bos_token_id})`);
            currentInputIds.unshift(tokenizer.bos_token_id);
        } else if (typeof tokenizer.bos_token_id !== 'number') {
            console.warn("BOS token ID is not defined or not a number. Skipping prepending BOS token.");
        // BOS トークン ID がない場合、特別な処理はしない
        }
        // ★★★ 修正ここまで ★★★

        console.log("Initial Encoded input_ids:", currentInputIds); // undefined が含まれていないことを確認

        let generatedTokenIds = [...currentInputIds]; // 生成されたID列

        // 2. 生成ループ
        for (let i = 0; i < maxNewTokens; i++) {
            const currentLength = generatedTokenIds.length;
            let nextTokenId;
            let topProbs = [];

            // ★★★ 入力テンソルの作成方法を変更 ★★★
            // transformers.js の Tensor クラスを使用
            // env から Tensor を取得する (v2.16以降?) か、直接インポート
            let Tensor;
            try {
                 const transformers = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@latest");
                 Tensor = transformers.Tensor;
                 if (!Tensor) throw new Error("Tensor class not found in module.");
            } catch(e){
                 console.error("Failed to import Tensor class from transformers.js:", e);
                 throw new Error("Could not get Tensor class. Check transformers.js import.");
            }

            // input_ids を Tensor に変換 (int64型)
            const inputIdsTensor = new Tensor('int64',
                // BigInt に変換する必要がある
                BigInt64Array.from(generatedTokenIds.map(id => BigInt(id))),
                [1, currentLength] // 形状: [batch_size, sequence_length]
            );

            // attention_mask を Tensor に変換 (int64型, すべて1)
            const attentionMaskData = new BigInt64Array(currentLength).fill(1n); // すべて 1n (BigInt)
            const attentionMaskTensor = new Tensor('int64',
                attentionMaskData,
                [1, currentLength]
            );

            // モデルへの入力オブジェクト
            const inputs = {
                'input_ids': inputIdsTensor,
                'attention_mask': attentionMaskTensor
                // position_ids は通常モデルが内部で計算する
            };
            console.log(`Input tensors created for step ${i+1}:`, inputs);
            // ★★★ 修正ここまで ★★★


            // 2b. モデルの forward メソッドを呼び出し
            // output_attentions=true や output_hidden_states=true も指定できる場合がある
            const outputs = await model.forward(inputs);
            // console.log("Model forward outputs:", outputs);

            // 2c. Logits を取得
            const logits = outputs.logits; // 出力オブジェクトから logits を取得
            if (!logits) {
                throw new Error("Logits not found in model output.");
            }

            // 2d. 最後のトークンの Logits を取得し、確率に変換
            // logits は通常 [batch_size, sequence_length, vocab_size] の形状
            // .slice や .squeeze は transformers.js の Tensor に依存
            // 最後のトークンのlogitsを取得する簡易的な方法 (データアクセス)
            const vocabSize = logits.dims[logits.dims.length - 1]; // 語彙サイズ
            const seqLength = logits.dims[logits.dims.length - 2]; // シーケンス長
            const lastTokenLogitsArray = Array.from(logits.data.slice((seqLength - 1) * vocabSize, seqLength * vocabSize));

            const probabilities = softmax(lastTokenLogitsArray);

            // 2e. 上位確率のトークンを取得・表示
            const probsWithIds = probabilities.map((prob, id) => ({ id, prob }));
            probsWithIds.sort((a, b) => b.prob - a.prob); // 降順ソート
            topProbs = probsWithIds.slice(0, TOP_K_PROBS);

            // トークンIDをデコードして表示用に整形
            const probStrings = topProbs.map(item => {
                const token = tokenizer.decode([item.id], { skip_special_tokens: false }); // 特殊トークンも表示
                return `<li>"${token}" (ID: ${item.id}): ${(item.prob * 100).toFixed(2)}%</li>`;
            });
            probabilitiesElement.innerHTML = `<ul>${probStrings.join('')}</ul>`;

            // 2f. 次のトークンを選択 (argmax: 最も確率の高いもの)
            nextTokenId = topProbs[0].id;
            console.log(`Step ${i + 1}: Predicted next token ID: ${nextTokenId}, Prob: ${topProbs[0].prob.toFixed(4)}`);

            // 2g. EOS トークンなら終了
            if (nextTokenId === tokenizer.eos_token_id) {
                console.log("EOS token detected. Stopping generation.");
                break;
            }

            // 2h. 次のトークンIDを追加
            generatedTokenIds.push(nextTokenId);

            // 2i. 生成テキストを一時的に表示（ループの最後でまとめて表示でも良い）
            const currentOutputText = tokenizer.decode(generatedTokenIds, {
                skip_special_tokens: true,
                clean_up_tokenization_spaces: true
            });
            outputElement.innerText = currentOutputText + " ..."; // 生成中であることを示す

        } // for loop end

        console.log("Final generated token IDs:", generatedTokenIds);

        // 3. 最終的な生成テキストをデコードして表示
        const finalText = tokenizer.decode(generatedTokenIds, {
            skip_special_tokens: true,
            clean_up_tokenization_spaces: true
        });
        outputElement.innerText = finalText; // 最終結果で上書き
        console.log("Final Generated Text:", finalText);

    } catch (error) {
        console.error('文章生成中にエラーが発生しました:', error);
        outputElement.innerText = `エラー: 文章生成に失敗しました。\n${error.message}`;
        probabilitiesElement.innerText = 'エラーが発生しました。';
        alert(`生成エラー:\n${error.message}`);
    } finally {
        generateButton.disabled = false;
        loadingIndicator.style.display = 'none';
    }
}

// --- イベントリスナー --- (変更なし)
generateButton.addEventListener('click', generateText);

// --- 初期化実行 --- (変更なし)
initialize();
