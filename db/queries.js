const pool = require("./pool");

async function getAll(table) {
  const { rows } = await pool.query(`SELECT * FROM ${table}`);
  return rows;
}

async function getById(id, table) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [
    id,
  ]);
  return rows[0];
}

async function edit(id, newName, table) {
  await pool.query(`UPDATE ${table} SET name = $1 WHERE id = $2`, [
    newName,
    id,
  ]);
}

async function add(name, table) {
  await pool.query(`INSERT INTO ${table} (name) VALUES ($1)`, [name]);
}

async function deleteElement(id, table) {
  const deleteQuery = `DELETE FROM ${table} WHERE id = $1`;

  //For categories we will need to run two queries instead of one
  //One to delete category and one to delete all rows that had that category in games_category table
  if (table === "categories") {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      //Delete games that had the category we want to delete in games_categories table
      await pool.query(
        `
          DELETE FROM games_categories WHERE category_id = $1
          `,
        [id],
      );

      await client.query(deleteQuery, [id]);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } else {
    await pool.query(deleteQuery, [id]);
  }
}

async function getTotals() {
  const categories  = await pool.query(
    `SELECT COUNT(DISTINCT name) FROM categories`,
  );
  const  developers  = await pool.query(
    `SELECT COUNT(DISTINCT name) FROM developers`,
  );
  const  games  = await pool.query(`SELECT COUNT(DISTINCT id) FROM games`);
  console.log(games)

  return {
    categories: categories.rows[0].count,
    developers: developers.rows[0].count,
    games: games.rows[0].count,
  };
}

async function deleteGameCategories(id) {}

module.exports = {
  getAll,
  getById,
  edit,
  add,
  deleteElement,
  deleteGameCategories,
  getTotals,
};
