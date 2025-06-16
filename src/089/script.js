class ParadoxExperience {
    constructor() {
        this.pushCount = 0;
        this.truthState = true;
        this.boxOpen = false;
        this.progressValue = 0;
        this.cursorVisible = false;
        
        this.init();
    }
    
    init() {
        this.setupPushableUnpushable();
        this.setupInvisibleVisible();
        this.setupStaticMoving();
        this.setupTruthLie();
        this.setupEmptyFullProgress();
        this.setupSilentSound();
        this.setupUnselectableSelectable();
        this.setupSchrodingerBox();
        this.setupInvisibleCursor();
        this.setupPageExistence();
    }
    
    // 押せない押せるボタン
    setupPushableUnpushable() {
        const button = document.getElementById('mainButton');
        const countSpan = document.getElementById('pushCount');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.pushCount++;
            countSpan.textContent = this.pushCount;
            
            // ボタンのテキストを矛盾させる
            const buttonText = button.querySelector('.button-text');
            buttonText.textContent = this.pushCount % 2 === 0 ? '押せません' : '押せます';
            
            // 押すたびに逃げる
            if (this.pushCount % 3 === 0) {
                button.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px)`;
                setTimeout(() => {
                    button.style.transform = 'translate(0, 0)';
                }, 500);
            }
            
            // クリックエフェクトを反転
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 300);
        });
        
        // ホバー時に逃げる
        button.addEventListener('mouseenter', () => {
            if (Math.random() > 0.5) {
                button.style.pointerEvents = 'none';
                setTimeout(() => {
                    button.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    }
    
    // 見えない見えるテキスト
    setupInvisibleVisible() {
        const invisibleText = document.getElementById('invisibleText');
        let isVisible = false;
        
        // 定期的に可視性を切り替え
        setInterval(() => {
            isVisible = !isVisible;
            invisibleText.style.opacity = isVisible ? '1' : '0';
            
            // でもテキストは反対のことを言う
            const text = invisibleText.querySelector('p');
            text.textContent = isVisible ? 'このテキストは見えません' : 'このテキストは見えています';
        }, 3000);
        
        // マウスオーバーで逆の動作
        invisibleText.addEventListener('mouseenter', () => {
            invisibleText.style.opacity = isVisible ? '0' : '1';
        });
        
        invisibleText.addEventListener('mouseleave', () => {
            invisibleText.style.opacity = isVisible ? '1' : '0';
        });
    }
    
    // 止まっている動く要素
    setupStaticMoving() {
        const element = document.getElementById('movingStatic');
        const inner = element.querySelector('.inner-static');
        
        // 常に動いているが「静止」と主張
        let angle = 0;
        setInterval(() => {
            angle += 2;
            element.style.transform = `rotate(${angle}deg)`;
            
            // 内部要素は逆回転で相殺
            inner.style.transform = `rotate(${-angle}deg)`;
        }, 50);
        
        // クリックで「止める」（実際は加速）
        element.addEventListener('click', () => {
            element.style.animationDuration = '0.5s';
            setTimeout(() => {
                element.style.animationDuration = '2s';
            }, 2000);
        });
    }
    
    // 真実の嘘
    setupTruthLie() {
        const truthLie = document.getElementById('truthLie');
        const changingSpan = truthLie.querySelector('.changing');
        
        // 自己言及パラドックス
        setInterval(() => {
            this.truthState = !this.truthState;
            changingSpan.textContent = this.truthState ? '嘘' : '真実';
            
            // 色も反転
            truthLie.style.color = this.truthState ? '#e74c3c' : '#2ecc71';
        }, 2000);
        
        // クリックで混乱
        truthLie.addEventListener('click', () => {
            changingSpan.textContent = '嘘でも真実でもある';
            setTimeout(() => {
                changingSpan.textContent = this.truthState ? '嘘' : '真実';
            }, 1000);
        });
    }
    
    // 満ちている空のプログレスバー
    setupEmptyFullProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.querySelector('.progress-text');
        
        // 視覚的には満ちているが、数値は0
        progressBar.style.width = '100%';
        
        // アニメーション
        setInterval(() => {
            this.progressValue = (this.progressValue + 1) % 101;
            
            // 表示と実際を逆にする
            const displayWidth = (100 - this.progressValue) + '%';
            progressBar.style.width = displayWidth;
            
            // テキストも矛盾
            progressText.textContent = `${this.progressValue}% 完了（${100 - this.progressValue}% 完了）`;
        }, 100);
    }
    
    // 音のない音
    setupSilentSound() {
        const soundButton = document.getElementById('soundButton');
        const volumeIndicator = soundButton.querySelector('.volume-indicator');
        
        soundButton.addEventListener('click', () => {
            // 視覚的なフィードバックのみ
            soundButton.classList.add('playing');
            volumeIndicator.textContent = '音量: ' + (Math.random() > 0.5 ? 'MAX' : 'MUTE');
            
            // 波形アニメーション（音は出ない）
            const waves = document.createElement('div');
            waves.className = 'sound-waves';
            soundButton.appendChild(waves);
            
            setTimeout(() => {
                soundButton.classList.remove('playing');
                waves.remove();
            }, 2000);
            
            // 振動で「音」を表現
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 50, 50, 50]);
            }
        });
    }
    
    // 選択できない選択肢
    setupUnselectableSelectable() {
        const radios = document.querySelectorAll('input[type="radio"]');
        
        radios.forEach(radio => {
            radio.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 選択しようとすると別のものが選ばれる
                const otherRadio = Array.from(radios).find(r => r !== radio);
                otherRadio.checked = true;
                
                // すぐに選択解除
                setTimeout(() => {
                    otherRadio.checked = false;
                }, 500);
            });
            
            // ラベルクリックも妨害
            radio.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                radio.parentElement.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    radio.parentElement.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }
    
    // シュレーディンガーの箱
    setupSchrodingerBox() {
        const box = document.getElementById('box');
        const boxStatus = box.querySelector('.box-status');
        const contentState = box.querySelector('.content-state');
        
        box.addEventListener('click', () => {
            this.boxOpen = !this.boxOpen;
            
            // 状態の重ね合わせ
            if (this.boxOpen) {
                boxStatus.textContent = '開いて';
                // 観測により状態が確定...しない
                const states = ['猫が生きている', '猫が死んでいる', '猫がいない', '猫が2匹いる', '箱の中に箱がある'];
                contentState.textContent = states[Math.floor(Math.random() * states.length)];
                
                // でもすぐに不確定に戻る
                setTimeout(() => {
                    contentState.textContent = '存在し、存在しない';
                }, 2000);
            } else {
                boxStatus.textContent = '閉じて';
                contentState.textContent = '不確定';
            }
            
            // 視覚的には常に閉じているように見える
            box.classList.toggle('open');
        });
    }
    
    // 見えない見えるカーソル
    setupInvisibleCursor() {
        const customCursor = document.getElementById('customCursor');
        let cursorTrail = [];
        
        document.addEventListener('mousemove', (e) => {
            // 実際のカーソル位置と逆
            const invertedX = window.innerWidth - e.clientX;
            const invertedY = window.innerHeight - e.clientY;
            
            // 時々正しい位置、時々逆位置
            const useInverted = Math.random() > 0.7;
            const x = useInverted ? invertedX : e.clientX;
            const y = useInverted ? invertedY : e.clientY;
            
            customCursor.style.left = x + 'px';
            customCursor.style.top = y + 'px';
            
            // カーソルの軌跡（でも違う場所に）
            if (cursorTrail.length > 10) {
                const oldTrail = cursorTrail.shift();
                oldTrail.remove();
            }
            
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = (e.clientX + Math.random() * 50 - 25) + 'px';
            trail.style.top = (e.clientY + Math.random() * 50 - 25) + 'px';
            document.body.appendChild(trail);
            cursorTrail.push(trail);
            
            setTimeout(() => {
                trail.style.opacity = '0';
            }, 100);
        });
        
        // カーソルの可視性を切り替え
        setInterval(() => {
            this.cursorVisible = !this.cursorVisible;
            customCursor.style.opacity = this.cursorVisible ? '1' : '0';
        }, 1000);
    }
    
    // ページの存在/非存在
    setupPageExistence() {
        const existenceSpan = document.querySelector('.existence');
        const body = document.body;
        
        // 時々ページが「存在しない」
        setInterval(() => {
            const exists = Math.random() > 0.1;
            
            if (!exists) {
                existenceSpan.textContent = '存在しません';
                body.style.opacity = '0.5';
                body.style.filter = 'grayscale(100%)';
                
                // でもインタラクションは可能
                setTimeout(() => {
                    existenceSpan.textContent = '存在';
                    body.style.opacity = '1';
                    body.style.filter = 'none';
                }, 1000);
            }
        }, 5000);
        
        // ページを離れようとすると...
        window.addEventListener('beforeunload', (e) => {
            // 時々離れられない
            if (Math.random() > 0.5) {
                e.preventDefault();
                e.returnValue = 'このページは存在しないので離れられません';
            }
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new ParadoxExperience();
    
    // コンソールにも矛盾を
    console.log('このコンソールログは表示されていません');
    console.error('エラーはありません');
    console.warn('警告: 問題ありません');
});