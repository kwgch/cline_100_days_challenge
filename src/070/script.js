// 混乱度カウンター
let confusionLevel = 0;
let chaosMode = false;

// DOM要素の取得
const elements = {
    title: document.getElementById('title'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    loginBtn: document.getElementById('login-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
    helpBtn: document.getElementById('help-btn'),
    fakeButtons: document.querySelectorAll('.btn.fake'),
    movingBoxes: document.querySelectorAll('.moving-box'),
    vanishButtons: document.querySelectorAll('.btn.vanish'),
    confusionCounter: document.getElementById('confusion-level'),
    colorArea: document.getElementById('color-area'),
    floater: document.getElementById('floater'),
    container: document.querySelector('.container')
};

// 混乱度を増加させる関数
function increaseConfusion(amount = 1) {
    confusionLevel += amount;
    elements.confusionCounter.textContent = confusionLevel;
    
    // 混乱度が高くなると画面全体がカオスモードに
    if (confusionLevel > 10 && !chaosMode) {
        chaosMode = true;
        document.body.classList.add('chaos-mode');
        showFakeAlert('警告: システムが不安定になっています！');
    }
    
    // さらに混乱度が上がると要素が逆さまに
    if (confusionLevel > 20) {
        elements.container.classList.add('upside-down');
    }
}

// 偽のアラートを表示
function showFakeAlert(message) {
    const fakeAlert = document.createElement('div');
    fakeAlert.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff6b6b;
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: shake 0.5s ease-in-out infinite;
    `;
    fakeAlert.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #ff6b6b;
            border: none;
            padding: 5px 10px;
            margin-top: 10px;
            border-radius: 5px;
            cursor: pointer;
        ">OK（嘘）</button>
    `;
    document.body.appendChild(fakeAlert);
    
    // 3秒後に自動で消える
    setTimeout(() => {
        if (fakeAlert.parentElement) {
            fakeAlert.remove();
        }
    }, 3000);
}

// ランダムな位置に要素を移動
function moveElementRandomly(element) {
    const maxX = window.innerWidth - element.offsetWidth - 50;
    const maxY = window.innerHeight - element.offsetHeight - 50;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    element.style.position = 'fixed';
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
    element.style.zIndex = '1000';
}

// ボタンのテキストをランダムに変更
function randomizeButtonText(button) {
    const texts = [
        '押さないで', '危険', '爆発', '削除', '破壊', 'エラー', 
        '助けて', '逃げて', '混乱', 'バグ', '故障', '停止',
        'ウイルス', 'ハッキング', '侵入', '警告'
    ];
    button.textContent = texts[Math.floor(Math.random() * texts.length)];
}

// メインボタンのイベントリスナー
elements.loginBtn.addEventListener('click', function() {
    increaseConfusion(2);
    
    // ボタンの動作が期待と異なる
    const actions = [
        () => {
            showFakeAlert('ログアウトしました！');
            this.textContent = 'ログアウト';
        },
        () => {
            showFakeAlert('パスワードが間違っています（入力していません）');
            elements.password.value = '';
        },
        () => {
            moveElementRandomly(this);
            this.textContent = '逃げるボタン';
        },
        () => {
            document.body.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                document.body.style.transform = 'rotate(0deg)';
            }, 2000);
        }
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
});

elements.cancelBtn.addEventListener('click', function() {
    increaseConfusion(1);
    
    // キャンセルボタンなのに何かを実行する
    const actions = [
        () => showFakeAlert('データを保存しました！'),
        () => showFakeAlert('全てのファイルを削除中...'),
        () => {
            this.textContent = '実行';
            this.style.background = '#4ecdc4';
        },
        () => {
            elements.username.value = 'ハッキングされました';
            elements.password.value = '123456';
        }
    ];
    
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
});

elements.helpBtn.addEventListener('click', function() {
    increaseConfusion(1);
    
    // ヘルプボタンなのに混乱を招く
    const helpMessages = [
        'ヘルプ: このシステムは正常に動作していません',
        'エラー: ヘルプファイルが見つかりません',
        'ヘルプ: 助けが必要なのはあなたです',
        'システム: 混乱は仕様です',
        'ヘルプ: Ctrl+Alt+Delを押してください（効果なし）'
    ];
    
    const randomMessage = helpMessages[Math.floor(Math.random() * helpMessages.length)];
    showFakeAlert(randomMessage);
    
    // たまにボタンが消える
    if (Math.random() < 0.3) {
        this.classList.add('invisible');
        setTimeout(() => {
            this.classList.remove('invisible');
        }, 3000);
    }
});

// 偽ボタンのイベント
elements.fakeButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
        increaseConfusion(1);
        
        const actions = [
            () => showFakeAlert('このボタンは飾りです'),
            () => showFakeAlert('何も起こりません'),
            () => {
                randomizeButtonText(this);
                this.style.background = '#ff6b6b';
            },
            () => moveElementRandomly(this),
            () => {
                this.classList.add('giant');
                setTimeout(() => this.classList.remove('giant'), 2000);
            }
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
    });
});

// 動く要素のイベント
elements.movingBoxes.forEach(box => {
    box.addEventListener('click', function() {
        increaseConfusion(2);
        
        // クリックすると逃げる
        moveElementRandomly(this);
        
        const messages = [
            '捕まえられません！',
            '逃げました',
            'もう一度挑戦してください',
            'クリックできませんでした'
        ];
        
        this.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        // 時々分裂する
        if (Math.random() < 0.3) {
            const clone = this.cloneNode(true);
            clone.textContent = 'コピー';
            clone.style.background = '#ffa726';
            document.body.appendChild(clone);
            moveElementRandomly(clone);
            
            // クローンにもイベントを追加
            clone.addEventListener('click', function() {
                increaseConfusion(1);
                this.remove();
                showFakeAlert('コピーを削除しました');
            });
        }
    });
    
    // マウスオーバーで逃げる
    box.addEventListener('mouseenter', function() {
        if (Math.random() < 0.5) {
            moveElementRandomly(this);
        }
    });
});

// 消えるボタンのイベント
elements.vanishButtons.forEach(button => {
    button.addEventListener('click', function() {
        increaseConfusion(1);
        showFakeAlert('ボタンが消える前にクリックできました！');
        this.remove();
    });
    
    // ランダムに消える
    setTimeout(() => {
        if (button.parentElement && Math.random() < 0.7) {
            button.classList.add('invisible');
            setTimeout(() => {
                if (button.parentElement) {
                    button.remove();
                }
            }, 1000);
        }
    }, Math.random() * 10000 + 5000);
});

// 入力フィールドの混乱動作
elements.username.addEventListener('input', function() {
    increaseConfusion(0.5);
    
    // たまに入力が勝手に変わる
    if (Math.random() < 0.1) {
        setTimeout(() => {
            this.value = this.value.split('').reverse().join('');
        }, 500);
    }
    
    // 入力が長くなると警告
    if (this.value.length > 5) {
        showFakeAlert('ユーザー名が長すぎます（嘘）');
    }
});

elements.password.addEventListener('input', function() {
    increaseConfusion(0.5);
    
    // パスワードが見える
    if (Math.random() < 0.2) {
        this.type = 'text';
        setTimeout(() => {
            this.type = 'password';
        }, 1000);
    }
});

// フォーカス時に要素が移動
[elements.username, elements.password].forEach(input => {
    input.addEventListener('focus', function() {
        if (Math.random() < 0.3) {
            const parent = this.parentElement;
            parent.style.transform = `translateX(${Math.random() * 100 - 50}px)`;
            setTimeout(() => {
                parent.style.transform = 'translateX(0)';
            }, 2000);
        }
    });
});

// 浮遊する邪魔な要素
let floaterMoved = false;
elements.floater.addEventListener('click', function() {
    increaseConfusion(1);
    
    if (!floaterMoved) {
        moveElementRandomly(this);
        this.querySelector('p').textContent = '移動しました';
        floaterMoved = true;
    } else {
        // 2回目のクリックで分裂
        const clone = this.cloneNode(true);
        clone.querySelector('p').textContent = '分裂しました';
        document.body.appendChild(clone);
        moveElementRandomly(clone);
    }
});

// ランダムイベント
setInterval(() => {
    if (confusionLevel > 5) {
        const randomEvents = [
            () => {
                elements.title.textContent = '混乱システム v' + Math.random().toFixed(2);
            },
            () => {
                document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 2000);
            },
            () => {
                const allButtons = document.querySelectorAll('.btn');
                allButtons.forEach(btn => {
                    if (Math.random() < 0.3) {
                        randomizeButtonText(btn);
                    }
                });
            },
            () => {
                showFakeAlert('ランダムエラーが発生しました');
            }
        ];
        
        if (Math.random() < 0.1) {
            const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
            randomEvent();
        }
    }
}, 3000);

// 画面サイズ変更時の混乱
window.addEventListener('resize', () => {
    increaseConfusion(0.5);
    showFakeAlert('画面サイズが変更されました（当然）');
});

// 右クリック防止（さらなる混乱のため）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    increaseConfusion(1);
    showFakeAlert('右クリックは禁止されています');
});

// キーボードショートカットの混乱
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        increaseConfusion(1);
        showFakeAlert('保存できません（ファイルが存在しません）');
    }
    
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        increaseConfusion(1);
        showFakeAlert('元に戻せません（履歴がありません）');
    }
    
    if (e.key === 'Escape') {
        increaseConfusion(1);
        showFakeAlert('エスケープできません');
    }
});

// 初期化時のメッセージ
window.addEventListener('load', () => {
    setTimeout(() => {
        showFakeAlert('ようこそ混乱システムへ！操作するほど混乱します。');
    }, 1000);
});

// タッチイベント（スマホ対応）
document.addEventListener('touchstart', (e) => {
    // タッチ時に軽く混乱度を上げる
    increaseConfusion(0.1);
}, { passive: true });

// 長時間操作がない場合の自動混乱
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        increaseConfusion(1);
        showFakeAlert('長時間操作がありません。システムが勝手に動作します。');
        
        // ランダムにボタンを押したような効果
        const allButtons = document.querySelectorAll('.btn');
        if (allButtons.length > 0) {
            const randomButton = allButtons[Math.floor(Math.random() * allButtons.length)];
            randomButton.click();
        }
    }, 30000); // 30秒
}

// ユーザーの操作を監視
['click', 'keydown', 'mousemove', 'touchstart'].forEach(eventType => {
    document.addEventListener(eventType, resetInactivityTimer, { passive: true });
});

// 初期タイマー設定
resetInactivityTimer();
