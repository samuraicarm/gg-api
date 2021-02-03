const path = require("path");
const express = require("express");
const xss = require("xss");
const usersService = require("./users-service");
const { requireAuth } = require("../middleware/jwt-auth");
const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  username: xss(user.username),
  date_created: user.date_created,
});

let knexInstance;

usersRouter
  .route("/api/users")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .get(requireAuth, (req, res) => {
    res.json(serializeUser(req.user));
  })
  .post(jsonParser, (req, res) => {
    const { username, userPassword } = req.body;
    for (const field of ["username", "userPassword"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }
    usersService.hasUserWithUsername(knexInstance, username).then((hasUser) => {
      if (hasUser) {
        return res.status(400).json({
          error: `Email already used`,
        });
      }

      return usersService.hashPassword(userPassword).then((hashedPassword) => {
        const newUser = {
          username,
          userpassword: hashedPassword,
        };

        return usersService.insertUser(knexInstance, newUser).then((user) => {
          res.status(201).json(serializeUser(user));
        });
      });
    });
  });

module.exports = usersRouter;
