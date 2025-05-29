document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('output');
    let currentOutput = '';
    const maxLines = 50; // 画面に表示する最大行数

    const instructions = ['MOV', 'ADD', 'SUB', 'JMP', 'CALL', 'PUSH', 'POP', 'XOR', 'AND', 'OR', 'NOP', 'RET'];
    const registers = ['EAX', 'EBX', 'ECX', 'EDX', 'EBP', 'ESP', 'ESI', 'EDI', 'R8D', 'R9D'];

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateOperand() {
        const type = Math.random();
        if (type < 0.4) { // レジスタ
            return getRandomElement(registers);
        } else if (type < 0.7) { // 16進数または10進数
            return '0x' + Math.floor(Math.random() * 65536).toString(16).toUpperCase();
        } else { // メモリ参照
            const base = getRandomElement(registers);
            const offset = Math.floor(Math.random() * 100) * 4; // 4の倍数
            return `[${base}${offset > 0 ? (Math.random() < 0.5 ? '+' : '-') + offset : ''}]`;
        }
    }

    function generateUnintelligibleCode() {
        const instruction = getRandomElement(instructions);
        let code = instruction;

        // 命令に応じてオペランドを生成
        if (instruction === 'JMP' || instruction === 'CALL') {
            code += ' ' + generateOperand();
        } else if (instruction === 'PUSH' || instruction === 'POP' || instruction === 'RET' || instruction === 'NOP') {
            // オペランドなし、または単一オペランド
            if (Math.random() < 0.5 && instruction !== 'NOP' && instruction !== 'RET') { // NOPとRETはオペランドなしが多い
                code += ' ' + generateOperand();
            }
        } else { // 2つのオペランド
            code += ' ' + generateOperand() + ', ' + generateOperand();
        }

        // コメントを追加する可能性
        if (Math.random() < 0.2) {
            code += ' ; ' + Math.random().toString(36).substring(2, 10).toUpperCase();
        }

        return code;
    }

    function updateOutput() {
        const newCode = generateUnintelligibleCode();
        const lines = currentOutput.split('\n');

        // 最大行数を超えたら古い行を削除
        if (lines.length >= maxLines) {
            lines.shift();
        }

        lines.push(newCode);
        currentOutput = lines.join('\n');
        outputElement.textContent = currentOutput;

        // スクロールを一番下にする
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    // 100ミリ秒ごとに更新
    setInterval(updateOutput, 100);
});
