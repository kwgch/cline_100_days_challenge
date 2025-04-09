# System Patterns

**Architecture:** MVC (Model-View-Controller)

**Key Technical Decisions:**

*   Using the Google Translate unofficial API for translation.
*   Implementing the API call using the `fetch` API.
*   Using Font Awesome for icons.

**Design Patterns:**

*   **MVC:** Separates the application into three interconnected parts: the Model (data), the View (UI), and the Controller (logic).
*   **Module Pattern:** Encapsulates different parts of the application into separate modules (e.g., `config.js`, `api.js`, `utils.js`).

**Component Relationships:**

*   The `TranslationController` manages the interaction between the `LanguageModel`, `TranslationModel`, `ChatView`, `InputView`, and `LanguageSelectorView`.
*   The `ChatView` renders the chat messages.
*   The `InputView` handles user input.
*   The `LanguageSelectorView` allows the user to select the target language.
