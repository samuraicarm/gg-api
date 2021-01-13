const express = require("express");
const GamesService = require("./games-service");
const gamesRouter = express.Router();
const jsonParser = express.json();

const axios = require("axios");

gamesRouter
  .route("games")
  .get((req, res) => {
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
  })
  .post(jsonParser, (req, res, next) => {
    const { game_name, game_url } = req.body;
    // once you add requireAuth before jsonParser
    // req.user
    const newGame = { game_name, game_url };
    // newGame = {game_name, game_url, userid: req.user.id }
    GamesService.insertGame(req.app.get("db"), newGame)
      .then((game) => {
        res.status(201).json(game);
      })
      .catch(next);
  });

gamesRouter.route("/list").get((req, res) => {
  GamesService.getAllGames(req.app.get("db"))
    .then((games) => {
      res.json(games);
    })
    .catch(next);
});

gamesRouter
  .route("/:id")
  //.get()
  // get a game by id
  .delete((req, res) => {
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
    GamesService.findById(id).then((game) => {
      if (!game) {
        return res.status(404).json({
          error: {
            message: `playlist item not found`,
          },
        });
      } else {
        GamesService.updateGame(req.app.get("db"), req.params.id, gametoUpdate)
          .then(() => {
            res.status(204).end();
          })
          .catch(next);
      }
    });
  });

gamesRouter.route("/get-all").get((req, res) => {
  // requireAuth
  GamesService.getByUserId(req.app.get("db"), req.user.id)
    .then((games) => {
      res.json(games);
    })
    .catch(next);
});

gamesRouter.route("/playlist").get((req, res) => {
  // requireAuth
  GamesService.getByPlayList(req.app.get("db"), req.user.id)
    .then((games) => {
      res.json(games);
    })
    .catch(next);
});

gamesRouter.route("/played").get((req, res) => {
  // requireAuth
  GamesService.getByPlayed(req.app.get("db"), req.user.id)
    .then((games) => {
      res.json(games);
    })
    .catch(next);
});

gamesRouter.route("/list").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  GamesService.getAllGamesByUserId(knexInstance)
    .then((goodgames_list) => {
      res.json(goodgames_list);
    })
    .catch(next);
});

module.exports = gamesRouter;
