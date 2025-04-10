const modeSwitch = document.getElementById('modeSwitch');
const registerMode = document.getElementById('registerMode');
const studyMode = document.getElementById('studyMode');
const wordForm = document.getElementById('wordForm');
const wordList = document.getElementById('wordList');
const question = document.getElementById('question');
const choices = document.getElementById('choices');
const result = document.getElementById('result');

let words = [];
let currentWord = null;
let mode = 'register'; // 'register' or 'study'
let editingId = null;

// Function to switch between modes
function switchMode() {
    if (mode === 'register') {
        mode = 'study';
        registerMode.style.display = 'none';
        studyMode.style.display = 'block';
        showQuestion();
    } else {
        mode = 'register';
        registerMode.style.display = 'block';
        studyMode.style.display = 'none';
    }
}

// Function to add a word
function addWord(word, meaning) {
    const id = Date.now().toString();
    const newWord = { id, word, meaning };
    words.push(newWord);
    updateWordList();
    saveWords();
}

// Function to update the word list
function updateWordList() {
    wordList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `${word.word} - ${word.meaning} <button data-id="${word.id}" class="edit">編集</button> <button data-id="${word.id}" class="delete">削除</button>`;
        wordList.appendChild(li);
    });
}

// Function to show a question
function showQuestion() {
    if (words.length === 0) {
        question.textContent = '単語を登録してください';
        choices.style.display = 'none';
        return;
    }
    choices.style.display = 'flex';
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    question.textContent = currentWord.word;

    // Generate random choices
    const choiceButtons = choices.querySelectorAll('.choice');
    const correctIndex = Math.floor(Math.random() * 4);
    let usedIndexes = [randomIndex];

    choiceButtons.forEach((button, index) => {
        if (index === correctIndex) {
            button.textContent = currentWord.meaning;
            button.dataset.correct = 'true';
        } else {
            let wrongIndex = Math.floor(Math.random() * words.length);
            while (usedIndexes.includes(wrongIndex)) {
                wrongIndex = Math.floor(Math.random() * words.length);
            }
            usedIndexes.push(wrongIndex);
            button.textContent = words[wrongIndex].meaning;
            button.dataset.correct = 'false';
        }
    });
}

// Function to check the answer
function checkAnswerFunc(e) {
    if (e.target.dataset.correct === 'true') {
        result.textContent = '正解！';
    } else {
        result.textContent = `不正解。正解は ${currentWord.meaning} です。`;
    }
    showQuestion();
}

// Function to save words to local storage
function saveWords() {
    localStorage.setItem('vocabApp_words', JSON.stringify(words));
}

// Function to load words from local storage
function loadWords() {
    const storedWords = localStorage.getItem('vocabApp_words');
    if (storedWords) {
        words = JSON.parse(storedWords);
    } else {
        // Load initial sample words
        words = [
            { id: "1", word: "apple", meaning: "りんご" },
            { id: "2", word: "book", meaning: "本" },
            { id: "3", word: "cat", meaning: "猫" },
            { id: "4", word: "dog", meaning: "犬" },
            { id: "5", word: "elephant", meaning: "象" },
            { id: "6", word: "flower", meaning: "花" },
            { id: "7", word: "garden", meaning: "庭" },
            { id: "8", word: "house", meaning: "家" },
            { id: "9", word: "internet", meaning: "インターネット" },
            { id: "10", word: "journey", meaning: "旅" }
        ];
        saveWords();
    }
    updateWordList();
}

// Event listeners
modeSwitch.addEventListener('click', switchMode);
wordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const word = document.getElementById('word').value.trim();
    const meaning = document.getElementById('meaning').value.trim();
    if (word && meaning) {
        if (editingId) {
            // Edit existing word
            words = words.map(w => {
                if (w.id === editingId) {
                    return { ...w, word, meaning };
                }
                return w;
            });
            editingId = null;
        } else {
            // Add new word
            addWord(word, meaning);
        }
        document.getElementById('word').value = '';
        document.getElementById('meaning').value = '';
        updateWordList();
        saveWords();
    }
});
choices.addEventListener('click', function (e) {
    if (e.target.classList.contains('choice')) {
        checkAnswerFunc(e);
    }
});
wordList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        const id = e.target.dataset.id;
        words = words.filter(word => word.id !== id);
        updateWordList();
        saveWords();
    } else if (e.target.classList.contains('edit')) {
        const id = e.target.dataset.id;
        editingId = id;
        const wordToEdit = words.find(word => word.id === id);
        if (wordToEdit) {
            document.getElementById('word').value = wordToEdit.word;
            document.getElementById('meaning').value = wordToEdit.meaning;
        }
    }
});

// Initialization
loadWords();
// Initially hide study mode
studyMode.style.display = 'none';
