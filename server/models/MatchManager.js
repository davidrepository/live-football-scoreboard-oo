const Match = require("./Match");

class MatchManager {
  constructor(io) {
    this.io = io;
    this.matches = new Map();
  }

  resetMatches() {
    this.matches.clear();
  }

  createMatch(homeTeam, awayTeam) {
    const match = new Match(homeTeam, awayTeam);
    this.matches.set(match.id, match);

    return match;
  }

  broadcastMatchUpdate() {
    this.io.emit("matchesUpdate", {
      matches: this.getAllMatchesData(),
    });
  }

  updateMatchScore(matchId, homeScore, awayScore) {
    if (this.matches.has(matchId)) {
      this.matches.get(matchId).updateScore(homeScore, awayScore);
    }
  }

  finishMatch(matchId) {
    if (this.matches.has(matchId)) {
      const match = this.matches.get(matchId);
      match.finish();

      this.broadcastMatchUpdate();
    }
  }

  getAllMatchesData() {
    return Array.from(this.matches.values()).map((match) => ({
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      status: match.status,
    }));
  }

  clearMatches() {
    this.matches.clear();
  }
}

module.exports = MatchManager;
