const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("goodgames_list");
  },
  insertGame(knex, newGame) {
    return knex
      .insert(newGame)
      .into("goodgames_list")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteGame(knex, id) {
    return knex("goodgames_list").where({ id }).delete();
  },
  updateNote(knex, id, newGameFields) {
    return knex("goodgames_list").where({ id }).update(newGameFields);
  },
};

module.exports = GamesService;
