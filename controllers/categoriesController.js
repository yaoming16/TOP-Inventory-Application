const db = require("../db/queries");

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  console.log(categories);
}

module.exports = {getAllCategories};