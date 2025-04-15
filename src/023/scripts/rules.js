class RuleEngine {
  constructor() {
    this.birthConditions = [3];
    this.survivalConditions = [2, 3];
  }

  setRules(birthConditions, survivalConditions) {
    this.birthConditions = birthConditions;
    this.survivalConditions = survivalConditions;
  }

  applyRules(grid, x, y) {
    const neighbors = grid.countNeighbors(x, y);
    if (grid.getCell(x, y) === 1) {
      return this.survivalConditions.includes(neighbors) ? 1 : 0;
    } else {
      return this.birthConditions.includes(neighbors) ? 1 : 0;
    }
  }
}
