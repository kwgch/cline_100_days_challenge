class TimerView {
    constructor(container) {
        this.container = container;
    }

    updateTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        this.container.textContent = formattedTime;
    }
}

export { TimerView };
