class LazyMemeGenerator {
    constructor() {
        this.canvas = document.getElementById('memeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.loading = document.getElementById('loading');
        this.history = [];
        
        // 適当な画像テンプレート
        this.templates = [
            { type: 'solid', color: '#ff0000', name: 'あかいやつ' },
            { type: 'solid', color: '#00ff00', name: 'みどりのやつ' },
            { type: 'solid', color: '#0000ff', name: 'あおいやつ' },
            { type: 'gradient', colors: ['#ff0000', '#00ff00'], name: 'にじいろもどき' },
            { type: 'pattern', pattern: 'stripes', name: 'しましま' },
            { type: 'pattern', pattern: 'dots', name: 'みずたま' },
            { type: 'noise', name: 'ざらざら' },
            { type: 'shape', shape: 'circle', name: 'まる' },
            { type: 'shape', shape: 'triangle', name: 'さんかく' },
            { type: 'text', text: '404', name: 'えらー' }
        ];
        
        // 適当なテキスト
        this.randomTexts = {
            top: [
                'いつもの',
                'またこれか',
                'しってた',
                'それな',
                'わかる',
                'ですよね',
                'まじで',
                'やっぱり',
                'なるほど',
                'そういうこと',
                'ん？',
                'え？',
                'は？',
                'なんで',
                'どうして'
            ],
            bottom: [
                'そういうことか',
                'しらんけど',
                'たぶん',
                'かもしれない',
                'っぽい',
                'みたいな',
                'てきな',
                'だとおもう',
                'しらんけど',
                'わからん',
                'ということで',
                'おわり',
                'いじょう',
                'それだけ',
                'なんでもない'
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.generateMeme();
    }
    
    setupCanvas() {
        const size = Math.min(window.innerWidth * 0.8, 400);
        this.canvas.width = size;
        this.canvas.height = size;
    }
    
    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateMeme());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveMeme());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareMeme());
        
        document.getElementById('topText').addEventListener('input', () => this.updateText());
        document.getElementById('bottomText').addEventListener('input', () => this.updateText());
        
        // チェックボックスの変更でも再生成
        ['autoText', 'lowQuality', 'wrongFont'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.updateText());
        });
    }
    
    generateMeme() {
        this.showLoading();
        
        // わざと遅延を入れる（適当な演出）
        setTimeout(() => {
            const template = this.templates[Math.floor(Math.random() * this.templates.length)];
            this.currentTemplate = template;
            
            this.drawBackground(template);
            this.addText();
            this.applyEffects();
            
            this.hideLoading();
            this.addToHistory();
        }, Math.random() * 1000 + 500);
    }
    
    drawBackground(template) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // 背景をクリア
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, w, h);
        
        switch (template.type) {
            case 'solid':
                ctx.fillStyle = template.color;
                ctx.fillRect(0, 0, w, h);
                break;
                
            case 'gradient':
                const gradient = ctx.createLinearGradient(0, 0, w, h);
                gradient.addColorStop(0, template.colors[0]);
                gradient.addColorStop(1, template.colors[1]);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
                break;
                
            case 'pattern':
                if (template.pattern === 'stripes') {
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 10;
                    for (let i = -w; i < w * 2; i += 20) {
                        ctx.beginPath();
                        ctx.moveTo(i, 0);
                        ctx.lineTo(i + w, h);
                        ctx.stroke();
                    }
                } else if (template.pattern === 'dots') {
                    ctx.fillStyle = '#333';
                    for (let x = 0; x < w; x += 30) {
                        for (let y = 0; y < h; y += 30) {
                            ctx.beginPath();
                            ctx.arc(x + 15, y + 15, 10, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
                break;
                
            case 'noise':
                const imageData = ctx.createImageData(w, h);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const value = Math.random() * 255;
                    imageData.data[i] = value;
                    imageData.data[i + 1] = value;
                    imageData.data[i + 2] = value;
                    imageData.data[i + 3] = 255;
                }
                ctx.putImageData(imageData, 0, 0);
                break;
                
            case 'shape':
                ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
                if (template.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(w/2, h/2, w/3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (template.shape === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(w/2, h/4);
                    ctx.lineTo(w/4, h*3/4);
                    ctx.lineTo(w*3/4, h*3/4);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
                
            case 'text':
                ctx.fillStyle = '#333';
                ctx.font = 'bold 120px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(template.text, w/2, h/2);
                break;
        }
    }
    
    addText() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        const autoText = document.getElementById('autoText').checked;
        const wrongFont = document.getElementById('wrongFont').checked;
        
        let topText = document.getElementById('topText').value;
        let bottomText = document.getElementById('bottomText').value;
        
        // 自動テキスト生成
        if (autoText || (!topText && !bottomText)) {
            topText = topText || this.randomTexts.top[Math.floor(Math.random() * this.randomTexts.top.length)];
            bottomText = bottomText || this.randomTexts.bottom[Math.floor(Math.random() * this.randomTexts.bottom.length)];
        }
        
        // フォント設定（わざと変なフォントを使う）
        const fonts = wrongFont ? 
            ['Comic Sans MS', 'Papyrus', 'Impact', 'Times New Roman', 'Courier New'] :
            ['Arial', 'Helvetica', 'sans-serif'];
        
        const fontSize = Math.floor(w / 10 + Math.random() * 20);
        ctx.font = `bold ${fontSize}px ${fonts[Math.floor(Math.random() * fonts.length)]}`;
        ctx.textAlign = 'center';
        
        // テキストの描画（適当な配置）
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#fff';
        
        // 上のテキスト
        if (topText) {
            const y = fontSize + Math.random() * 30;
            ctx.strokeText(topText.toUpperCase(), w/2, y);
            ctx.fillText(topText.toUpperCase(), w/2, y);
        }
        
        // 下のテキスト
        if (bottomText) {
            const y = h - fontSize - Math.random() * 30;
            ctx.strokeText(bottomText.toUpperCase(), w/2, y);
            ctx.fillText(bottomText.toUpperCase(), w/2, y);
        }
        
        // ランダムに適当な装飾を追加
        if (Math.random() > 0.7) {
            this.addRandomDecoration();
        }
    }
    
    addRandomDecoration() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        const decorations = [
            // 適当な絵文字
            () => {
                const emojis = ['😂', '💯', '🔥', '👌', '😎', '🤔', '😭', '💀', '🙃', '👍'];
                ctx.font = '40px serif';
                ctx.fillText(
                    emojis[Math.floor(Math.random() * emojis.length)],
                    Math.random() * w,
                    Math.random() * h
                );
            },
            // 適当な矢印
            () => {
                ctx.strokeStyle = '#f00';
                ctx.lineWidth = 5;
                ctx.beginPath();
                const x = Math.random() * w;
                const y = Math.random() * h;
                ctx.moveTo(x, y);
                ctx.lineTo(x + 50, y + 50);
                ctx.moveTo(x + 50, y + 50);
                ctx.lineTo(x + 40, y + 40);
                ctx.moveTo(x + 50, y + 50);
                ctx.lineTo(x + 40, y + 60);
                ctx.stroke();
            },
            // 適当な円
            () => {
                ctx.strokeStyle = '#ff0';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(
                    Math.random() * w,
                    Math.random() * h,
                    20 + Math.random() * 30,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            }
        ];
        
        decorations[Math.floor(Math.random() * decorations.length)]();
    }
    
    applyEffects() {
        const lowQuality = document.getElementById('lowQuality').checked;
        
        if (lowQuality) {
            // 画質を意図的に悪くする
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            
            // ピクセレート効果
            const pixelSize = 4;
            for (let y = 0; y < this.canvas.height; y += pixelSize) {
                for (let x = 0; x < this.canvas.width; x += pixelSize) {
                    const i = (y * this.canvas.width + x) * 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    for (let dy = 0; dy < pixelSize; dy++) {
                        for (let dx = 0; dx < pixelSize; dx++) {
                            const di = ((y + dy) * this.canvas.width + (x + dx)) * 4;
                            data[di] = r;
                            data[di + 1] = g;
                            data[di + 2] = b;
                        }
                    }
                }
            }
            
            // JPEG圧縮アーティファクト風
            for (let i = 0; i < data.length; i += 4) {
                if (Math.random() > 0.98) {
                    data[i] = Math.min(255, data[i] + 50);
                    data[i + 1] = Math.min(255, data[i + 1] + 50);
                    data[i + 2] = Math.min(255, data[i + 2] + 50);
                }
            }
            
            this.ctx.putImageData(imageData, 0, 0);
        }
    }
    
    updateText() {
        if (this.currentTemplate) {
            this.drawBackground(this.currentTemplate);
            this.addText();
            this.applyEffects();
        }
    }
    
    saveMeme() {
        const link = document.createElement('a');
        link.download = `tekitou-meme-${Date.now()}.jpg`;
        link.href = this.canvas.toDataURL('image/jpeg', 0.7);
        link.click();
    }
    
    shareMeme() {
        // 適当なシェア機能
        if (Math.random() > 0.5) {
            alert('シェアできませんでした\n（たぶん）');
        } else {
            alert('シェアしました\n（うそ）');
        }
    }
    
    addToHistory() {
        const historyItem = {
            data: this.canvas.toDataURL('image/jpeg', 0.5),
            time: Date.now()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 3) {
            this.history.pop();
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.history.forEach((item, index) => {
            const img = document.createElement('img');
            img.src = item.data;
            img.alt = `ミーム${index + 1}`;
            img.addEventListener('click', () => {
                const image = new Image();
                image.onload = () => {
                    this.canvas.width = image.width;
                    this.canvas.height = image.height;
                    this.ctx.drawImage(image, 0, 0);
                };
                image.src = item.data;
            });
            historyList.appendChild(img);
        });
    }
    
    showLoading() {
        this.loading.style.display = 'block';
        this.canvas.style.opacity = '0.5';
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
        this.canvas.style.opacity = '1';
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new LazyMemeGenerator();
});