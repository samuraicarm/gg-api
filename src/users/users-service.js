const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("goodgames_users");
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("goodgames_users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("goodgames_users").select("*").where("id", id).first();
  },

  deleteUser(knex, id) {
    return knex("goodgames_users").where({ id }).delete();
  },
};

module.exports = UsersService;
