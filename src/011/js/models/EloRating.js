class EloRating {
  constructor(kFactor = 32) {
    this.kFactor = kFactor;
  }

  calculateNewRatings(winner, loser) {
    const expectedScoreWinner = this.expectedScore(winner.rating, loser.rating);
    const expectedScoreLoser = this.expectedScore(loser.rating, winner.rating);

    const newRatingWinner = winner.rating + this.kFactor * (1 - expectedScoreWinner);
    const newRatingLoser = loser.rating + this.kFactor * (0 - expectedScoreLoser);

    // Ensure the rating change is within the range of 2 to 32
    const ratingChangeWinner = Math.max(2, Math.min(32, newRatingWinner - winner.rating));
    const ratingChangeLoser = Math.max(2, Math.min(32, newRatingLoser - loser.rating));

    return {
      winnerRating: winner.rating + ratingChangeWinner,
      loserRating: loser.rating + ratingChangeLoser,
    };
  }

  expectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  }
}

export default EloRating;
