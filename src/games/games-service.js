const GamesService = {
  getAllGames(knex) {
    return knex.select("*").from("goodgames_list");
  },
};
module.exports = GamesService;
