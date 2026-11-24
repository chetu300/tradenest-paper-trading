require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { getPrices, startPriceEngine } = require("./sockets/priceEngine");

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
  },
});

io.on("connection", (socket) => {
  socket.emit("prices:update", getPrices());
});

async function startServer() {
  await connectDB();
  startPriceEngine(io);
  server.listen(port, () => {
    console.log(`Stock simulator API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start the server:", error.message);
  process.exitCode = 1;
});
