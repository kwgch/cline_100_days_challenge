class CollisionManager {
    constructor(game) {
        this.game = game;
    }

    checkCollisions() {
        for (let i = 0; i < this.game.enemies.length; i++) {
            const enemy = this.game.enemies[i];

            // Check player collision with enemy
            if (this.isColliding(this.game.player, enemy)) {
                this.game.lives--;
                this.game.enemies.splice(i, 1);
                i--;

                if (this.game.lives <= 0) {
                    this.game.endGame();
                }
            }

            // Check weapon collision with enemy
            const weapons = [...this.game.player.weapons];
            for (let j = 0; j < weapons.length; j++) {
                const weapon = weapons[j];

                if (this.isColliding(weapon, enemy)) {
                    this.game.score++;
                    this.game.enemies.splice(i, 1);
                    i--;
                    this.game.player.weapons.splice(j, 1);
                    j--;
                    break;
                }
            }
        }
    }

    isColliding(obj1, obj2) {
        return !(
            obj1.x > obj2.x + obj2.width ||
            obj1.x + obj1.width < obj2.x ||
            obj1.y > obj2.y + obj2.height ||
            obj1.y + obj1.height < obj2.y
        );
    }
}
