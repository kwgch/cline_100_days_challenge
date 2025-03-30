document.addEventListener('DOMContentLoaded', function() {
    // 状態変数
    let displayValue = '0';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;
    
    // 表示要素
    const display = document.getElementById('result');
    
    // 表示を更新する関数
    function updateDisplay() {
        display.textContent = displayValue;
    }
    
    // 数字ボタンのイベントハンドラ
    function inputDigit(digit) {
        if (waitingForSecondOperand === true) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }
    
    // 小数点ボタンのイベントハンドラ
    function inputDecimal() {
        if (waitingForSecondOperand) {
            displayValue = '0.';
            waitingForSecondOperand = false;
            return;
        }
        
        if (!displayValue.includes('.')) {
            displayValue += '.';
        }
    }
    
    // 演算子ボタンのイベントハンドラ
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);
        
        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }
        
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation();
            displayValue = String(result);
            firstOperand = result;
        }
        
        waitingForSecondOperand = true;
        operator = nextOperator;
    }
    
    // 計算実行関数
    function performCalculation() {
        const secondOperand = parseFloat(displayValue);
        
        if (operator === '+') {
            return firstOperand + secondOperand;
        } else if (operator === '-') {
            return firstOperand - secondOperand;
        } else if (operator === '*') {
            return firstOperand * secondOperand;
        } else if (operator === '/') {
            return firstOperand / secondOperand;
        }
        
        return secondOperand;
    }
    
    // リセット関数
    function resetCalculator() {
        displayValue = '0';
        firstOperand = null;
        waitingForSecondOperand = false;
        operator = null;
    }
    
    // イベントリスナーの設定
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            inputDigit(button.textContent);
            updateDisplay();
        });
    });
    
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            handleOperator(button.textContent);
            updateDisplay();
        });
    });
    
    document.getElementById('equals').addEventListener('click', () => {
        if (!operator) return;
        
        displayValue = String(performCalculation());
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
        updateDisplay();
    });
    
    document.getElementById('decimal').addEventListener('click', () => {
        inputDecimal();
        updateDisplay();
    });
    
    document.getElementById('clear').addEventListener('click', () => {
        resetCalculator();
        updateDisplay();
    });
    
    // 初期表示
    updateDisplay();
});
