class ChatView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render(messages) {
        this.container.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(message.sender);
            messageElement.innerHTML = `
                ${message.sender === 'user' ? '<i class="fas fa-face-smile"></i>' : '<i class="fas fa-robot"></i>'}
                <span>${message.text}</span>
            `;
            this.container.appendChild(messageElement);
        });
    }
}

export default ChatView;
