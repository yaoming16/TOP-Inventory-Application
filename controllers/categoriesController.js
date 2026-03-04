const db = require("../db/queries");

async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render("categories", {info : categories, title: "Categories", type: "category" });
}

async function getCategoryById(req, res) {
  const category = await db.getCategoryById(req.params.id);
  res.json(category);
}

async function updateCategory(req, res) {
  await db.editCategory(req.params.id);
  res.status(200).json({message: `Category with id ${req.params.id} was updated correctly`})
}

module.exports = {getAllCategories, getCategoryById, updateCategory};