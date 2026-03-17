const db = require("../db/queries");
const gamesDB = require("../db/gameQueries");

async function getHomePage(req, res) {
  const totals = await db.getTotals();
  const lastGames = await gamesDB.getLastGames(2);
  res.render("homepage", { totals, lastGames });
}

module.exports = { getHomePage };
