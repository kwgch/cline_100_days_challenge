var HandEvaluator = class {
    evaluateHand(hand) {
      const ranks = hand.map((card) => card.rank);
      const suits = hand.map((card) => card.suit);
      const rankCounts = {};
      const suitCounts = {};
      for (let rank of ranks) {
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
      }
      for (let suit of suits) {
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
      }
      const counts = Object.values(rankCounts).sort((a, b) => b - a);
      const isFlush = Object.values(suitCounts).includes(5);
      const sortedRanks = ranks.map((rank) => {
        if (rank === "J") return 11;
        if (rank === "Q") return 12;
        if (rank === "K") return 13;
        if (rank === "A") return 14;
        return parseInt(rank);
      }).sort((a, b) => a - b);
      const isStraight = sortedRanks.every((rank, index) => {
        if (index === 0) return true;
        return rank === sortedRanks[index - 1] + 1;
      });
      const isRoyal = isStraight && isFlush && sortedRanks[0] === 10;
      if (isRoyal) return "Royal Flush";
      if (isStraight && isFlush) return "Straight Flush";
      if (counts[0] === 4) return "Four of a Kind";
      if (counts[0] === 3 && counts[1] === 2) return "Full House";
      if (isFlush) return "Flush";
      if (isStraight) return "Straight";
      if (counts[0] === 3) return "Three of a Kind";
      if (counts[0] === 2 && counts[1] === 2) return "Two Pair";
      if (counts[0] === 2) return "Pair";
      return "High Card";
    }
  };
export { HandEvaluator };
