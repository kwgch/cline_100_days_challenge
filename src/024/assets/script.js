// GameManager module
const GameManager = (function() {
  // Private variables and functions

  let questions;
  let currentQuestionIndex = 0;
  
  // Public API
  return {
    init: function() {
      console.log('GameManager initialized');
      questions = DataLoader.loadData();
      console.log('Game data:', questions);
      this.loadQuestion(currentQuestionIndex);
    },
    loadQuestion: function(index) {
      const questionData = DataLoader.getQuestion(index);
      UIRenderer.renderQuestion(questionData.question);
      UIRenderer.renderCharacters(questionData.characters);
      UIRenderer.renderChoices(questionData.characters);
      UIRenderer.renderHintButtons(questionData.hints);
      InputHandler.registerHintButtonEvents(questions, currentQuestionIndex);
      InputHandler.registerChoiceButtonEvents(questions, currentQuestionIndex);
    },
    startNewRound: function() {
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      UIRenderer.clearResult();
      UIRenderer.clearHint();
      this.loadQuestion(currentQuestionIndex);
    },
    startGame: function() {
      console.log('Game started');
    }
  };
})();

// DataLoader module
const DataLoader = (function() {
  // Private variables and functions

  const questions = [
    {
      question: "誰が一番高くジャンプできる？",
      characters: [
        {
          name: "A",
          display: "🐱",
          attributes: { age: 8, color: "赤", height: 120, jump: 60 }
        },
        {
          name: "B",
          display: "🐶",
          attributes: { age: 12, color: "青", height: 140, jump: 80 }
        },
        {
          name: "C",
          display: "🐰",
          attributes: { age: 10, color: "黄", height: 130, jump: 70 }
        }
      ],
      answerKey: "jump",
      hints: ["age", "color", "height"]
    },
    {
      question: "誰が一番早く走れる？",
      characters: [
        {
          name: "A",
          display: "🐘",
          attributes: { age: 15, color: "灰", height: 250, speed: 40 }
        },
        {
          name: "B",
          display: "🐎",
          attributes: { age: 7, color: "茶", height: 160, speed: 88 }
        },
        {
          name: "C",
          display: "🐢",
          attributes: { age: 80, color: "緑", height: 30, speed: 2 }
        }
      ],
      answerKey: "speed",
      hints: ["age", "color", "height"]
    },
    {
      question: "誰が一番大きな声で鳴ける？",
      characters: [
        {
          name: "A",
          display: "🦁",
          attributes: { age: 6, color: "黄", height: 120, voice: 114 }
        },
        {
          name: "B",
          display: "🐔",
          attributes: { age: 2, color: "白", height: 40, voice: 90 }
        },
        {
          name: "C",
          display: "🐸",
          attributes: { age: 1, color: "緑", height: 10, voice: 80 }
        }
      ],
      answerKey: "voice",
      hints: ["age", "color", "height"]
    },
    {
      question: "誰が一番長生きできそう？",
      characters: [
        {
          name: "A",
          display: "🐭",
          attributes: { age: 1, color: "灰", height: 8, life: 3 }
        },
        {
          name: "B",
          display: "🐢",
          attributes: { age: 10, color: "緑", height: 30, life: 80 }
        },
        {
          name: "C",
          display: "🐶",
          attributes: { age: 4, color: "茶", height: 40, life: 15 }
        }
      ],
      answerKey: "life",
      hints: ["age", "color", "height"]
    },
    {
      question: "誰が一番背が高い？",
      characters: [
        {
          name: "A",
          display: "🦒",
          attributes: { age: 5, color: "黄", height: 500 }
        },
        {
          name: "B",
          display: "🐘",
        attributes: { age: 12, color: "灰", height: 250 }
        },
        {
          name: "C",
          display: "🦏",
          attributes: { age: 8, color: "灰", height: 170 }
        }
      ],
      answerKey: "height",
      hints: ["age", "color", "height"]
    }
  ];
  
  // Public API
  return {
    loadData: function() {
      console.log('Data loaded');
      return questions;
    },
    getQuestion: function(index) {
      return questions[index];
    }
  };
})();

// UIRenderer module
const UIRenderer = (function() {
  // Private variables and functions
  
  // Public API
  return {
    renderQuestion: function(question) {
      const questionElement = document.getElementById('question');
      questionElement.textContent = question;
      console.log('Question rendered');
    },
    renderCharacters: function(characters) {
      const characterGrid = document.getElementById('characters');
      characterGrid.innerHTML = ''; // Clear existing characters

      characters.forEach(character => {
        const characterElement = document.createElement('div');
        characterElement.classList.add('character');
        characterElement.textContent = character.display + ' ' + character.name;

        const hintElement = document.createElement('div');
        hintElement.classList.add('hint');
        characterElement.appendChild(hintElement);

        characterGrid.appendChild(characterElement);
      });
      console.log('Characters rendered');
    },
    renderChoices: function(characters) {
      const choiceButtons = document.getElementById('choices');
      choiceButtons.innerHTML = ''; // Clear existing choices

      const choiceLabel = document.createElement('div');
      choiceLabel.textContent = '回答';
      choiceButtons.appendChild(choiceLabel);

      characters.forEach(character => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = character.name;
        choiceButtons.appendChild(choiceButton);
      });
      console.log('Choices rendered');
    },
    renderHintButtons: function(hints) {
      const hintButtons = document.querySelector('.hint-buttons');
      hintButtons.innerHTML = '';

      const hintLabel = document.createElement('div');
      hintLabel.textContent = 'ヒント';
      hintButtons.appendChild(hintLabel);

      hints.forEach(hint => {
        const hintButton = document.createElement('button');
        hintButton.textContent = hint;
        hintButton.dataset.hintType = hint;
        hintButtons.appendChild(hintButton);
      });
    console.log('Hint buttons rendered');
    },
    renderHint: function(hint) {
      const hintElement = document.getElementById('hint');
      hintElement.textContent = hint;
      console.log('Hint rendered:', hint);
    },
    renderChoices: function(characters) {

      const hintLabel = document.createElement('div');
      hintLabel.textContent = 'ヒント';
      hintContainer.appendChild(hintLabel);

      hints.forEach(hint => {
        const hintButton = document.createElement('button');
        hintButton.textContent = hint;
        hintButton.dataset.hintType = hint;
        hintContainer.appendChild(hintButton);
      });
      hintButtons.appendChild(hintContainer);
    console.log('Hint buttons rendered');
    },
    renderChoices: function(characters) {
      const choiceButtons = document.getElementById('choices');
      choiceButtons.innerHTML = ''; // Clear existing choices

      const choiceContainer = document.createElement('div');
      choiceContainer.classList.add('choice-container');

      const choiceLabel = document.createElement('div');
      choiceLabel.textContent = '回答';
      choiceContainer.appendChild(choiceLabel);

      characters.forEach(character => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = character.name;
        choiceContainer.appendChild(choiceButton);
      });
      choiceButtons.appendChild(choiceContainer);
      console.log('Choices rendered');
    },
    renderResult: function(message, questions, currentQuestionIndex) {
      const resultElement = document.getElementById('result');
      resultElement.innerHTML = message;
      console.log('Result rendered:', message);
			setTimeout(function() {
				const nextButton = document.getElementById('nextButton');
				if (nextButton) {
					nextButton.addEventListener('click', function() {
						GameManager.startNewRound();
					});
				}
			}, 0);
    },
    clearResult: function() {
      const resultElement = document.getElementById('result');
      resultElement.innerHTML = '';
    },
    clearHint: function() {
      const hintElement = document.getElementById('hint');
      hintElement.textContent = '';
    }
  };
})();

// InputHandler module
const InputHandler = (function() {
  // Private variables and functions

  const handleHintClick = function(questions, currentQuestionIndex, event) {
    const hintType = event.target.dataset.hintType;
    console.log('Hint clicked:', hintType);
    const questionData = questions[currentQuestionIndex];
    // Assuming all characters have the same attributes for hints
    // Display the hint in the result div
    let hintMessage = '';
    questionData.characters.forEach(character => {
      const hintType = event.target.dataset.hintType;
      const hintValue = character.attributes[hintType];
      hintMessage += '' + character.name + ': ' + hintValue + '\n';
    });
    UIRenderer.renderHint(hintMessage);
  };

  const handleChoiceClick = function(questions, currentQuestionIndex, event) {
    console.log('handleChoiceClick called');
    const selectedCharacterName = event.target.textContent;
    console.log('Choice clicked:', selectedCharacterName);
    const questionData = questions[currentQuestionIndex];
    const correctAnswerKey = questionData.answerKey;
    let isCorrect = false;
    let selectedCharacter;
    let correctValue;
    questionData.characters.forEach(character => {
      if (character.name === selectedCharacterName) {
        selectedCharacter = character;
        correctValue = questionData.characters.reduce((max, char) => (char.attributes[correctAnswerKey] > max.attributes[correctAnswerKey] ? char : max), questionData.characters[0]).attributes[correctAnswerKey];
        isCorrect = (character.attributes[correctAnswerKey] === correctValue);
      }
    });

    let resultMessage = isCorrect ? 'Correct!' : 'Incorrect! ';
		
		let correctAnswerName = questionData.characters.reduce((max, char) => char.attributes[correctAnswerKey] > max.attributes[correctAnswerKey] ? char : max).name;
		resultMessage += 'The correct answer was ' + correctAnswerName + '.<br>';
		resultMessage += '<button id="nextButton">Next</button>';
    UIRenderer.renderResult(resultMessage, questions, currentQuestionIndex);
  };
  
  // Public API
  return {
    registerHintButtonEvents: function(questions, currentQuestionIndex) {
      const hintButtons = document.querySelectorAll('.hint-buttons button');
      hintButtons.forEach(button => {
        button.addEventListener('click', function(event) {
          handleHintClick(questions, currentQuestionIndex, event);
        });
      });
    },
    registerChoiceButtonEvents: function(questions, currentQuestionIndex) {
      const choiceButtons = document.querySelectorAll('.choice-buttons button');
      choiceButtons.forEach(button => {
        button.addEventListener('click', (function(questions, currentQuestionIndex) {
          return function handleChoice(event) {
            const selectedCharacterName = event.target.textContent;
            console.log('Choice clicked:', selectedCharacterName);
            const questionData = questions[currentQuestionIndex];
            const correctAnswerKey = questionData.answerKey;
            let isCorrect = false;
            let selectedCharacter;
            let correctValue;
            questionData.characters.forEach(character => {
              if (character.name === selectedCharacterName) {
                selectedCharacter = character;
                correctValue = questionData.characters.reduce((max, char) => (char.attributes[correctAnswerKey] > max.attributes[correctAnswerKey] ? char : max), questionData.characters[0]).attributes[correctAnswerKey];
                isCorrect = (character.attributes[correctAnswerKey] === correctValue);
              }
            });

            let resultMessage = isCorrect ? '正解!' : '不正解!';
		
		let correctAnswerName = questionData.characters.reduce((max, char) => char.attributes[correctAnswerKey] > max.attributes[correctAnswerKey] ? char : max).name;
		resultMessage += '正解は' + correctAnswerName + 'でした。<br>';
		resultMessage += '<button id="nextButton">Next</button>';
            UIRenderer.renderResult(resultMessage, questions, currentQuestionIndex);
          };
        })(questions, currentQuestionIndex));
      });
    }
  };
})();

// FeedbackSystem module
const FeedbackSystem = (function() {
  // Private variables and functions
  
  // Public API
  return {
    showResult: function() {
      console.log('Result shown');
    }
  };
})();

// Initialize the game
GameManager.init();
