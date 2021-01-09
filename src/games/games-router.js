const express = require("express");
const GamesService = require("./games-service");
const gamesRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const axios = require("axios");
const axiosconfig = require("./axiosconfig");

axios(axiosconfig)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

//does the homepage need to be here?
app.get("/", (req, res) => {
  res.send("app.get Hello, world!");
});

gamesRouter
  .route("/")
  .get("/add", (req, res) => {})
  .post(jsonParser, (req, res, next) => {
    const { game_name, game_url } = req.body;
    const newGame = { game_name, game_url };
    GamesService.insertGame(req.app.get("db"), newGame)
      .then((game) => {
        res.status(201).json(game);
      })
      .catch(next);
  });

gamesRouter
  .route("/")
  .get("/playlist", (req, res) => {
    GamesService.getByPlayList(req.app.get("db"))
      .then((games) => {
        res.json(games);
      })
      .catch(next);
  })
  .delete("/playlist", (req, res) => {
    GamesService.deleteGame(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { played, playlist, favorite } = req.body;
    const gametoUpdate = { played, playlist, favorite };
    const { id } = req.params;
    const index = playlist.findIndex(() => playlist.id === id);
    if (index === -1) {
      return res
        .status(400)
        .json({
          error: {
            message: `playlist item not found`,
          },
        })
        .send("Removed");
    }
    GamesService.updateGame(req.app.get("db"), req.params.id, gametoUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

gamesRouter
  .route("/")
  .get("/played", (req, res) => {
    GamesService.getByPlayed(req.app.get("db"))
      .then((games) => {
        res.json(games);
      })
      .catch(next);
  })
  .delete("/played", (req, res) => {
    GamesService.deletegame(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { played, playlist, favorite } = req.body;
    const gametoUpdate = { played, playlist, favorite };
    const { id } = req.params;
    const index = played.findIndex(() => played.id === id);
    if (index === -1) {
      return res
        .status(400)
        .json({
          error: {
            message: `playlist item not found`,
          },
        })
        .send("Removed");
    }
    GamesService.updateGame(req.app.get("db"), req.params.id, gametoUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = gamesRouter;
