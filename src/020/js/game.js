// ゲームのコアロジック
const Game = {
    // ゲーム設定
    settings: {
        easy: { interval: 2500, rounds: 20 },
        medium: { interval: 2000, rounds: 30 },
        hard: { interval: 1500, rounds: 40 }
    },
    
    // ゲーム状態
    state: {
        difficulty: 'medium',
        stimuli: [],
        currentRound: 0,
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        timer: null
    },
    
    // 刺激の生成（数字モード）
    generateStimuli: function(rounds) {
        const stimuli = [];
        for (let i = 0; i < rounds; i++) {
            stimuli.push(Math.floor(Math.random() * 9) + 1); // 1-9の数字
        }
        return stimuli;
    },
    
    // ゲームの初期化
    init: function(difficulty) {
        // UI.showScreen('game-screen');
        this.state.difficulty = difficulty;
        this.state.stimuli = this.generateStimuli(this.settings[difficulty].rounds);
        this.state.currentRound = 0;
        this.state.score = 0;
        this.state.correctAnswers = 0;
        this.state.wrongAnswers = 0;
        UI.updateScore(this.state.score);
        UI.updateRound(0, this.settings[difficulty].rounds);
        this.nextRound();
    },
    
    // 次のラウンド
    nextRound: function() {
        const config = this.settings[this.state.difficulty];
        
        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }
        
        if (this.state.currentRound >= config.rounds) {
            this.endGame();
            return;
        }
        
        // 現在の刺激を表示
        const stimulus = this.state.stimuli[this.state.currentRound];
        UI.showStimulus(stimulus);
        
        // ラウンド情報を更新
        this.state.currentRound++;
        UI.updateRound(this.state.currentRound, config.rounds);
        
        // 次のラウンドのタイマーをセット
        this.state.timer = setTimeout(() => {
            // 無回答の場合の処理
            if (this.state.currentRound >= 3) {
                this.processAnswer(null);
            } else {
                this.nextRound();
            }
        }, this.settings[this.state.difficulty].interval);
    },
    
    // 回答の処理
    processAnswer: function(isSame) {
        if (this.state.currentRound >= 3) {
            const currentStimulus = this.state.stimuli[this.state.currentRound - 1];
            const twoBackStimulus = this.state.stimuli[this.state.currentRound - 3];
            const isCorrect = (isSame === (currentStimulus === twoBackStimulus));
            
            if (isCorrect) {
                this.state.score += 10;
                this.state.correctAnswers++;
            } else {
                this.state.score = Math.max(0, this.state.score - 5);
                this.state.wrongAnswers++;
            }
            
            UI.updateScore(this.state.score);
        }
        
        // 次のラウンドへ
        this.nextRound();
    },
    
    // ゲーム終了
    endGame: function() {
        const totalAnswers = this.state.correctAnswers + this.state.wrongAnswers;
        const accuracy = totalAnswers > 0 ? Math.round((this.state.correctAnswers / totalAnswers) * 100) : 0;
        
        // 最高スコアを更新
        const highScore = Storage.getHighScore();
        const isNewHighScore = Storage.saveHighScore(this.state.score);
        
        // 結果画面を表示
        UI.updateResults(this.state.score, accuracy, Math.max(highScore, this.state.score));
        UI.showScreen('result-screen');
    }
};

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    // 難易度選択
    const difficultyButtons = document.querySelectorAll('.difficulty-selection button');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            difficultyButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            Game.state.difficulty = this.dataset.difficulty;
        });
    });
    
    // ゲーム開始ボタン
    document.getElementById('start-button').addEventListener('click', function() {
        Game.init(Game.state.difficulty);
        UI.showScreen('game-screen');
    });
    
    // 回答ボタン
    document.getElementById('same-button').addEventListener('click', function() {
        Game.processAnswer(true);
    });
    
    document.getElementById('different-button').addEventListener('click', function() {
        Game.processAnswer(false);
    });
    
    // リスタートボタン
    document.getElementById('restart-button').addEventListener('click', function() {
        UI.showScreen('start-screen');
    });
    
    // 初期画面表示
    UI.showScreen('start-screen');
});
