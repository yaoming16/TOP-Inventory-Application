const db = require("../db/gameQueries");

async function getAllGames(req, res) {
  const data = await db.getAllGames();
  res.render("games", {
    info: data,
  });
}

module.exports = { getAllGames };
