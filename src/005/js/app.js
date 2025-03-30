document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const fontSelector = document.getElementById('font-selector');
    const fontSizeSlider = document.getElementById('font-size');
    const sizeValueDisplay = document.getElementById('size-value');
    const inputText = document.getElementById('input-text');
    const preview = document.getElementById('preview');
    const copyBtn = document.getElementById('copy-btn');
    
    // フォントセレクタの初期化
    initFontSelector();
    
    // イベントリスナーの設定
    fontSelector.addEventListener('change', updatePreview);
    fontSizeSlider.addEventListener('input', updateFontSizeDisplay);
    fontSizeSlider.addEventListener('change', updatePreview);
    inputText.addEventListener('input', updatePreview);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // 初期プレビューの表示
    updatePreview();
    
    // フォントセレクタの初期化関数
    function initFontSelector() {
        availableFonts.forEach(font => {
            const option = document.createElement('option');
            option.value = font.family;
            option.textContent = font.name;
            fontSelector.appendChild(option);
        });
    }
    
    // フォントサイズ表示の更新
    function updateFontSizeDisplay() {
        sizeValueDisplay.textContent = fontSizeSlider.value;
        updatePreview();
    }
    
    // プレビューの更新
    function updatePreview() {
        const selectedFont = fontSelector.value;
        const fontSize = fontSizeSlider.value;
        const text = inputText.value || 'プレビューテキスト';
        
        preview.style.fontFamily = selectedFont;
        preview.style.fontSize = `${fontSize}px`;
        preview.textContent = text;
    }
    
    // クリップボードにコピー
    function copyToClipboard() {
        const textToCopy = inputText.value;
        
        if (!textToCopy) {
            alert('コピーするテキストがありません。');
            return;
        }
        
        // クリップボードAPIを使用
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // コピー成功時の処理
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'コピーしました！';
                
                // 2秒後に元のテキストに戻す
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                // コピー失敗時の処理
                console.error('クリップボードへのコピーに失敗しました:', err);
                alert('コピーに失敗しました。');
            });
    }
});
