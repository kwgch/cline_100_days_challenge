document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    // 初期状態でゲームオーバー画面を非表示にする
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
    }

    const COLS = 10;
    const ROWS = 20;
    const CELL_SIZE = 30; // CSSと合わせる
    let board = [];
    let currentBlock = null;
    let currentX = 0;
    let currentY = 0;
    let score = 0;
    let gameInterval;
    let gameSpeed = 500; // ブロックが落ちる速度 (ms)

    // ブロックの形状と色
    const BLOCKS = [
        // I
        {
            shape: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            color: 'cyan'
        },
        // J
        {
            shape: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'blue'
        },
        // L
        {
            shape: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'orange'
        },
        // O
        {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: 'yellow'
        },
        // S
        {
            shape: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            color: 'green'
        },
        // T
        {
            shape: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'purple'
        },
        // Z
        {
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            color: 'red'
        },
        // Bomb Block (爆弾ブロック)
        {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: 'gray',
            isBomb: true
        }
    ];

    // ゲームボードの初期化
    function initBoard() {
        gameBoard.innerHTML = '';
        board = Array(ROWS).fill(0).map(() => Array(COLS).fill(0));
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                gameBoard.appendChild(cell);
            }
        }
        score = 0;
        scoreDisplay.textContent = `スコア: ${score}`;
    }

    // ボードを描画
    function drawBoard() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = gameBoard.children[r * COLS + c];
                if (board[r][c] === 0) {
                    cell.className = 'cell'; // クラスをリセット
                } else {
                    cell.className = 'cell block';
                    cell.style.backgroundColor = board[r][c];
                    cell.style.borderColor = darkenColor(board[r][c], 20);
                }
            }
        }
    }

    // ブロックを描画
    function drawBlock() {
        if (!currentBlock) return;

        const shape = currentBlock.shape;
        const color = currentBlock.color;

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const boardX = currentX + c;
                    const boardY = currentY + r;
                    if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                        const cell = gameBoard.children[boardY * COLS + boardX];
                        cell.classList.add('block');
                        cell.style.backgroundColor = color;
                        cell.style.borderColor = darkenColor(color, 20);
                    }
                }
            }
        }
    }

    // ブロックを消去（描画を更新する前に現在のブロックをボードから消す）
    function eraseBlock() {
        if (!currentBlock) return;

        const shape = currentBlock.shape;

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const boardX = currentX + c;
                    const boardY = currentY + r;
                    if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                        const cell = gameBoard.children[boardY * COLS + boardX];
                    cell.classList.remove('block');
                    cell.style.backgroundColor = '';
                    cell.style.borderColor = '';
                    // 目と口の絵文字を削除 (もしあれば)
                    const eyes = cell.querySelector('.eyes');
                    const mouth = cell.querySelector('.mouth');
                    if (eyes) eyes.remove();
                    if (mouth) mouth.remove();
                    }
                }
            }
        }
    }

    // 新しいブロックを生成
    function generateBlock() {
        let newBlock;
        const randomType = Math.random();

        if (randomType < 0.8) { // 80%の確率で既存のブロック
            const randomIndex = Math.floor(Math.random() * BLOCKS.length);
            newBlock = JSON.parse(JSON.stringify(BLOCKS[randomIndex]));
        } else { // 20%の確率でランダムなブロック
            newBlock = generateRandomBlock();
        }

        currentBlock = newBlock;
        currentX = Math.floor((COLS - currentBlock.shape[0].length) / 2);
        currentY = 0; // 画面上部から開始

        if (!isValidMove(currentBlock.shape, currentX, currentY)) {
            gameOver();
            return false;
        }
        drawBlock();
        return true;
    }

    // ランダムなブロックを生成する関数
    function generateRandomBlock() {
        const size = Math.floor(Math.random() * 3) + 2; // 2x2, 3x3, 4x4
        const shape = Array(size).fill(0).map(() => Array(size).fill(0));
        const numCells = Math.floor(Math.random() * (size * size / 2)) + 2; // 2から最大セル数の半分程度

        let cellsPlaced = 0;
        while (cellsPlaced < numCells) {
            const r = Math.floor(Math.random() * size);
            const c = Math.floor(Math.random() * size);
            if (shape[r][c] === 0) {
                shape[r][c] = 1;
                cellsPlaced++;
            }
        }

        // ランダムな色を生成
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        return {
            shape: shape,
            color: randomColor,
            isBomb: Math.random() < 0.1 // 10%の確率でランダムブロックも爆弾になる
        };
    }

    // 移動が有効かチェック
    function isValidMove(shape, x, y) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const boardX = x + c;
                    const boardY = y + r;

                    // 範囲外チェック
                    if (boardX < 0) {
                        console.error(`Invalid move: boardX < 0 (${boardX})`);
                        return false;
                    }
                    if (boardX >= COLS) {
                        console.error(`Invalid move: boardX >= COLS (${boardX} >= ${COLS})`);
                        return false;
                    }
                    if (boardY >= ROWS) {
                        console.error(`Invalid move: boardY >= ROWS (${boardY} >= ${ROWS})`);
                        return false;
                    }
                    // ボード上の既存のブロックとの衝突チェック (Y座標が負の場合は衝突判定しない)
                    if (boardY >= 0 && board[boardY][boardX] !== 0) {
                        console.error(`Invalid move: collision at (${boardX}, ${boardY}) with existing block`);
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // ブロックをボードに固定
    function solidifyBlock() {
        const shape = currentBlock.shape;
        const color = currentBlock.color;
        const isBomb = currentBlock.isBomb; // 新しいプロパティ

        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] === 1) {
                    const boardX = currentX + c;
                    const boardY = currentY + r;
                    if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                        board[boardY][boardX] = color;
                        // 固定されたブロックに目と口の絵文字を追加
                        addEyesAndMouth(boardY, boardX);
                    }
                }
            }
        }

        if (isBomb) {
            explodeBomb(currentX, currentY, shape.length, shape[0].length); // 爆弾ブロックの処理
        }

        checkRows();
        drawBoard(); // ボード全体を再描画して固定されたブロックを表示
        speakBlock("Block solidified! 🧱"); // ブロックが喋る
        if (!generateBlock()) { // 新しいブロックを生成し、生成できなければゲームオーバー
            gameOver();
        }
    }

    // 爆弾ブロックの爆発処理
    function explodeBomb(centerX, centerY, blockHeight, blockWidth) {
        const explosionCenterRow = centerY + Math.floor(blockHeight / 2);
        const explosionCenterCol = centerX + Math.floor(blockWidth / 2);

        // 爆発エフェクトの表示
        const explosionEffect = document.createElement('div');
        explosionEffect.classList.add('explosion-effect');
        explosionEffect.style.top = `${explosionCenterRow * CELL_SIZE}px`;
        explosionEffect.style.left = `${explosionCenterCol * CELL_SIZE}px`;
        gameBoard.appendChild(explosionEffect);

        // 爆発テキストの表示
        const explosionText = document.createElement('div');
        explosionText.classList.add('explosion-text');
        explosionText.textContent = 'BOOM! 💥';
        explosionText.style.top = `${explosionCenterRow * CELL_SIZE}px`;
        explosionText.style.left = `${explosionCenterCol * CELL_SIZE}px`;
        gameBoard.appendChild(explosionText);

        // 一定時間後にエフェクトとテキストを削除
        setTimeout(() => {
            explosionEffect.remove();
            explosionText.remove();
        }, 1000); // CSSアニメーションの時間と合わせる

        // 爆弾ブロックの中心を基準に、周囲のブロックを消去
        const startRow = Math.max(0, centerY - 1);
        const endRow = Math.min(ROWS - 1, centerY + blockHeight);
        const startCol = Math.max(0, centerX - 1);
        const endCol = Math.min(COLS - 1, centerX + blockWidth);

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (board[r][c] !== 0) {
                    board[r][c] = 0; // ブロックを消去
                    score += 10; // 爆弾で消したブロックにもスコアを与える
                    // 消去されたブロックの目と口も削除
                    const cell = gameBoard.children[r * COLS + c];
                    const eyes = cell.querySelector('.eyes');
                    const mouth = cell.querySelector('.mouth');
                    if (eyes) eyes.remove();
                    if (mouth) mouth.remove();
                }
            }
        }
        scoreDisplay.textContent = `スコア: ${score}`;
        drawBoard(); // 爆発後のボードを再描画
        speakBlock("KABOOM! That was loud! 💣"); // 爆発時に喋る
    }

    // ブロックを下に移動
    function moveDown() {
        eraseBlock();
        if (isValidMove(currentBlock.shape, currentX, currentY + 1)) {
            currentY++;
            drawBlock();
        } else {
            solidifyBlock();
        }
    }

    // ブロックを左右に移動
    function moveHorizontal(deltaX) {
        eraseBlock();
        if (isValidMove(currentBlock.shape, currentX + deltaX, currentY)) {
            currentX += deltaX;
        }
        drawBlock();
    }

    // ブロックを回転
    function rotateBlock() {
        eraseBlock();
        const originalShape = currentBlock.shape;
        const rotatedShape = rotateMatrix(originalShape);

        // 回転後の位置調整（壁蹴り）
        let offsetX = 0;
        let offsetY = 0;
        const kicks = [
            [0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], // 基本的なキック
            [-2, 0], [2, 0], [0, -2], [0, 2] // より大きなキック
        ];

        let foundValidPosition = false;
        for (const kick of kicks) {
            offsetX = kick[0];
            offsetY = kick[1];
            if (isValidMove(rotatedShape, currentX + offsetX, currentY + offsetY)) {
                foundValidPosition = true;
                break;
            }
        }

        if (foundValidPosition) {
            currentBlock.shape = rotatedShape;
            currentX += offsetX;
            currentY += offsetY;
        }
        drawBlock();
    }

    // 行列を時計回りに90度回転
    function rotateMatrix(matrix) {
        const N = matrix.length;
        const rotated = Array(N).fill(0).map(() => Array(N).fill(0));
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                rotated[c][N - 1 - r] = matrix[r][c];
            }
        }
        return rotated;
    }

    // 揃った行をチェックして消去
    function checkRows() {
        let linesCleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r].every(cell => cell !== 0)) {
                // 行が揃った
                linesCleared++;
                // その行を削除し、新しい空の行を上に追加
                board.splice(r, 1);
                board.unshift(Array(COLS).fill(0));
                r++; // 削除した行の分、チェックする行を一つ戻す
            }
        }
        if (linesCleared > 0) {
            score += linesCleared * 100; // 1行100点
            scoreDisplay.textContent = `スコア: ${score}`;
            // 速度を上げる
            gameSpeed = Math.max(50, gameSpeed - (linesCleared * 10)); // 最低50ms
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    // ゲームオーバー
    function gameOver() {
        clearInterval(gameInterval);

        finalScoreDisplay.textContent = score;
        gameOverScreen.classList.remove('hidden'); // ゲームオーバー画面を表示

        restartBtn.onclick = () => {
            gameOverScreen.classList.add('hidden'); // ゲームオーバー画面を非表示
            initGame(); // ゲームをリセット
        };
    }

    let lastTeleportTime = Date.now(); // テレポートのタイミングを管理する変数

    // ゲームループ
    function gameLoop() {
        moveDown();
        // ランダムな絵文字を降らせる
        if (Math.random() < 0.1) { // 10%の確率で絵文字を降らせる
            dropRandomEmoji();
        }
        // ブロックのテレポート (例: 5秒に1回)
        if (Date.now() - lastTeleportTime > 5000) {
            teleportRandomBlock();
            lastTeleportTime = Date.now();
        }
    }

    // 色を暗くするヘルパー関数
    function darkenColor(color, percent) {
        const f = parseInt(color.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;
        const R = f >> 16;
        const G = (f >> 8) & 0x00FF;
        const B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    // イベントリスナー
    // PCキーボード操作
    document.addEventListener('keydown', e => {
        if (!currentBlock) return;
        if (e.key === 'ArrowLeft') {
            moveHorizontal(-1);
        } else if (e.key === 'ArrowRight') {
            moveHorizontal(1);
        } else if (e.key === 'ArrowDown') {
            moveDown();
        } else if (e.key === 'ArrowUp' || e.key === ' ') { // 上矢印またはスペースで回転
            rotateBlock();
        }
    });

    // タッチ操作のための変数
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 30; // スワイプと判定する最小距離

    gameBoard.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: false }); // passive: false を追加して preventDefault を可能にする

    gameBoard.addEventListener('touchmove', e => {
        e.preventDefault(); // スクロールを防止
    }, { passive: false });

    gameBoard.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 横方向のスワイプ
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    moveHorizontal(1); // 右スワイプ
                } else {
                    moveHorizontal(-1); // 左スワイプ
                }
            }
        } else {
            // 縦方向のスワイプまたはタップ
            if (Math.abs(deltaY) > swipeThreshold) {
                if (deltaY > 0) {
                    moveDown(); // 下スワイプ
                }
            } else {
                // 短いタップ（回転）
                rotateBlock();
            }
        }
    });

    // マウス操作のための変数
    let mouseDownX = 0;
    let mouseDownY = 0;
    let isMouseDown = false;
    const mouseMoveThreshold = 10; // マウス移動をスワイプと判定する最小距離

    gameBoard.addEventListener('mousedown', e => {
        isMouseDown = true;
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
    });

    gameBoard.addEventListener('mousemove', e => {
        if (!isMouseDown) return;

        const currentMouseX = e.clientX;
        const currentMouseY = e.clientY;

        const deltaX = currentMouseX - mouseDownX;
        const deltaY = currentMouseY - mouseDownY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 横方向のドラッグ
            if (Math.abs(deltaX) > mouseMoveThreshold) {
                if (deltaX > 0) {
                    moveHorizontal(1); // 右ドラッグ
                } else {
                    moveHorizontal(-1); // 左ドラッグ
                }
                isMouseDown = false; // 一度移動したらリセット
            }
        } else {
            // 縦方向のドラッグ
            if (Math.abs(deltaY) > mouseMoveThreshold) {
                if (deltaY > 0) {
                    moveDown(); // 下ドラッグ
                }
                isMouseDown = false; // 一度移動したらリセット
            }
        }
    });

    gameBoard.addEventListener('mouseup', e => {
        if (isMouseDown) {
            // クリック（移動が閾値未満の場合）
            const deltaX = e.clientX - mouseDownX;
            const deltaY = e.clientY - mouseDownY;
            if (Math.abs(deltaX) < mouseMoveThreshold && Math.abs(deltaY) < mouseMoveThreshold) {
                rotateBlock(); // クリックで回転
            }
        }
        isMouseDown = false;
    });

    // ゲーム開始
    function initGame() {
        initBoard();
        // ゲームオーバー画面がもし表示されていたら非表示にする
        if (gameOverScreen) { // 要素が存在することを確認
            gameOverScreen.classList.add('hidden');
        }
        if (generateBlock()) {
            clearInterval(gameInterval); // 既存のインターバルをクリア
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    }

    // 目と口の絵文字を追加する関数
    function addEyesAndMouth(row, col) {
        const cell = gameBoard.children[row * COLS + col];
        if (!cell) return;

        // 既存の目と口を削除
        const existingEyes = cell.querySelector('.eyes');
        const existingMouth = cell.querySelector('.mouth');
        if (existingEyes) existingEyes.remove();
        if (existingMouth) existingMouth.remove();

        const eyes = document.createElement('div');
        eyes.classList.add('eyes');
        eyes.textContent = Math.random() < 0.5 ? '👀' : '👁️👁️'; // ランダムな目の絵文字
        cell.appendChild(eyes);

        const mouth = document.createElement('div');
        mouth.classList.add('mouth');
        mouth.textContent = Math.random() < 0.5 ? '👄' : '👅'; // ランダムな口の絵文字
        cell.appendChild(mouth);

        // 少しアニメーションさせる
        eyes.style.transform = 'scale(1.2)';
        mouth.style.transform = 'scale(1.2)';
        setTimeout(() => {
            eyes.style.transform = 'scale(1)';
            mouth.style.transform = 'scale(1)';
        }, 200);
    }

    // ブロックが喋る関数
    function speakBlock(message) {
        console.log(`Block says: "${message}"`);
        // 必要であれば、画面上に一時的に表示するなどの処理を追加
    }

    // ランダムな絵文字を生成し、落下させる関数
    function dropRandomEmoji() {
        const emojis = ['🍎', '🌟', '👻', '🚀', '💰', '💎', '👾', '🎉', '💯', '🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const emojiElement = document.createElement('div');
        emojiElement.classList.add('falling-emoji');
        emojiElement.textContent = randomEmoji;
        emojiElement.style.left = `${Math.random() * (COLS * CELL_SIZE)}px`; // ランダムなX位置
        emojiElement.style.animationDuration = `${Math.random() * 2 + 3}s`; // 3-5秒で落下

        gameBoard.appendChild(emojiElement);

        // アニメーション終了後に要素を削除
        emojiElement.addEventListener('animationend', () => {
            emojiElement.remove();
        });
    }

    // ランダムなブロックをテレポートさせる関数
    function teleportRandomBlock() {
        const filledCells = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c] !== 0) {
                    filledCells.push({ row: r, col: c, color: board[r][c] });
                }
            }
        }

        if (filledCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * filledCells.length);
        const targetCell = filledCells[randomIndex];

        // 元の場所を消去
        board[targetCell.row][targetCell.col] = 0;
        const originalCellElement = gameBoard.children[targetCell.row * COLS + targetCell.col];
        originalCellElement.classList.remove('block');
        originalCellElement.style.backgroundColor = '';
        originalCellElement.style.borderColor = '';
        const eyes = originalCellElement.querySelector('.eyes');
        const mouth = originalCellElement.querySelector('.mouth');
        if (eyes) eyes.remove();
        if (mouth) mouth.remove();


        // 新しいランダムな場所を探す
        let newRow, newCol;
        let foundNewPosition = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!foundNewPosition && attempts < maxAttempts) {
            newRow = Math.floor(Math.random() * ROWS);
            newCol = Math.floor(Math.random() * COLS);

            if (board[newRow][newCol] === 0) {
                foundNewPosition = true;
            }
            attempts++;
        }

        if (foundNewPosition) {
            board[newRow][newCol] = targetCell.color;
            const newCellElement = gameBoard.children[newRow * COLS + newCol];
            newCellElement.classList.add('block');
            newCellElement.style.backgroundColor = targetCell.color;
            newCellElement.style.borderColor = darkenColor(targetCell.color, 20);
            addEyesAndMouth(newRow, newCol); // テレポートしたブロックにも目と口を追加
            speakBlock("Whoosh! I'm here! 💨"); // テレポート時に喋る
        } else {
            // 新しい場所が見つからなかった場合、元の場所に戻す
            board[targetCell.row][targetCell.col] = targetCell.color;
            const originalCellElement = gameBoard.children[targetCell.row * COLS + targetCell.col];
            originalCellElement.classList.add('block');
            originalCellElement.style.backgroundColor = targetCell.color;
            originalCellElement.style.borderColor = darkenColor(targetCell.color, 20);
            addEyesAndMouth(targetCell.row, targetCell.col);
        }
        drawBoard(); // ボード全体を再描画
    }

    initGame();
});
