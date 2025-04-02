class ControlView {
    constructor(container, controller) {
        this.container = container;
        this.controller = controller;
    }

    render() {
        this.container.innerHTML = '';

        const numberButtons = document.createElement('div');
        numberButtons.classList.add('number-buttons');
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                this.controller.handleNumberInput(i);
            });
            numberButtons.appendChild(button);
        }
        this.container.appendChild(numberButtons);

        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        const checkButton = document.createElement('button');
        checkButton.textContent = 'Check';
        checkButton.addEventListener('click', () => {
            this.controller.checkSolution();
        });
        actionButtons.appendChild(checkButton);

        const solveButton = document.createElement('button');
        solveButton.textContent = 'Solve';
        solveButton.addEventListener('click', () => {
            this.controller.solveSudoku();
        });
        actionButtons.appendChild(solveButton);

        this.container.appendChild(actionButtons);
    }

    updateDifficultySelection(difficulty) {
        // 難易度選択のUIを更新するロジック
    }
}

export { ControlView };
