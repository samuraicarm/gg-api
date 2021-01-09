const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("goodgames_list");
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
  getByPlayList(knex, playlist) {
    return knex.from("games").select("*").where({ playlist = "true"});
  },

  getByPlayed(knex, played) {
     return knex.from("games").select("*").where({ played = "true"});
  },


  deleteGame(knex, id) {
    return knex("games").where({ id }).delete();
  },

   updateGame(knex, id, newGameFields) {
        return knex('games')
            .where({ id })
            .update(newGameFields)
    },
};

module.exports = GamesService;
