// UI操作のモジュール
const UI = {
    // 画面切り替え
    showScreen: function(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    },
    
    // スコア表示の更新
    updateScore: function(score) {
        document.getElementById('score').textContent = `スコア: ${score}`;
    },
    
    // ラウンド表示の更新
    updateRound: function(current, total) {
        document.getElementById('round').textContent = `ラウンド: ${current}/${total}`;
    },
    
    // 刺激の表示
    showStimulus: function(stimulus) {
        const container = document.getElementById('stimulus-container');
        container.textContent = stimulus;
        // アニメーション効果を追加
        container.classList.add('show-stimulus');
        setTimeout(() => {
            container.classList.remove('show-stimulus');
        }, 300);
    },
    
    // 結果画面の更新
    updateResults: function(score, accuracy, highScore) {
        document.getElementById('final-score').textContent = `最終スコア: ${score}`;
        document.getElementById('accuracy').textContent = `正答率: ${accuracy}%`;
        document.getElementById('high-score').textContent = `最高スコア: ${highScore}`;
    }
};
