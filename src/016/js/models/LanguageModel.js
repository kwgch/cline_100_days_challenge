class LanguageModel {
    constructor() {
        this.languages = [
            { code: 'en', name: 'English' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'zh-CN', name: 'Chinese (Simplified)' },
            { code: 'fr', name: 'French' },
            { code: 'es', name: 'Spanish' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'ru', name: 'Russian' },
            { code: 'ar', name: 'Arabic' }
        ];
    }

    getLanguages() {
        return this.languages;
    }
}

export default LanguageModel;
