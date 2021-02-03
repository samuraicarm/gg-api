const express = require("express");
const authService = require("./auth-service");
const authRouter = express.Router();
const jsonParser = express.json();

authRouter
  .route("/api/auth/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .post(jsonParser, (req, res, next) => {
    const { username, userPassword } = req.body;
    const user = { username, userPassword };
    for (const field of ["username", "userPassword"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }
    authService.getUserWithUsername(knexInstance, username).then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: "incorrect email or password",
        });
      }
      authService
        .comparePasswords(userPassword, dbUser.userPassword)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              error: "incorrect email or password",
            });
          }
        });
      const subject = dbUser.username;
      const payload = { user_id: dbUser.id };
      res.send({
        authToke: authService.createJWT(),
      });
    });
  });

module.exports = authRouter;
