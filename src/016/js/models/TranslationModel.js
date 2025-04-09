class TranslationModel {
    async translate(text, targetLanguage) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data[0][0][0];
        } catch (error) {
            console.error('Translation error:', error);
            return 'Translation failed.';
        }
    }
}

export default TranslationModel;
