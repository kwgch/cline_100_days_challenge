document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const targetLanguage = document.getElementById('target-language');
  const translateButton = document.getElementById('translate-button');
  const downloadButton = document.getElementById('download-button');
  const sourceContent = document.getElementById('source-content');
  const translationContent = document.getElementById('translation-content');

  let originalText = '';
  let translatedText = '';

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        originalText = await readFile(file);
        sourceContent.textContent = originalText;
      } catch (error) {
        console.error('Error reading file:', error);
        sourceContent.textContent = 'Error reading file.';
      }
    }
  });

  translateButton.addEventListener('click', async () => {
    if (!originalText) {
      alert('Please select a file first.');
      return;
    }

    const targetLang = targetLanguage.value;
    try {
      translatedText = await translateText(originalText, targetLang);
      translationContent.textContent = translatedText;
      downloadButton.disabled = false;
    } catch (error) {
      console.error('Error translating text:', error);
      translationContent.textContent = 'Error translating text.';
      downloadButton.disabled = true;
    }
  });

  downloadButton.addEventListener('click', () => {
    if (!translatedText) {
      alert('No translated text available.');
      return;
    }

    const filename = 'translated.txt';
    saveAsFile(translatedText, filename);
  });
});
