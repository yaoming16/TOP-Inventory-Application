const pool = require("./pool");

async function getAll(table) {
  const { rows } = await pool.query(`SELECT * FROM ${table}`);
  return rows;
}

async function getById(id, table) {
  const { rows } = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  return rows[0];
}

async function edit(id, newName, table) {
  await pool.query(
    `UPDATE ${table} SET name = $1 WHERE id = $2`,
    [newName, id],
  );
}

async function add(name, table) {
  await pool.query(`INSERT INTO ${table} (name) VALUES ($1)`, [name]);
}

async function deleteElement(id, table) {
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

module.exports = {
  getAll,
  getById,
  edit,
  add,
  deleteElement,
};
