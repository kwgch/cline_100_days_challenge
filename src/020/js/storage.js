// ローカルストレージ操作のモジュール
const Storage = {
    // 最高スコアの保存
    saveHighScore: function(score) {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem('2backHighScore', score);
            return true;
        }
        return false;
    },
    
    // 最高スコアの取得
    getHighScore: function() {
        return parseInt(localStorage.getItem('2backHighScore') || 0);
    }
};
