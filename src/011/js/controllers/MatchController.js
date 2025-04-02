import EloRating from '../models/EloRating.js';

class MatchController {
  constructor(userController) {
    this.eloRating = new EloRating();
    this.userController = userController;
  }

  recordMatch(winnerId, loserId) {
    const winner = this.userController.users.find(user => user.id === parseInt(winnerId));
    const loser = this.userController.users.find(user => user.id === parseInt(loserId));

    if (!winner || !loser) {
      console.error('Invalid winner or loser ID');
      return;
    }

    const { winnerRating, loserRating } = this.eloRating.calculateNewRatings(winner, loser);

    winner.rating = winnerRating;
    loser.rating = loserRating;

    this.userController.saveUsers();
  }
}

export default MatchController;
