export class LevelManager {
    constructor(settings) {
        this.settings = settings;
    }

    getLevelSettings(index) {
        return this.settings[index];
    }

    getTotalLevels() {
        return this.settings.length;
    }

    checkGoal(ball) {
        // code to check goal
    }
}
