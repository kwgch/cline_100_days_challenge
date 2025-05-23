const fs = require('fs');

const args = process.argv.slice(2);
const numChallenges = args.length > 0 ? parseInt(args[0]) : null;

fs.readFile('list.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let challengeList = data.split('\r\n');
  if (numChallenges !== null && !isNaN(numChallenges) && numChallenges >= 0 && numChallenges <= 100) {
    challengeList = challengeList.slice(0, numChallenges);
  }

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>100-Day Programming Challenge with Cline</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>100-Day Programming Challenge with Cline</h1>
        <p>This repository documents my journey through a 100-day programming challenge using Cline, a VSCode extension designed to assist developers with AI-powered coding support. The AI model used in this challenge is Google Gemini-2.0-Flash-001.</p>
    </header>

    <main>
        <section id="challenges">
            <h2>Challenges</h2>
            <div class="challenge-grid">`;

  for (let i = 0; i < challengeList.length; i++) {
    const challengeNumber = String(i + 1).padStart(3, '0');
    html += `
                <a href="src/${challengeNumber}/index.html" class="challenge-card">
                    <h3>${challengeNumber}</h3>
                    <p>${challengeList[i]}</p>
                </a>`;
  }

  html += `
            </div>
        </section>

        <section id="goals">
            <h2>Goals</h2>
            <ul>
                <li><strong>Master AI Coding Agents</strong>: Learn how to effectively use AI tools for coding and boost development efficiency.</li>
                <li><strong>Create a Variety of Programs</strong>: Develop different types of applications, including games and utilities, to acquire a broad range of skills.</li>
                <li><strong>Enhance Code Quality</strong>: Utilize AI suggestions to write high-quality and efficient code.</li>
                <li><strong>Explore and Evaluate AI Capabilities</strong>: Assess the strengths and limitations of Cline and Gemini-2.0-Flash-001 in software development.</li>
                <li><strong>Improve Problem-Solving Skills</strong>: Use AI-generated suggestions to tackle coding challenges more effectively.</li>
            </ul>
        </section>

        <section id="rules">
            <h2>Challenge Rules</h2>
            <ol>
                <li>Code every day for 100 days.</li>
                <li>Utilize Cline and AI-generated suggestions to enhance development.</li>
                <li>Document daily progress, challenges, and learnings.</li>
                <li>Share key takeaways from using AI in programming.</li>
            </ol>
        </section>

        <section id="technologies">
            <h2>Tools & Technologies</h2>
            <ul>
                <li><strong>Cline</strong>: AI-powered VSCode extension</li>
                <li><strong>Google Gemini-2.0-Flash-001</strong>: AI model for code generation and assistance</li>
                <li><strong>VSCode</strong>: Primary development environment</li>
                <li>HTML, JavaScript, and CSS: Core technologies for program development</li>
                <li>Other relevant programming languages and frameworks based on project needs</li>
            </ul>
        </section>

        <section id="outcomes">
            <h2>Expected Outcomes</h2>
            <ul>
                <li>A comprehensive evaluation of AI-assisted coding practices</li>
                <li>Improved development efficiency and problem-solving approaches</li>
                <li>A collection of completed projects and documented learnings</li>
                <li>Hands-on experience in integrating AI into daily coding workflows</li>
            </ul>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 m.kwgch</p>
    </footer>
    <script src="js/script.js"></script>
</body>
</html>`;

  fs.writeFile('index.html', html, err => {
    if (err) {
      console.error(err);
    } else {
      console.log('index.html generated successfully!');
    }
  });
});
