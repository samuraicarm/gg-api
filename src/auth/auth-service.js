const knex = require("knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const authService = {
  getUserWithUsername(knex, username) {
    return knex("goodgames_users").where({ username }).first();
  },
  comparePasswords(userPassword, hash) {
    return bcrypt.compare(userPassword, hash);
  },
  createJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_Secret, {
      subject,
      algorithm: "HS256",
    });
  },
};

module.exports = authService;
