const { createServer } = require("http");

const PORT = 3000;

const httpServer = createServer();

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
