(function() {
    const firstNames = ['太郎', '花子', '一郎', '二郎', '三郎', 'さくら', '桃子', '梅子', '松子', '竹子', '健太', '翔太', '優斗', '蓮', '大輝', '美咲', '愛', '優香', '莉子', '結衣'];
    const lastNames = ['田中', '山田', '佐藤', '鈴木', '高橋', '伊藤', '渡辺', '加藤', '中村', '小林', '斉藤', '吉田', '山口', '松本', '井上', '木村', '林', '清水', '山崎', '阿部'];
    const domains = ['example.com'];

    function romanize(name) {
        const map = {
            'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
            'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
            'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
            'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
            'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
            'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
            'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
            'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
            'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
            'わ': 'wa', 'を': 'wo', 'ん': 'n',
            'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
            'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
            'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
            'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
            'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
            'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
            'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
            'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
            'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
            'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
            'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
            'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
            'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
            'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
            'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
            'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
            'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
            'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
            'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
            'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
            'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
            'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
            'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
            'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
            'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
            'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
            'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
            'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
            'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
            'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
            'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
            'う': 'u', 'くう': 'kuu', 'おう': 'ou', 'こう': 'kou', 'そう': 'sou', 'とう': 'tou',
            'のう': 'nou', 'ほう': 'hou', 'もう': 'mou', 'よう': 'you', 'ろう': 'rou',
            'しょう': 'shou', 'じょう': 'jou', 'ちょう': 'chou',
            '太郎': 'taro', '花子': 'hanako', '一郎': 'ichiro', '二郎': 'jiro', '三郎': 'saburo',
            'さくら': 'sakura', '桃子': 'momoko', '梅子': 'umeko', '松子': 'matsuko', '竹子': 'takeko',
            '健太': 'kenta', '翔太': 'shota', '優斗': 'yuto', '蓮': 'ren', '大輝': 'daiki',
            '美咲': 'misaki', '愛': 'ai', '優香': 'yuka', '莉子': 'riko', '結衣': 'yui',
            '田中': 'tanaka', '山田': 'yamada', '佐藤': 'sato', '鈴木': 'suzuki', '高橋': 'takahashi',
            '伊藤': 'ito', '渡辺': 'watanabe', '加藤': 'kato', '中村': 'nakamura', '小林': 'kobayashi',
            '斉藤': 'saito', '吉田': 'yoshida', '山口': 'yamaguchi', '松本': 'matsumoto', '井上': 'inoue',
            '木村': 'kimura', '林': 'hayashi', '清水': 'shimizu', '山崎': 'yamazaki', '阿部': 'abe',
            '渡邊': 'watanabe', '齋藤': 'saito', '髙橋': 'takahashi'
        };
        let result = '';
        let i = 0;
        while (i < name.length) {
            let found = false;
            for (let j = Math.min(3, name.length - i); j > 0; j--) {
                const chunk = name.substring(i, i + j);
                if (map[chunk]) {
                    result += map[chunk];
                    i += j;
                    found = true;
                    break;
                }
            }
            if (!found) {
                result += name[i];
                i++;
            }
        }
        return result;
    }

    function generatePerson(id) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18;
        const gender = Math.random() < 0.5 ? '男性' : '女性';
        const phone = generatePhoneNumber();
        const randomNum = Math.floor(Math.random() * 1000);
        const email = `${romanize(firstName)}${romanize(lastName)}${randomNum}@${domains[Math.floor(Math.random() * domains.length)]}`;

        return {
            id: id,
            name: `${lastName} ${firstName}`,
            age: age,
            gender: gender,
            phone: phone,
            email: email
        };
    }

    function generatePhoneNumber() {
        const areaCode = ['03', '044', '045', '047', '052', '06', '072', '075', '078', '092'];
        const prefix = Math.floor(Math.random() * 900) + 100; // 100-999
        const suffix = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        return `${areaCode[Math.floor(Math.random() * areaCode.length)]}-${prefix}-${suffix}`;
    }

    // Expose the generatePerson function to the global scope
    window.generator = {
        generatePerson: generatePerson
    };
})();
