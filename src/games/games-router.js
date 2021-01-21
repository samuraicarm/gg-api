const express = require("express");
const GamesService = require("./games-service");

const gamesRouter = express.Router();

gamesRouter.route("/games").get((req, res) => {
  const knexInstance = req.app.get("db");
  GamesService.getAllGames(knexInstance).then((games) => {
    res.json(games);
  });
});

module.exports = gamesRouter;
