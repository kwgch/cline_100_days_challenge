# Shogi Game

This is a simple Shogi game implemented using HTML, CSS, and JavaScript.

## How to Run Locally

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:

    ```bash
    cd shogi-game
    ```
3.  Open `index.html` in your browser.

## How to Deploy to Netlify

1.  **Create a Netlify Account:**

    *   Go to [Netlify](https://www.netlify.com/) and sign up for a free account.
2.  **Connect to Your Repository:**

    *   Click the "Add new site" button and select "Import an existing project".
    *   Connect your GitHub, GitLab, or Bitbucket repository.
3.  **Configure Build Settings:**

    *   Netlify should automatically detect that this is a static site and configure the build settings accordingly. If not, set the following:
        *   **Build command:** Leave empty (or specify `echo "No build required"`)
        *   **Publish directory:** `.` (the root directory)
4.  **Deploy Your Site:**

    *   Click the "Deploy site" button.
5.  **Access Your Site:**

    *   Once the deployment is complete, Netlify will provide a unique URL for your site (e.g., `https://your-site-name.netlify.app`).

## Project Structure

```
shogi-game/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── models/
    │   ├── board.js
    │   ├── piece.js
    │   └── pieces/
    │       ├── king.js
    │       ├── rook.js
    │       ├── bishop.js
    │       └── ...
    ├── states/
    │   ├── gameState.js
    │   ├── player1TurnState.js
    │   ├── player2TurnState.js
    │   └── gameOverState.js
    ├── factories/
    │   └── pieceFactory.js
    ├── strategies/
    │   └── moveStrategy.js
    ├── managers/
    │   └── gameManager.js
    ├── utils/
    │   └── eventEmitter.js
    └── views/
        ├── boardView.js
        └── gameView.js
