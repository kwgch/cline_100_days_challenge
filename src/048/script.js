const jokeBtn = document.getElementById('jokeBtn');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');

jokeBtn.addEventListener('click', generateJoke);

generateJoke();

async function generateJoke() {
    questionEl.innerText = "Loading...";
    answerEl.innerText = "";

    const config = {
        headers: {
            'Accept': 'application/json'
        }
    };

    const res = await fetch('https://icanhazdadjoke.com', config);
    const data = await res.json();

    const joke = data.joke;
    const [question, answer] = joke.split('?');

    questionEl.innerText = question + "?";
    answerEl.innerText = answer || "That's all!";
}
