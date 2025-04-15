import GameManager from './game.js';
import UIManager from './ui.js';
import StorageManager from './storage.js';
import Target from './target.js';

document.addEventListener('DOMContentLoaded', () => {
    const difficultySelect = document.getElementById('difficulty');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const menuButton = document.getElementById('menu-button');
    const gameScreen = document.getElementById('game-screen');
    const finalScoreDisplay = document.getElementById('final-score');

    let gameManager = null;
    let uiManager = null;
    let storageManager = null;
    let target = null;

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    menuButton.addEventListener('click', showMenu);

    function startGame() {
        const difficulty = difficultySelect.value;
        gameManager = new GameManager(difficulty);
        uiManager = new UIManager();
        storageManager = new StorageManager();

        gameScreen.innerHTML = '';

        uiManager.createScoreDisplay();
        uiManager.createTimerDisplay();

        target = new Target(getDifficultySize(difficulty), getDifficultySpeed(difficulty));

        gameScreen.appendChild(target.getElement());

        let previousX = gameScreen.offsetWidth / 2 - target.size / 2;
        let previousY = gameScreen.offsetHeight / 2 - target.size / 2;

        target.getElement().style.left = `${previousX}px`;
        target.getElement().style.top = `${previousY}px`;

        target.getElement().addEventListener('click', (e) => {
            gameManager.targetClicked();
            const targetRect = target.getElement().getBoundingClientRect();
            const gameScreenRect = gameScreen.getBoundingClientRect();
            const x = targetRect.left + targetRect.width / 2 - gameScreenRect.left;
            const y = targetRect.top + targetRect.height / 2 - gameScreenRect.top;
            createParticles(previousX, previousY);
            previousX = x;
            previousY = y;
        });

        gameManager.updateScoreDisplay = () => {
            uiManager.updateScore(gameManager.score);
        };

        gameManager.updateTimerDisplay = () => {
            uiManager.updateTimer(gameManager.timeLeft);
        };

        gameManager.endGame = () => {
            clearInterval(gameManager.gameInterval);
            gameManager.timeLeft = 30;
            uiManager.showEndScreen(gameManager.score);
            const isNewHighScore = storageManager.updateHighScore(gameManager.score);
            finalScoreDisplay.textContent = `Final Score: ${gameManager.score} ${isNewHighScore ? '(New High Score!)' : ''}`;
        };

        gameManager.moveTarget = () => {
            const gameWidth = gameScreen.offsetWidth - target.size;
            const gameHeight = gameScreen.offsetHeight - target.size;
            target.move(gameWidth, gameHeight);
        };

        difficultySelect.style.display = 'none';
        document.querySelector('label[for="difficulty"]').style.display = 'none';
        gameManager.startGame();
        uiManager.showGameScreen();
    }

    function showMenu() {
        uiManager.showStartScreen();
    }

    function targetClicked() {
        gameManager.targetClicked();
    }

    function getDifficultySize(difficulty) {
        switch (difficulty) {
            case 'easy': return 70;
            case 'normal': return 50;
            case 'hard': return 30;
            default: return 50;
        }
    }

    function getDifficultySpeed(difficulty) {
        switch (difficulty) {
            case 'easy': return 0.5;
            case 'normal': return 1;
            case 'hard': return 1.5;
            default: return 1;
        }
    }

    function createParticles(x, y) {
        const numParticles = 30;
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            gameScreen.appendChild(particle);

            const size = Math.random() * 5 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = '#f08080';
            particle.style.borderRadius = '50%';

            const speed = Math.random() * 3 + 1;
            const angle = Math.random() * 360;

            particle.x = x;
            particle.y = y;
            particle.vx = speed * Math.cos(angle * Math.PI / 180);
            particle.vy = speed * Math.sin(angle * Math.PI / 180);
            particle.gravity = 0.1;

            particle.style.left = `${x - size / 2}px`;
            particle.style.top = `${y - size / 2}px`;

            particle.update = function() {
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;

                this.style.left = `${this.x - size / 2}px`;
                this.style.top = `${this.y - size / 2}px`;
            };

            particle.remove = function() {
                gameScreen.removeChild(this);
            };

            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }

    function updateParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.update();
        });
        requestAnimationFrame(updateParticles);
    }

    updateParticles();
});
