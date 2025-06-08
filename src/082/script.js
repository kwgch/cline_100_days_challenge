// 診断データを管理するクラス
class DiagnosisManager {
    constructor() {
        this.diagnoses = this.loadDiagnoses();
        this.currentDiagnosis = null;
    }

    loadDiagnoses() {
        const saved = localStorage.getItem('diagnoses');
        return saved ? JSON.parse(saved) : this.getDefaultDiagnoses();
    }

    getDefaultDiagnoses() {
        return [
            {
                id: 'animal',
                title: 'あなたを動物に例えると診断',
                inputLabel: '名前',
                template: '{name}さんを動物に例えると「{result}」です！\n\n{description}\n\n相性の良い動物: {compatible}\nラッキーアイテム: {lucky_item}',
                patterns: [
                    {
                        result: 'ライオン',
                        description: 'リーダーシップがあり、堂々とした性格の持ち主です。',
                        compatible: 'シマウマ',
                        lucky_item: '王冠'
                    },
                    {
                        result: 'ウサギ',
                        description: '優しくて繊細な心の持ち主。周りの人を癒す存在です。',
                        compatible: 'カメ',
                        lucky_item: 'にんじん'
                    },
                    {
                        result: 'フクロウ',
                        description: '知的で冷静な判断力を持つ、頼れる存在です。',
                        compatible: 'ネズミ',
                        lucky_item: '眼鏡'
                    }
                ]
            },
            {
                id: 'color',
                title: 'あなたのオーラカラー診断',
                inputLabel: '名前',
                template: '{name}さんのオーラカラーは「{result}」です！\n\n{description}\n\n相性の良い色: {compatible}\nラッキーアイテム: {lucky_item}',
                patterns: [
                    {
                        result: '情熱の赤',
                        description: 'エネルギッシュで行動力があり、周りを元気にする力を持っています。',
                        compatible: '冷静の青',
                        lucky_item: 'ルビー'
                    },
                    {
                        result: '癒しの緑',
                        description: '穏やかで優しい性格で、人々に安らぎを与えます。',
                        compatible: '活力の黄',
                        lucky_item: '観葉植物'
                    },
                    {
                        result: '神秘の紫',
                        description: '直感力が鋭く、芸術的センスに優れています。',
                        compatible: '純粋の白',
                        lucky_item: 'アメジスト'
                    }
                ]
            },
            {
                id: 'ramen',
                title: 'あなたがラーメンだったら診断',
                inputLabel: '名前',
                template: '{name}さんがラーメンだったら「{result}」です！\n\n{description}\n\n最高の組み合わせ: {compatible}\n今日のトッピング運: {lucky_item}',
                patterns: [
                    {
                        result: '二郎系ラーメン',
                        description: 'ボリューム満点！存在感がハンパない。「マシマシ」が口癖になりそう。',
                        compatible: 'ニンニク',
                        lucky_item: 'ヤサイマシマシアブラカラメ'
                    },
                    {
                        result: 'とんこつラーメン',
                        description: 'こってり濃厚な性格。一度ハマると抜け出せない魅力の持ち主。',
                        compatible: '替え玉',
                        lucky_item: '紅しょうが'
                    },
                    {
                        result: '塩ラーメン',
                        description: 'シンプルだけど奥が深い。透明感のある性格で、誰からも好かれます。',
                        compatible: 'ワンタン',
                        lucky_item: '白髪ねぎ'
                    },
                    {
                        result: 'つけ麺',
                        description: '熱いものと冷たいもの、両方の良さを持つバランス型。麺は太めがお似合い。',
                        compatible: '魚粉',
                        lucky_item: 'ゆず'
                    },
                    {
                        result: 'カップラーメン',
                        description: '手軽で親しみやすい性格。3分待てないせっかちさんかも？',
                        compatible: 'コンビニおにぎり',
                        lucky_item: 'お湯'
                    }
                ]
            },
            {
                id: 'excuse',
                title: 'あなたの遅刻言い訳ジェネレーター',
                inputLabel: '名前',
                template: '{name}さんの今日の遅刻理由は...\n\n「{result}」\n\n{description}\n\n同じ言い訳仲間: {compatible}\n次回のお守り: {lucky_item}',
                patterns: [
                    {
                        result: '電車が逆方向に走り始めたんです',
                        description: '創造力豊かな言い訳。信じてもらえる確率は3%です。',
                        compatible: 'タイムトラベラー',
                        lucky_item: '正しい路線図'
                    },
                    {
                        result: '猫に道を聞かれて教えていました',
                        description: '優しさが裏目に出るタイプ。動物愛護精神は評価されるかも？',
                        compatible: '迷子の犬',
                        lucky_item: '猫じゃらし'
                    },
                    {
                        result: '重力が今日だけ強くて歩けませんでした',
                        description: '物理法則まで味方につける斬新さ。科学の先生には通用しません。',
                        compatible: 'アインシュタイン',
                        lucky_item: '反重力シューズ'
                    },
                    {
                        result: '朝食のパンと哲学的な議論をしていました',
                        description: '深い思考の持ち主。ただし実用性はゼロです。',
                        compatible: 'ソクラテス',
                        lucky_item: 'バター'
                    },
                    {
                        result: '夢の中で既に出社していたので二度寝しました',
                        description: '夢と現実の区別がつかない芸術家タイプ。',
                        compatible: '枕',
                        lucky_item: '目覚まし時計（壊れてないやつ）'
                    }
                ]
            },
            {
                id: 'superpower',
                title: 'あなたの隠れた超能力診断',
                inputLabel: '名前',
                template: '{name}さんの隠れた超能力は「{result}」です！\n\n{description}\n\n天敵: {compatible}\n能力増幅アイテム: {lucky_item}',
                patterns: [
                    {
                        result: '絶対に信号を青にする能力',
                        description: '近づくだけで信号が青に！ただし歩行者信号は苦手。',
                        compatible: '赤信号マニア',
                        lucky_item: '緑色の服'
                    },
                    {
                        result: 'エレベーターを念力で呼ぶ能力',
                        description: 'ボタンを押す前にエレベーターが来る。階段派の人には理解されません。',
                        compatible: '階段',
                        lucky_item: '上りボタン'
                    },
                    {
                        result: '他人のお腹の音を聞き分ける能力',
                        description: '半径5m以内のお腹の音を完璧に聞き分けます。昼食前は大忙し。',
                        compatible: '満腹の人',
                        lucky_item: 'おにぎり'
                    },
                    {
                        result: 'Wi-Fiパスワードを透視する能力',
                        description: 'カフェに入った瞬間にWi-Fiパスワードがわかる現代の救世主。',
                        compatible: '有線LAN',
                        lucky_item: 'スマートフォン'
                    },
                    {
                        result: '消しゴムのカスを一瞬で集める能力',
                        description: '勉強中の最強の味方。ただし鉛筆派には不要な能力。',
                        compatible: 'シャーペン派',
                        lucky_item: '新品の消しゴム'
                    }
                ]
            }
        ];
    }

    saveDiagnoses() {
        localStorage.setItem('diagnoses', JSON.stringify(this.diagnoses));
    }

    addDiagnosis(diagnosis) {
        diagnosis.id = Date.now().toString();
        this.diagnoses.push(diagnosis);
        this.saveDiagnoses();
    }

    deleteDiagnosis(id) {
        this.diagnoses = this.diagnoses.filter(d => d.id !== id);
        this.saveDiagnoses();
    }

    executeDiagnosis(diagnosisId, input) {
        const diagnosis = this.diagnoses.find(d => d.id === diagnosisId);
        if (!diagnosis) return null;

        // 入力値からハッシュ値を生成して結果を決定
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash = hash & hash;
        }
        
        const index = Math.abs(hash) % diagnosis.patterns.length;
        const pattern = diagnosis.patterns[index];

        // テンプレートに値を埋め込む
        let result = diagnosis.template;
        result = result.replace(/{name}/g, input);
        result = result.replace(/{result}/g, pattern.result);
        result = result.replace(/{description}/g, pattern.description);
        result = result.replace(/{compatible}/g, pattern.compatible);
        result = result.replace(/{lucky_item}/g, pattern.lucky_item);

        return {
            title: diagnosis.title,
            input: input,
            result: result,
            pattern: pattern
        };
    }
}

// UIを管理するクラス
class UIManager {
    constructor(diagnosisManager) {
        this.diagnosisManager = diagnosisManager;
        this.initializeEventListeners();
        this.displaySavedDiagnoses();
    }

    initializeEventListeners() {
        // パターン追加ボタン
        document.getElementById('add-pattern').addEventListener('click', () => {
            this.addPatternField();
        });

        // 診断保存ボタン
        document.getElementById('save-diagnosis').addEventListener('click', () => {
            this.saveDiagnosis();
        });

        // 診断実行ボタン
        document.getElementById('execute-diagnosis').addEventListener('click', () => {
            this.executeDiagnosis();
        });

        // もう一度診断ボタン
        document.getElementById('retry-diagnosis').addEventListener('click', () => {
            this.retryDiagnosis();
        });

        // シェアボタン
        document.getElementById('share-result').addEventListener('click', () => {
            this.shareResult();
        });

        // エンターキーで診断実行
        document.getElementById('player-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeDiagnosis();
            }
        });

        // タッチイベントの制御
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    addPatternField() {
        const container = document.getElementById('result-patterns');
        const patternItem = document.createElement('div');
        patternItem.className = 'pattern-item';
        patternItem.innerHTML = `
            <input type="text" class="pattern-result" placeholder="結果（例: 戦士）">
            <textarea class="pattern-description" rows="2" placeholder="説明（例: 勇敢で正義感が強い）"></textarea>
            <input type="text" class="pattern-compatible" placeholder="相性の良い人（例: 魔法使い）">
            <input type="text" class="pattern-lucky" placeholder="ラッキーアイテム（例: 剣）">
            <button class="remove-pattern" onclick="removePattern(this)">×</button>
        `;
        container.appendChild(patternItem);
    }

    saveDiagnosis() {
        const title = document.getElementById('diagnosis-title').value.trim();
        const inputLabel = document.getElementById('input-label').value.trim();
        const template = document.getElementById('result-template').value.trim();
        
        if (!title || !inputLabel || !template) {
            alert('すべての項目を入力してください');
            return;
        }

        const patterns = [];
        const patternItems = document.querySelectorAll('.pattern-item');
        
        for (const item of patternItems) {
            const result = item.querySelector('.pattern-result').value.trim();
            const description = item.querySelector('.pattern-description').value.trim();
            const compatible = item.querySelector('.pattern-compatible').value.trim();
            const lucky_item = item.querySelector('.pattern-lucky').value.trim();
            
            if (result && description) {
                patterns.push({ result, description, compatible, lucky_item });
            }
        }

        if (patterns.length === 0) {
            alert('少なくとも1つの結果パターンを入力してください');
            return;
        }

        const diagnosis = {
            title,
            inputLabel,
            template,
            patterns
        };

        this.diagnosisManager.addDiagnosis(diagnosis);
        this.clearForm();
        this.displaySavedDiagnoses();
        alert('診断を保存しました！');
    }

    clearForm() {
        document.getElementById('diagnosis-title').value = '';
        document.getElementById('input-label').value = '';
        document.getElementById('result-template').value = '{name}さんは{result}タイプです！\n\n{description}\n\n相性の良い人: {compatible}\nラッキーアイテム: {lucky_item}';
        
        const container = document.getElementById('result-patterns');
        container.innerHTML = `
            <div class="pattern-item">
                <input type="text" class="pattern-result" placeholder="結果（例: 戦士）">
                <textarea class="pattern-description" rows="2" placeholder="説明（例: 勇敢で正義感が強い）"></textarea>
                <input type="text" class="pattern-compatible" placeholder="相性の良い人（例: 魔法使い）">
                <input type="text" class="pattern-lucky" placeholder="ラッキーアイテム（例: 剣）">
                <button class="remove-pattern" onclick="removePattern(this)">×</button>
            </div>
        `;
    }

    displaySavedDiagnoses() {
        const container = document.getElementById('saved-diagnoses');
        const diagnoses = this.diagnosisManager.diagnoses;

        if (diagnoses.length === 0) {
            container.innerHTML = '<p class="no-diagnoses">保存された診断がありません</p>';
            return;
        }

        container.innerHTML = diagnoses.map(diagnosis => `
            <div class="diagnosis-card" data-id="${diagnosis.id}">
                <h3>${diagnosis.title}</h3>
                <button class="btn-primary" onclick="playDiagnosis('${diagnosis.id}')">診断する</button>
                <button class="btn-danger" onclick="deleteDiagnosis('${diagnosis.id}')">削除</button>
            </div>
        `).join('');
    }

    playDiagnosis(diagnosisId) {
        const diagnosis = this.diagnosisManager.diagnoses.find(d => d.id === diagnosisId);
        if (!diagnosis) return;

        this.diagnosisManager.currentDiagnosis = diagnosis;
        
        document.getElementById('player-title').textContent = diagnosis.title;
        document.getElementById('player-input-label').textContent = diagnosis.inputLabel;
        document.getElementById('player-input').value = '';
        document.getElementById('diagnosis-player').style.display = 'block';
        document.getElementById('diagnosis-result').style.display = 'none';
        
        // スクロール
        document.getElementById('diagnosis-player').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('player-input').focus();
    }

    executeDiagnosis() {
        const input = document.getElementById('player-input').value.trim();
        if (!input) {
            alert('入力してください');
            return;
        }

        const result = this.diagnosisManager.executeDiagnosis(
            this.diagnosisManager.currentDiagnosis.id,
            input
        );

        if (result) {
            this.currentResult = result;
            document.getElementById('result-content').innerHTML = `<pre>${result.result}</pre>`;
            document.getElementById('diagnosis-result').style.display = 'block';
            
            // 結果にスクロール
            document.getElementById('diagnosis-result').scrollIntoView({ behavior: 'smooth' });
        }
    }

    retryDiagnosis() {
        document.getElementById('player-input').value = '';
        document.getElementById('diagnosis-result').style.display = 'none';
        document.getElementById('player-input').focus();
    }

    shareResult() {
        if (!this.currentResult) return;

        const text = `【${this.currentResult.title}】\n${this.currentResult.result}\n\n#診断メーカー`;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentResult.title,
                text: text
            }).catch(() => {
                this.copyToClipboard(text);
            });
        } else {
            this.copyToClipboard(text);
        }
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('結果をコピーしました！');
    }

    deleteDiagnosis(id) {
        if (confirm('この診断を削除しますか？')) {
            this.diagnosisManager.deleteDiagnosis(id);
            this.displaySavedDiagnoses();
        }
    }
}

// グローバル関数
function removePattern(button) {
    const patterns = document.querySelectorAll('.pattern-item');
    if (patterns.length > 1) {
        button.parentElement.remove();
    } else {
        alert('最低1つのパターンが必要です');
    }
}

function playDiagnosis(id) {
    uiManager.playDiagnosis(id);
}

function deleteDiagnosis(id) {
    uiManager.deleteDiagnosis(id);
}

// 初期化
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    const diagnosisManager = new DiagnosisManager();
    uiManager = new UIManager(diagnosisManager);
});