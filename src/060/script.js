document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const shapeBox = document.getElementById('shape-box');
    const mouth = document.querySelector('.mouth');
    const dialogueBox = document.getElementById('dialogue-box');

    // ヘルパー関数：ランダムな整数を生成
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // ヘルパー関数：ランダムな16進数カラーコードを生成
    const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // ヘルパー関数：色の明度を計算
    const getLuminance = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        
        return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    };

    // ヘルパー関数：コントラスト比を計算
    const getContrastRatio = (color1, color2) => {
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    };

    // ヘルパー関数：十分なコントラストを持つ色のペアを生成
    const getContrastingColors = () => {
        let backgroundColor, shapeColor;
        let attempts = 0;
        const maxAttempts = 50;
        
        do {
            backgroundColor = getRandomColor();
            shapeColor = getRandomColor();
            attempts++;
        } while (getContrastRatio(backgroundColor, shapeColor) < 3.0 && attempts < maxAttempts);
        
        // 十分なコントラストが得られない場合は、明暗を強制的に分ける
        if (attempts >= maxAttempts) {
            const bgLuminance = getLuminance(backgroundColor);
            if (bgLuminance > 0.5) {
                // 背景が明るい場合は、暗い色を生成
                shapeColor = '#' + Math.floor(Math.random() * 8388608).toString(16).padStart(6, '0'); // 0x000000-0x7FFFFF
            } else {
                // 背景が暗い場合は、明るい色を生成
                shapeColor = '#' + (Math.floor(Math.random() * 8388608) + 8388608).toString(16).padStart(6, '0'); // 0x800000-0xFFFFFF
            }
        }
        
        return { backgroundColor, shapeColor };
    };

    // ヘルパー関数：ランダムなborder-radius値を生成
    const getRandomBorderRadius = () => {
        const values = Array.from({ length: 4 }, () => `${getRandomInt(0, 100)}%`).join(' ');
        const slash = Math.random() > 0.5 ? ` / ${Array.from({ length: 4 }, () => `${getRandomInt(0, 100)}%`).join(' ')}` : '';
        return values + slash;
    };

    // 口の表情パターン
    const mouthExpressions = [
        { borderRadius: '0 0 50% 50% / 0 0 100% 100%', transform: 'translateX(-50%) rotate(0deg)', width: '50px', height: '10px' }, // 笑顔 (大きな下向きの弧)
        { borderRadius: '50% 50% 0 0 / 100% 100% 0 0', transform: 'translateX(-50%) rotate(0deg)', width: '50px', height: '10px' }, // 困り顔 (大きな上向きの弧)
        { borderRadius: '0', transform: 'translateX(-50%) rotate(0deg) scaleX(0.8)', width: '50px', height: '10px' }, // 真顔 (直線)
        { borderRadius: '50%', transform: 'translateX(-50%) rotate(0deg) scale(0.5)', width: '50px', height: '10px' }, // 驚き顔 (小さい円)
        { borderRadius: '0 0 50% 50% / 0 0 100% 100%', transform: 'translateX(-50%) rotate(-15deg)', width: '50px', height: '10px' }, // 斜め笑顔 (左下がり)
        { borderRadius: '0 0 50% 50% / 0 0 100% 100%', transform: 'translateX(-50%) rotate(15deg)', width: '50px', height: '10px' }, // 斜め笑顔 (右下がり)
        { borderRadius: '50% 50% 0 0 / 100% 100% 0 0', transform: 'translateX(-50%) rotate(-15deg)', width: '50px', height: '10px' }, // 斜め困り顔 (左上がり)
        { borderRadius: '50% 50% 0 0 / 100% 100% 0 0', transform: 'translateX(-50%) rotate(15deg)', width: '50px', height: '10px' }  // 斜め困り顔 (右上がり)
    ];

    // 発言パターン
    const dialogues = [
        "オレ　オマエ　トモダチ",
        "タップ　スル　タノシイ",
        "ヘンナ　カタチ　ダネ",
        "コレ　ナニイロ？",
        "マタ　アエタネ",
        "キョウ　イイヒ　ダネ",
        "ナニカ　オモシロイ？",
        "モット　タップ　シテ",
        "ビックリ　シタ？",
        "フムフム…",
        "ナルホド！",
        "ワクワク　スル！",
        "アタラシイ　ハッケン！",
        "キミ　サイコウ！",
        "ゲンキ　シテル？",
        "ナニ　カンガエテル？",
        "ヒミツ　ダヨ！",
        "マタネ！",
        "タノシイ　ジカン！",
        "モット　モット！",
        "オレ　ココ　イル",
        "キミ　スキ",
        "アツイ　ネ",
        "サムイ　ネ",
        "オナカ　スイタ",
        "ネムイ　ネ",
        "オレ　ツヨイ",
        "オレ　ヨワイ",
        "オレ　マケル",
        "オレ　カツ",
        "オレ　ワカル",
        "オレ　ワカラナイ",
        "オレ　ガンバル",
        "オレ　ヤルゾ",
        "オレ　コワイ",
        "オレ　ウレシイ",
        "オレ　カナシイ",
        "オレ　オコッタ",
        "オレ　ヒマ",
        "オレ　イソガシイ",
        "オマエ　ウマソウダナ",
        "オレ　ハラヘッタ",
        "オレ　オマエ　タベル",
        "カユイ　ウマイ",
        "カユ　ウマ",
        "ハヤク　ニンゲンニ　ナリタイ",
        "クライ　アナニ　ハイル",
        "オウチニ　カエリタイ",
        "ニャーン",
        "ユウキュウ　トリタイ",
        "モテタイ"
    ];

    let dialogueTimeout; // セリフ表示のタイムアウトID

    const updateElements = () => {
        // 十分なコントラストを持つ背景色と図形色を生成
        const colors = getContrastingColors();
        
        // 背景色の変更
        gameArea.style.backgroundColor = colors.backgroundColor;

        // 形、大きさ、図形の色、回転の変更
        shapeBox.style.borderRadius = getRandomBorderRadius();
        shapeBox.style.setProperty('--rotate', `${getRandomInt(-15, 15)}deg`); // 左右に少し傾く程度に制限
        shapeBox.style.width = `${getRandomInt(80, 250)}px`; // ランダムな幅
        shapeBox.style.height = `${getRandomInt(80, 250)}px`; // ランダムな高さ
        shapeBox.style.backgroundColor = colors.shapeColor; // コントラストを考慮した図形の色

        // 口の表情の変更 (ランダム)
        const randomMouthExpression = mouthExpressions[getRandomInt(0, mouthExpressions.length - 1)];
        mouth.style.borderRadius = randomMouthExpression.borderRadius;
        mouth.style.transform = randomMouthExpression.transform;

        // セリフの表示
        clearTimeout(dialogueTimeout); // 既存のタイムアウトをクリア
        dialogueBox.textContent = dialogues[getRandomInt(0, dialogues.length - 1)];
        dialogueBox.style.opacity = 1; // 表示

        // 口を「しゃべっている」表情に固定 (一時的に)
        mouth.style.borderRadius = '50%'; // 丸い口
        mouth.style.transform = 'translateX(-50%) scaleY(0.5)'; // 縦に潰れた口

        dialogueTimeout = setTimeout(() => {
            dialogueBox.style.opacity = 0; // 非表示
            // セリフが消えたら口の表情をランダムに戻す
            const randomMouthExpressionAfterSpeech = mouthExpressions[getRandomInt(0, mouthExpressions.length - 1)];
            mouth.style.borderRadius = randomMouthExpressionAfterSpeech.borderRadius;
            mouth.style.transform = randomMouthExpressionAfterSpeech.transform;
            mouth.style.width = randomMouthExpressionAfterSpeech.width; // widthも戻す
            mouth.style.height = randomMouthExpressionAfterSpeech.height; // heightも戻す
        }, 2000); // 2秒後に消える
    };

    gameArea.addEventListener('click', updateElements);

    // 初期状態を設定
    updateElements();
});
