const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("goodgames_list");
  },
  getAllGamesByUserId(knex) {
    return knex.select("*").from("goodgames_list");
  },
  getGamesByUserId(knex, userid) {
    return knex.select("*").from("goodgames_list").where({ userid });
  },
  insertGame(knex, newGame) {
    return knex
      .insert(newGame)
      .into("games")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getByPlayList(knex, userid) {
    return knex
      .from("games")
      .select("*")
      .where({ playlist: "true" })
      .andWhere({ userid });
  },

  getByPlayed(knex, userid) {
    return knex
      .from("games")
      .select("*")
      .where({ played: "true" })
      .andWhere({ userid });
  },

  deleteGame(knex, id) {
    return knex("games").where({ id }).delete();
  },

  updateGame(knex, id, newGameFields) {
    return knex("games").where({ id }).update(newGameFields);
  },
};

module.exports = GamesService;
