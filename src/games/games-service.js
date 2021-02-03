const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("goodgames_list");
  },
  updateList(knex) {
    // return knex.update().where()
  },
};
module.exports = GamesService;
