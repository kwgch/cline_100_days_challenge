// ランダムな記事データ
const randomArticles = [
    {
        title: "時空間トースト焼き機",
        infoBox: {
            classification: "超次元調理器具",
            proposer: "アルバート・パンシュタイン",
            year: "2089年",
            concept: "4次元空間でのパン焼き"
        },
        content: `
            <p><strong>時空間トースト焼き機</strong>（じくうかんトーストやきき、英: Spacetime Toaster）は、<a href="#">2089年</a>に物理学者<a href="#">アルバート・パンシュタイン</a>によって開発された、時間軸を操作してパンを焼く革新的な調理器具である。</p>
            
            <h2>原理</h2>
            <p>この装置は、<a href="#">アインシュタイン・ローゼン橋</a>を応用し、パンを過去に送って既に焼けた状態で現在に戻すことで、瞬時にトーストを作ることができる。しかし、<a href="#">祖父のパンのパラドックス</a>により、元のパンが小麦になってしまう事例が報告されている。</p>
            
            <h2>利用上の注意</h2>
            <ul>
                <li>タイムループに巻き込まれた場合、永遠に朝食を食べ続ける可能性がある</li>
                <li>並行宇宙のトーストと入れ替わることがある</li>
                <li>バターを塗るタイミングを間違えると因果律が崩壊する</li>
            </ul>
        `
    },
    {
        title: "透明インク症候群",
        infoBox: {
            classification: "架空の医学的症状",
            proposer: "ジョン・インビジブル医師",
            year: "2077年",
            concept: "文字が見えなくなる奇病"
        },
        content: `
            <p><strong>透明インク症候群</strong>（とうめいインクしょうこうぐん、英: Invisible Ink Syndrome）は、<a href="#">2077年</a>に<a href="#">ニューヨーク透明病院</a>の<a href="#">ジョン・インビジブル医師</a>によって報告された、書いた文字が徐々に透明になっていく珍しい症状である。</p>
            
            <h2>症状</h2>
            <p>患者が書いた文字は、最初は通常通り見えるが、約30分後から徐々に薄くなり始め、2時間後には完全に透明になる。興味深いことに、<a href="#">紫外線ライト</a>を当てても見えないが、<a href="#">思念波検出器</a>では読み取ることができる。</p>
            
            <h2>原因</h2>
            <p>研究によると、患者の<a href="#">量子的署名</a>が不安定になることで、インクの分子が<a href="#">位相シフト</a>を起こすことが原因とされている。特に<a href="#">月曜日</a>に症状が悪化する傾向がある。</p>
            
            <h2>治療法</h2>
            <p>現在のところ、<a href="#">逆さま文字療法</a>や<a href="#">鏡面書記訓練</a>が有効とされているが、完治した例は報告されていない。</p>
        `
    },
    {
        title: "逆重力ペンギン",
        infoBox: {
            classification: "架空の生物種",
            proposer: "南極異常生物研究所",
            year: "2156年",
            concept: "重力に逆らって生活する鳥類"
        },
        content: `
            <p><strong>逆重力ペンギン</strong>（ぎゃくじゅうりょくペンギン、学名: <em>Spheniscus antigravitas</em>）は、<a href="#">2156年</a>に<a href="#">南極大陸</a>の地下空洞で発見されたとされる、重力に逆らって生活する架空のペンギンの一種である。</p>
            
            <h2>特徴</h2>
            <p>通常のペンギンとは異なり、この種は足を上にして逆さまに歩くことができる。氷の天井に巣を作り、魚を下から上に向かって狩りをする。翼は<a href="#">反重力フィールド</a>を生成する特殊な器官に進化している。</p>
            
            <h2>生態</h2>
            <ul>
                <li>主食は<a href="#">浮遊イワシ</a>と<a href="#">天井コオリウオ</a></li>
                <li>求愛行動では、オスがメスの下（実際は上）で逆立ちダンスを行う</li>
                <li>卵は重力井戸の中で孵化させる</li>
            </ul>
            
            <h2>保護活動</h2>
            <p><a href="#">国際逆重力生物保護協会</a>により、絶滅危惧種に指定されている。主な脅威は<a href="#">重力嵐</a>と<a href="#">磁場反転</a>である。</p>
        `
    },
    {
        title: "感情色彩変換装置",
        infoBox: {
            classification: "心理工学デバイス",
            proposer: "エモーション・カラー研究所",
            year: "2234年",
            concept: "感情を色彩に変換する技術"
        },
        content: `
            <p><strong>感情色彩変換装置</strong>（かんじょうしきさいへんかんそうち、英: Emotion-Color Converter）は、人間の感情を可視化された色彩パターンに変換する装置である。<a href="#">2234年</a>に<a href="#">エモーション・カラー研究所</a>で開発された。</p>
            
            <h2>動作原理</h2>
            <p>装置は<a href="#">脳波共鳴スキャナー</a>と<a href="#">感情スペクトル分析器</a>を組み合わせ、感情の微細な変化を<a href="#">RGB値</a>に変換する。喜びは黄色、悲しみは青、怒りは赤といった基本的な対応に加え、複雑な感情は<a href="#">グラデーション</a>や<a href="#">モザイクパターン</a>として表現される。</p>
            
            <h2>応用分野</h2>
            <ul>
                <li><strong>感情天気予報</strong> - 都市全体の感情状態を色彩マップで表示</li>
                <li><strong>ムードペイント</strong> - 感情に応じて自動的に色が変わる壁紙</li>
                <li><strong>嘘発見オーラ</strong> - 虚偽の感情を紫色の輪で表示</li>
            </ul>
            
            <h2>副作用</h2>
            <p>長時間の使用により、<a href="#">色彩感情症候群</a>を発症し、実際の色を見ても感情が誘発される場合がある。また、<a href="#">感情の著作権</a>に関する法的問題も議論されている。</p>
        `
    },
    {
        title: "円周率料理法",
        infoBox: {
            classification: "数学的調理技術",
            proposer: "π・クッキング協会",
            year: "2198年",
            concept: "円周率の数列に基づく調理"
        },
        content: `
            <p><strong>円周率料理法</strong>（えんしゅうりつりょうりほう、英: Pi Cooking Method）は、<a href="#">円周率</a>の数列（3.14159...）に基づいて料理の材料、調理時間、温度を決定する調理法である。</p>
            
            <h2>基本原理</h2>
            <p>円周率の各桁が以下のように対応する：</p>
            <ul>
                <li>3 - 主要材料を3種類使用</li>
                <li>1 - 調味料を1つまみ</li>
                <li>4 - 4分間加熱</li>
                <li>1 - 1回かき混ぜる</li>
                <li>5 - 5度の角度で切る</li>
                <li>9 - 9秒間休ませる</li>
            </ul>
            
            <h2>代表的な料理</h2>
            <p><strong>πパイ</strong>は最も有名な円周率料理で、生地の厚さを3.14mm、直径を159mm、焼き時間を26分53秒（円周率の次の桁）に設定する。味は<a href="#">無理数的</a>で、食べ終わることがないと言われている。</p>
            
            <h2>批判</h2>
            <p>この調理法は<a href="#">料理の収束性</a>に問題があり、無限に調理工程が続く可能性がある。また、<a href="#">有理数派</a>の料理人からは「割り切れない味」として批判されている。</p>
        `
    }
];

// 現在の記事インデックス
let currentArticleIndex = 0;

// ランダムな記事を生成
function generateRandomArticle() {
    // ランダムに記事を選択
    currentArticleIndex = Math.floor(Math.random() * randomArticles.length);
    const article = randomArticles[currentArticleIndex];
    
    // タイトルを更新
    document.getElementById('article-title').textContent = article.title;
    
    // 情報ボックスを更新
    document.getElementById('info-classification').textContent = article.infoBox.classification;
    document.getElementById('info-proposer').textContent = article.infoBox.proposer;
    document.getElementById('info-year').textContent = article.infoBox.year;
    document.getElementById('info-concept').textContent = article.infoBox.concept;
    
    // 記事内容を更新
    document.getElementById('article-content').innerHTML = article.content + `
        <div class="categories">
            <p>カテゴリ: <a href="#">架空の科学</a> | <a href="#">ナンセンス百科</a> | <a href="#">${article.infoBox.year.replace('年', '')}年の発明</a></p>
        </div>
    `;
    
    // ページトップにスクロール
    window.scrollTo(0, 0);
}

// リンククリックイベントの処理
document.addEventListener('DOMContentLoaded', function() {
    // すべての記事内リンクにイベントリスナーを追加
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
            e.preventDefault();
            // ランダムに新しい記事を表示するか、アラートを表示
            if (Math.random() > 0.5) {
                generateRandomArticle();
            } else {
                alert('この記事はまだ作成されていません。\n\n「存在しない記事は存在するが、存在しないため表示できない」\n- ウィキペディア偽の哲学より');
            }
        }
    });
    
    // 検索ボックスの処理
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchBox.value.trim();
        if (searchTerm) {
            alert(`「${searchTerm}」の検索結果：\n\n0件の記事が見つかりました。\n\nヒント: 探している記事は別の次元に存在する可能性があります。`);
            searchBox.value = '';
        }
    });
    
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // 編集リンクの処理
    const editLink = document.querySelector('.nav-tabs a[href="#"]:nth-child(3)');
    if (editLink) {
        editLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('編集権限がありません。\n\n理由: あなたの存在が量子的に不確定なため、編集内容も不確定になってしまいます。');
        });
    }
});

// タッチイベントでの画面移動を防止
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });