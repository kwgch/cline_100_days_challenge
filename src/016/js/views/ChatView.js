class ChatView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.chatArea = document.getElementById('chat-area');
    }

    render(messages) {
        this.chatArea.innerHTML = '';
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(message.sender);
            messageElement.innerHTML = `
                <div class="avatar">
                    ${message.sender === 'user' ? '<i class="fas fa-face-smile"></i>' : '<i class="fas fa-robot"></i>'}
                </div>
                <div class="message-text">
                    <span>${message.text}</span>
                </div>
            `;
            this.chatArea.appendChild(messageElement);
        });
    }
}

export default ChatView;
