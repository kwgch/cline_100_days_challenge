class Target {
    constructor(size = 50, speed = 1) {
        this.size = size;
        this.speed = speed;
        this.element = document.createElement('div');
        this.element.id = 'target';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.borderRadius = '50%';
        this.element.style.position = 'absolute';
        this.element.style.cursor = 'pointer';
    }

    getElement() {
        return this.element;
    }

    setSize(size) {
        this.size = size;
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    move(gameWidth, gameHeight) {
        const randomX = Math.random() * gameWidth;
        const randomY = Math.random() * gameHeight;

        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
    }
}

export default Target;
