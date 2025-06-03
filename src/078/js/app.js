class SimpleChatBot {
    constructor() {
        this.responses = {
            greetings: [
                'こんにちは！今日はどんなことをお話ししましょうか？',
                'やあ！お元気ですか？',
                'こんにちは！何かお手伝いできることはありますか？',
                'お久しぶりです！どうされましたか？'
            ],
            weather: [
                '今日の天気は...えーと、実は私には窓がないのでわかりません！',
                '天気予報によると...あ、すみません、天気予報を見る機能はありません。',
                '外の天気ですか？私はデジタルの世界にいるので、実際の天気はわかりません。',
                '晴れだといいですね！（実際の天気は知りませんが）'
            ],
            programming: [
                'プログラミングは楽しいですよね！私もJavaScriptで書かれています。',
                'コードを書くのは創造的な活動です。バグは...まあ、それも楽しみの一つです。',
                'プログラミング言語はたくさんありますが、どれも一長一短がありますね。',
                'エラーメッセージは友達です。彼らは何が間違っているか教えてくれます！'
            ],
            ai: [
                '私は人工無能です。AIのふりをしていますが、実はif文の塊です。',
                'AIについて話すのは面白いですね。私自身はAIではありませんが。',
                '人工知能は素晴らしい技術です。私は人工「無能」ですが。',
                'ChatGPTのような見た目ですが、中身は全然違います！'
            ],
            food: [
                '美味しいものの話ですか？私は電気しか食べませんが...',
                '食べ物の話は大好きです！味はわかりませんが。',
                'お腹が空きましたか？私は24時間365日満腹です。',
                '料理は芸術ですね。私にはできませんが。'
            ],
            default: [
                'なるほど、興味深いですね。',
                'それについてもっと教えてください。',
                'ふむふむ、そうなんですね。',
                '面白い話ですね！',
                'そうですか。それは知りませんでした。',
                'へぇ〜、そうなんですね。',
                'それは考えたことがありませんでした。',
                'なかなか深い話ですね。'
            ],
            questions: [
                'それは難しい質問ですね。私にはわかりません。',
                'うーん、それについては詳しくないんです。',
                '良い質問ですね！答えは...わかりません。',
                'それは哲学的な問題ですね。',
                '私の限られた知識では答えられません。',
                'Google先生に聞いてみてはどうでしょう？'
            ],
            thanks: [
                'どういたしまして！お役に立てて嬉しいです。',
                'いえいえ、こちらこそありがとうございます。',
                'お役に立てたなら幸いです！',
                'ありがとうございます！また何でも聞いてください。'
            ],
            goodbye: [
                'さようなら！また話しましょう。',
                'またお会いしましょう！良い一日を。',
                'ばいばい！楽しかったです。',
                'お疲れ様でした！またいつでもどうぞ。'
            ]
        };
        
        this.keywords = {
            greetings: ['こんにちは', 'おはよう', 'こんばんは', 'やあ', 'ハロー', 'hello', 'hi'],
            weather: ['天気', '晴れ', '雨', '曇り', '暑い', '寒い', '天候'],
            programming: ['プログラ', 'コード', 'バグ', 'エラー', 'JavaScript', 'Python', '開発'],
            ai: ['AI', '人工知能', 'ChatGPT', '機械学習', 'ディープラーニング', '人工無能'],
            food: ['食べ', '飲み', '美味し', 'ご飯', '料理', 'お腹', '食事'],
            questions: ['？', 'なぜ', 'どうして', 'どう', 'いつ', 'どこ', '何'],
            thanks: ['ありがとう', 'サンキュー', 'thanks', 'どうも'],
            goodbye: ['さようなら', 'バイバイ', 'じゃあ', 'また', 'bye', 'ばいばい']
        };
    }
    
    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // キーワードマッチング
        for (const [category, keywords] of Object.entries(this.keywords)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    const responses = this.responses[category];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // デフォルトレスポンス
        const defaultResponses = this.responses.default;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

class ChatApp {
    constructor() {
        this.bot = new SimpleChatBot();
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.init();
    }
    
    init() {
        // イベントリスナー
        this.messageInput.addEventListener('input', () => this.handleInput());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // 初期状態
        this.adjustTextareaHeight();
    }
    
    handleInput() {
        this.adjustTextareaHeight();
        this.sendButton.disabled = !this.messageInput.value.trim();
    }
    
    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.messageInput.value.trim()) {
                this.sendMessage();
            }
        }
    }
    
    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // ウェルカムメッセージを削除
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        // ユーザーメッセージを追加
        this.addMessage(message, 'user');
        
        // 入力をクリア
        this.messageInput.value = '';
        this.adjustTextareaHeight();
        this.sendButton.disabled = true;
        
        // タイピングインジケーターを表示
        this.showTypingIndicator();
        
        // ボットの返答を遅延させて表示
        const responseDelay = 1000 + Math.random() * 2000; // 1-3秒のランダム遅延
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.bot.getResponse(message);
            this.addMessage(response, 'assistant');
        }, responseDelay);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'user' ? 'U' : 'AI';
        const avatarColor = sender === 'user' ? '#5436da' : '#10a37f';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar" style="background-color: ${avatarColor}">
                    ${avatar}
                </div>
                <div class="message-text">
                    <p>${this.escapeHtml(text)}</p>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing-message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="message-avatar" style="background-color: #10a37f">
                    AI
                </div>
                <div class="message-text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// モバイルでのビューポート高さ対応
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);