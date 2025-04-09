class LanguageSelectorView {
    constructor(containerId, languages, onLanguageSelected) {
        this.container = document.getElementById(containerId);
        this.languages = languages;
        this.onLanguageSelected = onLanguageSelected;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="language-selector">
                <label for="language-select">Select Language:</label>
                <select id="language-select">
                    ${this.languages.map(language => `<option value="${language.code}">${language.name}</option>`).join('')}
                </select>
            </div>
        `;
        this.languageSelect = this.container.querySelector('#language-select');
        this.languageSelect.addEventListener('change', () => {
            this.onLanguageSelected(this.languageSelect.value);
        });
    }
}

export default LanguageSelectorView;
