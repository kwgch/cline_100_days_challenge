class StorageController {
    constructor(gameController) {
        this.gameController = gameController;
        this.storageKey = 'sudoku_game_state';
    }

    saveGame() {
        // ゲームの状態をローカルストレージに保存するロジック
    }

    loadGame() {
        // ローカルストレージからゲームの状態を読み込むロジック
    }

    clearSavedGame() {
        // ローカルストレージに保存されたゲームの状態をクリアするロジック
    }
}

export { StorageController };
