import LanguageModel from '../models/LanguageModel.js';
import TranslationModel from '../models/TranslationModel.js';
import ChatView from '../views/ChatView.js';
import InputView from '../views/InputView.js';
import LanguageSelectorView from '../views/LanguageSelectorView.js';

class TranslationController {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.languageModel = new LanguageModel();
        this.translationModel = new TranslationModel();
        this.messages = [];
        this.targetLanguage = 'en'; // Default language

        this.chatView = new ChatView('chat-container');
        this.inputView = new InputView('input-container', this.sendMessage.bind(this));
        this.languageSelectorView = new LanguageSelectorView('language-selector-container', this.languageModel.getLanguages(), this.setTargetLanguage.bind(this));

        this.render();
    }

    async sendMessage(text) {
        this.messages.push({ text: text, sender: 'user' });
        this.render();
        const translatedText = await this.translationModel.translate(text, this.targetLanguage);
        this.messages.push({ text: translatedText, sender: 'bot' });
        this.render();
    }

    setTargetLanguage(language) {
        this.targetLanguage = language;
    }

    render() {
        this.chatView.render(this.messages);
    }
}

export default TranslationController;
