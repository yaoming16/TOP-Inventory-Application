const gameDB = require("../db/gameQueries");
const categoriesDB = require("../db/queries");

async function getAllGames(req, res) {
  const data = await gameDB.getAllGamesInfo();
  const categories = await categoriesDB.getAll("categories");
  const developers = await categoriesDB.getAll("developers");
  let toReturn = {
    gamesInfo: data,
    categories: categories,
    developers: developers,
  };
  res.render("games", toReturn);
}

module.exports = { getAllGames };
