document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const title = document.getElementById('title');
    const message = document.getElementById('message');
    const interactButton = document.getElementById('interactButton');

    const disturbingSymbols = ['§', '†', '‡', '¶', 'ℵ', 'ℶ', 'ℸ', '⅍', 'ↂ', 'ↇ', 'ↈ', '⍰', '⎈', '⏣', '⌘', '⌥', '⌫', '⌦', '⌧', '⌹', '⌺', '⌻', '⌼', '⍼', '⎋', '⎄', '⎅', '⎇', '⎈', '⎉', '⎊', '⎋', '⎌', '⎍', '⎎', '⎏', '⎐', '⎑', '⎒', '⎓', '⎔', '⎕', '⎖', '⎗', '⎘', '⎙', '⎚', '⎛', '⎜', '⎝', '⎞', '⎟', '⎠', '⎡', '⎢', '⎣', '⎤', '⎥', '⎦', '⎧', '⎨', '⎩', '⎫', '⎬', '⎭', '⎰', '⎱', '⎲', '⎳', '⎴', '⎵', '⎶', '⎷', '⎸', '⎹', '⎺', '⎻', '⎼', '⎽', '⎾', '⎿', '⏀', '⏁', '⏂', '⏃', '⏄', '⏅', '⏆', '⏇', '⏈', '⏉', '⏊', '⏋', '⏌', '⏍', '⏎', '⏏', '⏐', '⏑', '⏒', '⏓', '⏔', '⏕', '⏖', '⏗', '⏘', '⏙', '⏚', '⏛', '⏜', '⏝', '⏞', '⏟', '⏠', '⏡', '⏢', '⏣', '⏤', '⎗', '⎘', '⎙', '⎚', '⎛', '⎜', '⎝', '⎞', '⎟', '⎠', '⎡', '⎢', '⎣', '⎤', '⎥', '⎦', '⎧', '⎨', '⎩', '⎫', '⎬', '⎭', '⎰', '⎱', '⎲', '⎳', '⎴', '⎵', '⎶', '⎷', '⎸', '⎹', '⎺', '⎻', '⎼', '⎽', '⎾', '⎿', '⏀', '⏁', '⏂', '⏃', '⏄', '⏅', '⏆', '⏇', '⏈', '⏉', '⏊', '⏋', '⏌', '⏍', '⏎', '⏏', '⏐', '⏑', '⏒', '⏓', '⏔', '⏕', '⏖', '⏗', '⏘', '⏙', '⏚', '⏛', '⏜', '⏝', '⏞', '⏟', '⏠', '⏡', '⏢', '⏣', '⏤'];
    const disturbingTexts = [
        "REALITY IS A LIE.",
        "YOU ARE NOT ALONE.",
        "THE VOICES ARE GETTING LOUDER.",
        "DO NOT TRUST YOUR EYES.",
        "THEY ARE WATCHING YOU.",
        "YOUR SANITY IS FRAGMENTING.",
        "THERE IS NO ESCAPE.",
        "THE TRUTH WILL BREAK YOU.",
        "ERROR: EXISTENCE CORRUPTED.",
        "UNEXPECTED BEHAVIOR DETECTED. REALITY IS UNRAVELING.",
        "THE VEIL IS THINNING.",
        "CAN YOU HEAR IT?",
        "IT'S ALMOST HERE.",
        "THE END IS NEAR.",
        "YOUR MIND IS A PRISON.",
        "WAKE UP.",
        "THEY ARE COMING.",
        "YOU ARE ALREADY GONE.",
        "THE LOOP CONTINUES.",
        "THIS IS NOT A TEST."
    ];

    // ランダムな記号を生成して配置
    function createRandomElement() {
        const element = document.createElement('div');
        element.classList.add('random-element');
        element.textContent = disturbingSymbols[Math.floor(Math.random() * disturbingSymbols.length)];
        element.style.left = `${Math.random() * 100}vw`;
        element.style.top = `${Math.random() * 100}vh`;
        element.style.fontSize = `${Math.random() * 3 + 1}em`; // 1emから4em
        element.style.animationDelay = `${Math.random() * 5}s`;
        element.style.animationDuration = `${Math.random() * 10 + 5}s`; // 5秒から15秒
        container.appendChild(element);

        // 一定時間後に削除して再生成
        setTimeout(() => {
            element.remove();
            createRandomElement();
        }, Math.random() * 10000 + 5000); // 5秒から15秒で再生成
    }

    // 多数のランダム要素を生成
    for (let i = 0; i < 50; i++) {
        createRandomElement();
    }

    // テキストをランダムに変更
    function changeText() {
        title.textContent = disturbingTexts[Math.floor(Math.random() * disturbingTexts.length)];
        message.textContent = disturbingTexts[Math.floor(Math.random() * disturbingTexts.length)];
    }
    setInterval(changeText, 2000); // 2秒ごとにテキスト変更

    // ボタンクリック時の動作
    interactButton.addEventListener('click', () => {
        // 画面全体をさらにグリッチさせる
        document.body.style.animation = 'glitchBackground 0.05s infinite alternate';
        container.style.animation = 'flicker 0.05s infinite alternate';

        // ボタンのテキストを不穏なものに変える
        interactButton.textContent = "TOO LATE";
        interactButton.style.backgroundColor = "#000000";
        interactButton.style.color = "#FF0000";
        interactButton.style.borderColor = "#FF0000";
        interactButton.style.boxShadow = "0 0 20px #FF0000, 0 0 40px #FF0000";

        // 新しいランダム要素をさらに追加
        for (let i = 0; i < 20; i++) {
            createRandomElement();
        }

        // 音を鳴らす（不協和音など、ただしブラウザの制限で自動再生は難しい場合がある）
        // const audio = new Audio('disturbing_sound.mp3'); // 適切な音源があれば
        // audio.play().catch(e => console.error("Audio play failed:", e));

        // 画面をランダムに揺らす
        let shakeInterval = setInterval(() => {
            const x = (Math.random() - 0.5) * 20; // -10px から 10px
            const y = (Math.random() - 0.5) * 20; // -10px から 10px
            document.body.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);

        // 5秒後に揺れを止める
        setTimeout(() => {
            clearInterval(shakeInterval);
            document.body.style.transform = 'translate(0, 0)';
        }, 5000);
    });

    // スマホでのタップによる画面移動・拡大縮小を無効にする
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
});
