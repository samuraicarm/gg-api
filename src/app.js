require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const { v4: uuid } = require("uuid");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());

const users = [
  {
    id: "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    username: "sallyStudent",
    password: "c00d1ng1sc00l",
  },
  {
    id: "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
    username: "johnBlocton",
    password: "veryg00dpassw0rd",
  },
];

const games = require("./gamesdata.js");

app.get("/", (req, res) => {
  res.send("app.get Hello, world!");
});

app.get("/games", (req, res) => {
  const { search = " ", sort } = req.query;

  let results = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCarse())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(games);
});

app.get("/playlist", (req, res) => {
  res.json(playlist);
});

app.get("/playlist/:id", (req, res) => {
  const { id } = req.params;
  const playlistItem = playlists.find((pl) => pl.id == id);

  //make sure we find the right playlist item
  if (!playlistItem) {
    logger.error("Playlist Item with id ${id} not found");
    return res.status(404).send("Playlist Item Not Found");
  }
  res.json(playlistItem);
});

app.delete("playlist/:id", (req, res) => {
  const { id } = req.params;
  const index = playlist.findIndex((pl) => pl.id === id);

  if (index === -1) {
    return res.status(404).send("playlist item not found");
  }
  playlist.splice(index, 1);

  res.send("Removed");
});

app.patch("playlist/:id"),
  (req, res) => {
    const { favorite, played } = req.body;
    const gametoUpdate = { favorite, played };

    //if  favorite is true, change to false

    //if played is false, change to true
  };

app.get("/played", (req, res) => {
  res.json(played);
});

app.get("played/:id", (req, res) => {
  const { id } = req.params;
  const playedItem = played.find((pd) => pd.id == id);
  //make sure we find the right played item

  if (!playedItem) {
    logger.error("Played Item with id ${id} not found");
    return res.status(404).send("Played Item Not Found");
  }
  res.json(playedItem);
});

app.delete("played/:id", (req, res) => {
  const { id } = req.params;
  const index = played.findIndex((pd) => pd.id === id);

  if (index === -1) {
    return res.status(404).send("played item not found");
  }
  played.splice(index, 1);

  res.send("Removed");
});

app.patch("played/:id"),
  (req, res) => {
    const { favorite, played } = req.body;
    const gametoUpdate = { favorite };

    //if  favorite is true, change to false
  };

app.get("/add", (req, res) => {});

app.get("/login", (req, res) => {});

app.get("/signup", (req, res) => {});

app.post("/user", (req, res) => {
  const { username, password } = req.body;

  // All required. Check if sent.
  if (!username) {
    return res.status(400).send("Username required");
  }

  if (!password) {
    return res.status(400).send("Password required");
  }

  //userame formatted correctly
  if (username.length < 6 || username.length > 20) {
    return res.status(400).send("username must be between 6 and 20 characters");
  }

  // password length

  if (password.length < 8 || password.length > 36) {
    return res.status(400).send("password must be between 8 and 36 characters");
  }

  // password contains digit
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res.status(400).send("Password must be contain at least one digit");
  }

  // at this point all validation passed
  res.send("All validation passed");

  const id = uuid(); // generate a unique id
  const newUser = {
    id,
    username,
    password,
  };

  users.push(newUser);

  res.status(201).location(`http://localhost:8000/user/${id}`).json({ id: id });
});

app.delete("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const index = users.findIndex((u) => u.id === userId);

  // make sure we actually find a user with that id
  if (index === -1) {
    return res.status(404).send("User not found");
  }

  users.splice(index, 1);

  res.status(204).end();
});

//test to see all users
app.get("/user", (req, res) => {
  res.json(users);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});

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

app.use(cors());

module.exports = app;
