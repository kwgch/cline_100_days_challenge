export class LevelManager {
    constructor(levelSettings) {
        this.levelSettings = levelSettings;
        this.currentLevelIndex = 0;
    }

    getLevelSettings(levelIndex) {
        if (levelIndex >= 0 && levelIndex < this.levelSettings.length) {
            return this.levelSettings[levelIndex];
        } else {
            return null;
        }
    }

    getTotalLevels() {
        return this.levelSettings.length;
    }

    checkGoal(ball) {
        const levelSetting = this.getLevelSettings(this.currentLevelIndex);
        if (!levelSetting) return false;

        const goalPosition = levelSetting.goalPos;
        const distance = BABYLON.Vector3.Distance(ball.position, new BABYLON.Vector3(goalPosition.x, goalPosition.y, goalPosition.z));
        return distance < 0.5;
    }
}
