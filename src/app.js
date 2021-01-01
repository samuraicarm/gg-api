require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());

const games = require("./gamesdata.js");

/*app.get("/", (req, res) => {
  res.send("Hello, world!");
});*/

app.get("/games", (req, res) => {
  res.send("Hello, world!");

  res.json(games);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});

/*
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

app.use(cors());

module.exports = app;
