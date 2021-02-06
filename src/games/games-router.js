const express = require("express");
const GamesService = require("./games-service");
const axios = require("axios");
const gamesRouter = express.Router();
const jsonParser = express.json();

gamesRouter
  .route("/api/list")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    GamesService.getAllGames(knexInstance)
      .then((games) => {
        res.json(games);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      game_id,
      game_name,
      game_url,
      playlist,
      played,
      favorite,
      userid,
    } = req.body;
    const newGame = {
      game_id,
      game_name,
      game_url,
      playlist,
      played,
      favorite,
      userid,
    };
    GamesService.insertGame(req.app.get("db"), newGame)
      .then((games) => {
        res.status(201).json(games);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    GamesService.deleteGame(req.app.get("db"), req.params.game_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { playlist, played, favorite } = req.body;
    const gameToUpdate = { playlist, played, favorite };
    const numberOfValues = Object.values(gameToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'playlist', 'played', 'favorite'`,
        },
      });
    }
    GamesService.updateGame(req.app.get("db"), req.params.id, gameToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

gamesRouter.route("/api/games").get((req, res) => {
  const config = {
    method: "get",
    url: `https://api.igdb.com/v4/games?search=${req.query.search}&fields=id,name,cover.image_id,first_release_date,genres.name&limit=100`,
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
