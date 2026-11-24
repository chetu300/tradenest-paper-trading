const cors = require("cors");
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.CLIENT_URL,
    ].filter(Boolean),
  }),
);
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Something went wrong on the server." });
});

module.exports = app;
