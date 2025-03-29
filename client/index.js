const socket = io("http://localhost:3000");

socket.on("connected", (message) => {
  console.log(message);
});
