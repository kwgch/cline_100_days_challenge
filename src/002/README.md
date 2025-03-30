# Simple Poker Game

This is a simple poker game implemented using HTML, CSS, and JavaScript. The game is played between a player and an NPC. The game follows the rules of 5-card draw poker, with a single round of card exchange.

## How to Play

1.  Open `index.html` in your browser.
2.  The game will deal 5 cards to you and 5 cards to the NPC. The NPC's cards are hidden.
3.  Click on the cards you want to exchange. Selected cards will be highlighted.
4.  Click the "Exchange" button to replace the selected cards with new cards from the deck.
5.  The NPC will automatically exchange cards based on a basic strategy.
6.  The game will display both hands and determine the winner.

## Game Rules

*   The game uses a standard 52-card deck (no jokers).
*   Card ranks are ordered from highest to lowest: A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2.
*   Card suits are: Spades (♠), Hearts (♥), Diamonds (♦), Clubs (♣).
*   The game evaluates hands based on the following poker hand rankings (from highest to lowest):
    1.  Royal Flush
    2.  Straight Flush
    3.  Four of a Kind
    4.  Full House
    5.  Flush
    6.  Straight
    7.  Three of a Kind
    8.  Two Pair
    9.  Pair
    10. High Card

## File Structure

```
poker-game/
├── index.html        # Main HTML file
├── css/
│   └── style.css     # Stylesheet
└── js/
    ├── main.js       # Main game logic
    ├── models/
    │   ├── deck.js   # Card deck management
    │   ├── player.js # Player class
    │   └── npc.js    # NPC class
    ├── states/
    │   ├── gameState.js          # State interface
    │   ├── initialState.js       # Initial state
    │   ├── cardExchangeState.js  # Card exchange state
    │   └── resultState.js        # Result state
    ├── strategies/
    │   ├── npcStrategy.js        # NPC strategy interface
    │   └── basicStrategy.js      # Basic strategy
    ├── utils/
    │   ├── evaluator.js          # Hand evaluation logic
    │   └── eventEmitter.js       # Event management
    └── ui/
        ├── uiManager.js          # UI management
        ├── cardView.js           # Card display
        └── resultView.js         # Result display
