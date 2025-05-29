document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームのデフォルト送信を防止

    // ログインフォームを非表示にする
    document.querySelector('.login-container').style.display = 'none';

    // ブラウザクラッシャー演出を開始
    startBrowserCrusherEffect();
});

function startBrowserCrusherEffect() {
    const messages = [
        "Error occurred!",
        "System corrupted.",
        "Data lost.",
        "Access denied.",
        "Unexpected issue.",
        "Please restart.",
        "Warning!",
        "Files deleted.",
        "Network connection lost.",
        "Unknown error code: 0x80070005"
    ];

    const numWindows = 200; // 表示する疑似ウィンドウの数を維持
    const body = document.body;
    let zIndex = 1000;

    const windowWidth = 300; // 疑似ウィンドウの幅
    const windowHeight = 150; // 疑似ウィンドウの高さ
    const offset = 20; // ウィンドウ間のオフセットを調整（重ねるため）

    let currentLeft = 0;
    let currentTop = 0;
    let rowOffset = 0; // 行ごとのずらし
    let colOffset = 0; // 列ごとのずらし

    for (let i = 0; i < numWindows; i++) {
        const pseudoWindow = document.createElement('div');
        pseudoWindow.classList.add('pseudo-window');
        pseudoWindow.style.zIndex = zIndex++;
        pseudoWindow.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`; // ランダムな色

        // 位置計算
        pseudoWindow.style.left = `${currentLeft + rowOffset}px`;
        pseudoWindow.style.top = `${currentTop + colOffset}px`;

        // 次のウィンドウの位置を計算
        currentLeft += offset;
        currentTop += offset;

        // 画面の右端に到達したら、次の行へ（ウィンドウの大きさ分ずらす）
        if (currentLeft + windowWidth > window.innerWidth) {
            currentLeft = 0; // 左端に戻る
            colOffset += windowHeight / 2; // 次の行の開始位置をウィンドウの高さの半分ずらす
            currentTop = colOffset; // currentTopもcolOffsetに合わせる
            rowOffset = 0; // 行のずらしをリセット
        }

        // 画面の下端に到達したら、左上から再開し、さらにずらす
        if (currentTop + windowHeight > window.innerHeight) {
            currentTop = 0; // 上端に戻る
            rowOffset += windowWidth / 2; // 次の列の開始位置をウィンドウの幅の半分ずらす
            currentLeft = rowOffset; // currentLeftもrowOffsetに合わせる
            colOffset = 0; // 列のずらしをリセット
        }


        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');
        titleBar.textContent = `⚠️ Warning - ${i + 1}`;

        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            pseudoWindow.remove(); // 閉じるボタンで消せるように
        });
        titleBar.appendChild(closeButton);

        const content = document.createElement('div');
        content.classList.add('content');
        content.textContent = messages[Math.floor(Math.random() * messages.length)];

        pseudoWindow.appendChild(titleBar);
        pseudoWindow.appendChild(content);
        body.appendChild(pseudoWindow);

        // 少し遅れて表示することで、連続して開くような演出
        setTimeout(() => {
            pseudoWindow.style.display = 'block';
        }, i * 50);
    }

    // ページを無限スクロール (スマホでタップで画面が動かないようにする対策)
    document.body.style.overflow = 'hidden'; // スクロールバーを非表示にする
    let scrollCount = 0;
    const scrollInterval = setInterval(() => {
        window.scrollBy(0, 100); // 下にスクロール
        scrollCount++;
        if (scrollCount > 100) { // 100回スクロールしたら停止
            clearInterval(scrollInterval);
        }
    }, 100);

}
