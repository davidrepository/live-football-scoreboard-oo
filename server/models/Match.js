class Match {
  constructor(homeTeam, awayTeam) {
    this.id = `${homeTeam.toLowerCase()}-${awayTeam.toLowerCase()}-${Date.now()}`;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeScore = 0;
    this.awayScore = 0;
    this.status = "ongoing";
  }

  updateScore(homeScore, awayScore) {
    this.homeScore = homeScore;
    this.awayScore = awayScore;
  }

  finish() {
    this.status = "finished";
  }
}

module.exports = Match;
