class GameOfLifeApp {
  constructor() {
    this.grid = new Grid(60, 60, 10);
    this.ruleEngine = new RuleEngine();
    this.uiController = new UIController(this.grid, this.ruleEngine);
  }

  initialize() {
    this.grid.initialize();
    this.uiController.initializeControls();
    this.grid.render(document.getElementById('gameCanvas'), 'rainbow');
  }
}

const app = new GameOfLifeApp();
app.initialize();
