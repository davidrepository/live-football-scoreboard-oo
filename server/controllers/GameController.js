const { MatchManager } = require("../models");

class GameController {
  constructor(io) {
    this.io = io;
    this.matchManager = new MatchManager(io);

    io.on("connection", (socket) => {
      socket.emit("connected", "Welcome!");

      socket.on("startMatch", (data) => this.startMatch(data));
      socket.on("updateScore", (data) => this.updateScore(data));
      socket.on("finishMatch", (data) => this.finishMatch(data));

      socket.on("disconnect", () => {
        this.matchManager.clearMatches();
      });

      socket.on("resetMatches", () => {
        this.matchManager.resetMatches();
        this.io.emit("matchesUpdate", { matches: [] });
      });
    });
  }

  startMatch(data) {
    this.matchManager.createMatch(data.homeTeam, data.awayTeam);

    this.io.emit("matchesUpdate", {
      matches: this.matchManager.getAllMatchesData(),
    });
  }

  updateScore(data) {
    this.matchManager.updateMatchScore(
      data.matchId,
      data.homeScore,
      data.awayScore
    );

    this.io.emit("matchesUpdate", {
      matches: this.matchManager.getAllMatchesData(),
    });
  }

  finishMatch(data) {
    this.matchManager.finishMatch(data.matchId);

    this.io.emit("matchesUpdate", {
      matches: this.matchManager.getAllMatchesData(),
    });
  }
}

module.exports = GameController;
