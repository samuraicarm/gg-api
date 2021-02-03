require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const gamesRouter = require("./games/games-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);

app.use(cors());
app.use(helmet());

app.use(gamesRouter);
app.use(usersRouter);
app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

/*
app.get("/game", (req, res) => {
  res.send("get game").json(cards);
});

app.get("/list", (req, res) => {
  res.send("get game list").json(cards);
});

app.get("game/:id", (req, res) => {
  const { id } = req.params;
  const game = game.find((c) => c.id == id);

  if (!game) {
    logger.error(`Card with if ${id} not found`);
    return res.status(404).send("Card Not Found");
  }
  res.json(game);
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "info.log" })],
});
if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});
*/

module.exports = app;
