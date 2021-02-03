const knex = require("knex");
const bcrypt = require("bcryptjs");

const usersService = {
  hasUserWithUsername(knex, username) {
    return knex("goodgames_users")
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("goodgames_users")
      .returning("*")
      .then((rows) => rows[0]);
  },
  hashPassword(userpassword) {
    return bcrypt.hash(userpassword, 12);
  },

  getAllUsers(knex) {
    return knex.select("*").from("goodgames_users");
  },

  getById(knex, id) {
    return knex.from("goodgames_users").select("*").where("id", id).first();
  },

  deleteUser(knex, id) {
    return knex("goodgames_users").where({ id }).delete();
  },
};

module.exports = usersService;
