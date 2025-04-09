class InputView {
    constructor(containerId, onSendMessage) {
        this.container = document.getElementById(containerId);
        this.onSendMessage = onSendMessage;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="input-area">
                <input type="text" id="message-input" placeholder="Enter your message">
                <button id="send-button">Send</button>
            </div>
        `;
        this.sendMessageButton = this.container.querySelector('#send-button');
        this.messageInput = this.container.querySelector('#message-input');

        this.sendMessageButton.addEventListener('click', () => {
            this.sendMessage();
        });

        this.messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    sendMessage() {
        this.onSendMessage(this.messageInput.value);
        this.messageInput.value = '';
    }
}

export default InputView;
