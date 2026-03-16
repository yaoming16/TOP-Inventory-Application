const db = require("../db/queries");

async function getHomePage(req, res) {
  const totals = await db.getTotals();
  res.render("homepage", {totals});
}

module.exports = {getHomePage};