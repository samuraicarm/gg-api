function makeGamesArray() {
  return [
    {
      id: 1,
      game_id: 22,
      game_name: "Bioshock",
      game_url: "https://dummyimage.com/300",
      playlist: true,
      played: false,
      favorite: false,
      userid: 1,
    },
    {
      id: 1,
      game_id: 32,
      game_name: "Chrono Trigger",
      game_url: "https://dummyimage.com/300",
      playlist: true,
      played: false,
      favorite: false,
      userid: 1,
    },
    {
      id: 1,
      game_id: 42,
      game_name: "Animal Crossing",
      game_url: "https://dummyimage.com/300",
      playlist: false,
      played: true,
      favorite: false,
      userid: 1,
    },
    {
      id: 4,
      game_id: 452,
      game_name: "Tony Hawk Pro Skateboarder",
      game_url: "https://dummyimage.com/300",
      playlist: false,
      played: true,
      favorite: ture,
      userid: 1,
    },
  ];
}

module.exports = { makeGamesArray };
