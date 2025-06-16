class AntiViralPostGenerator {
    constructor() {
        this.platform = 'twitter';
        this.boringness = 5;
        this.postContent = '';
        
        this.templates = {
            twitter: {
                mundane: [
                    '今日も{day}ですね。',
                    '{weather}です。',
                    '{time}に{action}しました。',
                    '特に何もありません。',
                    '{food}を食べました。普通でした。',
                    '今日は{number}歩歩きました。',
                    '眠いです。',
                    '仕事してます。',
                    '家にいます。',
                    'テレビ見てます。'
                ],
                overshare: [
                    '朝{time}に起きて、歯を磨いて、顔を洗って、朝ごはんに{food}を食べて、{drink}を飲んで、着替えて、{transport}で{place}に行って、{action}して、昼ごはんに{food}を食べて、また{action}して、{time}に帰ってきて、夕飯に{food}を食べて、お風呂に入って、{time}に寝ました。',
                    '今日の体重は{weight}kgでした。昨日より{change}kg{direction}。朝食は{calories}kcal、昼食は{calories}kcal、夕食は{calories}kcal、間食は{calories}kcalでした。運動は{exercise}を{duration}分。歩数は{steps}歩。睡眠時間は{hours}時間{minutes}分。'
                ],
                technical: [
                    'エラーコード{errorCode}が出ました。解決しました。',
                    '{framework}をアップデートしました。特に変化なし。',
                    'コミットしました。',
                    'バグを直しました。詳細は省略。',
                    'サーバーの応答時間: {ms}ms'
                ]
            },
            instagram: {
                mundane: [
                    '朝ごはん\n.\n.\n.\n#朝ごはん #breakfast #food #instafood #朝 #morning #日常 #daily #ごはん #meal',
                    '空\n.\n.\n.\n#空 #sky #青空 #bluesky #今日の空 #todayssky #日常 #daily #風景 #view',
                    'コーヒー\n.\n.\n.\n#コーヒー #coffee #カフェ #cafe #日常 #daily #飲み物 #drink #休憩 #break'
                ]
            },
            facebook: {
                mundane: [
                    '今日は{day}です。皆さんはいかがお過ごしでしょうか。私は特に変わりなく過ごしています。{weather}ですね。それでは、また。',
                    '{place}にいます。\n\n特に理由はありません。',
                    '最近{hobby}をしています。\n\n特に上達していません。\n\n楽しくもありません。\n\nただやっているだけです。'
                ]
            },
            linkedin: {
                mundane: [
                    '本日も通常業務を遂行しております。\n\n特筆すべき成果はございません。\n\n#仕事 #業務 #日常',
                    'ミーティングに参加しました。\n\n議題：{topic}\n結論：保留\n\n#会議 #ビジネス',
                    'スキルアップのため、{skill}の勉強を始めました。\n\nまだ何も理解していません。\n\n#学習 #スキルアップ'
                ]
            }
        };
        
        this.fillers = {
            day: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'],
            weather: ['晴れ', '曇り', '雨', '晴れのち曇り', '曇りのち雨', '普通の天気'],
            time: ['6時', '7時', '8時', '9時', '10時', '11時', '12時', '13時', '14時', '15時', '16時', '17時', '18時', '19時', '20時', '21時', '22時'],
            action: ['仕事', '勉強', '掃除', '洗濯', '買い物', '散歩', '休憩', '何もしない'],
            food: ['パン', 'ご飯', 'パスタ', 'うどん', 'そば', 'ラーメン', 'サンドイッチ', '弁当', 'おにぎり'],
            drink: ['水', 'お茶', 'コーヒー', '牛乳', 'ジュース'],
            transport: ['徒歩', '自転車', '電車', 'バス', '車'],
            place: ['会社', '学校', 'スーパー', 'コンビニ', '駅', '家', '近所'],
            number: () => Math.floor(Math.random() * 5000) + 1000,
            weight: () => (Math.random() * 30 + 50).toFixed(1),
            change: () => (Math.random() * 2 - 1).toFixed(1),
            direction: () => Math.random() > 0.5 ? '増えました' : '減りました',
            calories: () => Math.floor(Math.random() * 500) + 300,
            exercise: ['ウォーキング', 'ジョギング', 'ストレッチ', '筋トレ', 'ヨガ'],
            duration: () => Math.floor(Math.random() * 30) + 10,
            steps: () => Math.floor(Math.random() * 5000) + 3000,
            hours: () => Math.floor(Math.random() * 4) + 5,
            minutes: () => Math.floor(Math.random() * 60),
            errorCode: () => Math.floor(Math.random() * 900) + 100,
            framework: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Rails'],
            ms: () => Math.floor(Math.random() * 1000) + 100,
            hobby: ['読書', 'ゲーム', '映画鑑賞', '音楽鑑賞', '料理', '園芸', '手芸'],
            topic: ['予算', '計画', 'スケジュール', '方針', '戦略', '目標', '進捗'],
            skill: ['Excel', 'PowerPoint', 'Python', 'マーケティング', '会計', '英語', 'プレゼンテーション']
        };
        
        this.boringTips = [
            '具体性を避ける',
            '感情を込めない',
            'ハッシュタグを使いすぎる',
            '誰も興味がない個人的な詳細を延々と書く',
            '結論のない話をする',
            '専門用語を説明なしで使う',
            '天気の話をする',
            '「特に何もない」と書く',
            '同じような投稿を繰り返す',
            '写真は必ずピンボケにする'
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generatePost();
        this.showTips();
    }
    
    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePost());
        document.getElementById('regenerateBtn').addEventListener('click', () => this.generatePost());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyPost());
        
        document.getElementById('platform').addEventListener('change', (e) => {
            this.platform = e.target.value;
            this.generatePost();
        });
        
        document.getElementById('boringness').addEventListener('input', (e) => {
            this.boringness = parseInt(e.target.value);
            document.getElementById('boringnessValue').textContent = e.target.value;
        });
    }
    
    generatePost() {
        const templates = this.templates[this.platform];
        let category;
        
        // 退屈度に応じてカテゴリを選択
        if (this.boringness <= 3) {
            category = 'mundane';
        } else if (this.boringness <= 7) {
            category = 'overshare';
        } else {
            category = 'technical';
        }
        
        // プラットフォームによってはカテゴリが限定される
        if (!templates[category]) {
            category = 'mundane';
        }
        
        const template = templates[category][Math.floor(Math.random() * templates[category].length)];
        this.postContent = this.fillTemplate(template);
        
        // 退屈度が高いほど無駄な要素を追加
        if (this.boringness > 5) {
            this.postContent = this.addBoringElements(this.postContent);
        }
        
        this.displayPost();
        this.updateStats();
    }
    
    fillTemplate(template) {
        return template.replace(/{(\w+)}/g, (match, key) => {
            const filler = this.fillers[key];
            if (typeof filler === 'function') {
                return filler();
            } else if (Array.isArray(filler)) {
                return filler[Math.floor(Math.random() * filler.length)];
            }
            return match;
        });
    }
    
    addBoringElements(content) {
        const boringAdditions = [
            '\n\n追記：特にありません。',
            '\n\n※この投稿に意味はありません',
            '\n\nP.S. 読んでくれてありがとう（誰も読んでないと思うけど）',
            '\n\n以上です。',
            '\n\n...。',
            '\n\n編集：誤字を修正しました。',
            '\n\n補足：特に補足することはありません。'
        ];
        
        if (Math.random() > 0.5) {
            content += boringAdditions[Math.floor(Math.random() * boringAdditions.length)];
        }
        
        // 絵文字の過剰使用
        if (this.boringness > 7 && this.platform === 'twitter') {
            const boringEmojis = ['😐', '😑', '😶', '🙃', '😪', '😴', '🥱'];
            content += ' ' + boringEmojis[Math.floor(Math.random() * boringEmojis.length)];
        }
        
        return content;
    }
    
    displayPost() {
        const postElement = document.getElementById('postContent');
        postElement.textContent = this.postContent;
        
        // プラットフォームに応じたスタイル調整
        postElement.className = `post-content ${this.platform}`;
    }
    
    updateStats() {
        // 退屈度に反比例する架空のエンゲージメント数
        const baseLikes = Math.max(0, Math.floor((10 - this.boringness) * Math.random() * 2));
        const baseComments = Math.max(0, Math.floor((10 - this.boringness) * Math.random() * 0.5));
        const baseShares = Math.max(0, Math.floor((10 - this.boringness) * Math.random() * 0.1));
        
        document.getElementById('likeCount').textContent = baseLikes;
        document.getElementById('commentCount').textContent = baseComments;
        document.getElementById('shareCount').textContent = baseShares;
    }
    
    copyPost() {
        navigator.clipboard.writeText(this.postContent).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ コピーしました';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            alert('コピーに失敗しました');
        });
    }
    
    showTips() {
        const tipsList = document.getElementById('tipsList');
        tipsList.innerHTML = '';
        
        // ランダムに3つのコツを表示
        const shuffled = [...this.boringTips].sort(() => Math.random() - 0.5);
        shuffled.slice(0, 3).forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new AntiViralPostGenerator();
});