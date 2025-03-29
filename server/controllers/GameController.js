class GameController {
  constructor(io) {
    this.io = io;

    io.on("connection", (socket) => {
      socket.emit("connected", "Welcome!");
    });
  }
}

module.exports = GameController;
