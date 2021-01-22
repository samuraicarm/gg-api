const express = require("express");
const GamesService = require("./games-service");
const axios = require("axios");
const gamesRouter = express.Router();

gamesRouter.route("/api/list").get((req, res) => {
  const knexInstance = req.app.get("db");
  GamesService.getAllGames(knexInstance).then((games) => {
    res.json(games);
  });
});

gamesRouter.route("/api/games").get((req, res) => {
  const config = {
    method: "get",
    url: `https://api.igdb.com/v4/games?search=${req.query.search}&fields=id,name,cover`,
    headers: {
      "Client-ID": process.env.GAME_API_KEY,
      Authorization: `Bearer ${process.env.GAME_API_TOKEN}`,
    },
  };

  axios(config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = gamesRouter;
