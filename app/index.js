const express = require("express");
const dotenv = require("dotenv");
const metar = require("./src/routes/metar");
const space_news = require("./src/routes/space_news");
const fact = require("./src/routes/useless_fact");
const app = express();

dotenv.config();

// Ping route
app.get("/ping", async (req, res) => {
  res.send("Pong!");
});

app.get("/metar", metar);
app.get("/space_news", space_news);
app.get("/fact", fact);

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
