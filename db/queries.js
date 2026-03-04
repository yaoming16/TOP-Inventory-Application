const pool = require("./pool");

const updateQuery = `
UPDATE categories
SET name = $1
WHERE $2 = id
`

async function getAllCategories() {
  const {rows} = await pool.query("SELECT * FROM categories");
  return rows;
}

async function getCategoryById(id) {
  const {rows} = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
  return rows[0];
}

async function editCategory(id, newName) { 
  await pool.query(updateQuery, [newName, id]);
}

module.exports = {getAllCategories, getCategoryById, editCategory};