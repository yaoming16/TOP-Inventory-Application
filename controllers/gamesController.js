const db = require("../db/gameQueries");

async function getAllGames(req, res) {
  const data = await db.getAllGamesInfo();
  res.render("games", {
    gamesInfo: data,
  });
}

module.exports = { getAllGames };
