document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const gameClear = document.getElementById('gameClear');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const confettiCtx = confettiCanvas.getContext('2d');

    // Set canvas size to fill the screen
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    let cards = [];
    let flippedCards = [];
    let lockBoard = false;
    let matchedPairs = 0;
    let moveCount = 0;

    const emojis = ["😀", "😂", "😎", "😍", "🤔", "😴", "🤩", "🤯"];
    const pairs = [...emojis, ...emojis]; // Duplicate emojis for pairs

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffleArray(pairs);

        for (let i = 0; i < pairs.length; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = pairs[i];
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        }
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.emoji; // Show the emoji
        flippedCards.push(this);
        moveCount++;
        updateMoveCount();

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        let isMatch = flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        flippedCards.forEach(card => {
            card.removeEventListener('click', flipCard);
        });

        matchedPairs++;
        if (matchedPairs === emojis.length) {
            gameClearSequence();
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
                card.textContent = ""; // Hide the emoji
            });

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    function gameClearSequence() {
        gameClear.style.display = "block";
        startConfetti();
    }

    // Confetti effect
    function startConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function updateMoveCount() {
        document.getElementById('moveCount').textContent = `Moves: ${moveCount}`;
    }

    createBoard();
});
