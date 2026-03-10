const pool = require("./pool");

async function getAllGamesInfo() {
  const { rows } = await pool.query(`
    SELECT
      g.id,
      g.title,
      g.description,
      g.release,
      g.image_link,
    COALESCE(
    ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL)
    ) AS categories
    FROM games AS G
    LEFT JOIN games_categories gc ON gc.game_id = g.id
    LEFT JOIN categories c ON c.id = gc.category_id
    GROUP BY g.id, g.title
    ORDER BY g.title;
    `);
  return rows;
}

async function getGameInfo(id) {
  const { rows } = await pool.query(
    `
    SELECT
      g.id,
      g.title,
      g.description,
      g.release,
      g.image_link,
    COALESCE(
    ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL)
    ) AS categories
    FROM games AS G
    LEFT JOIN games_categories gc ON gc.game_id = g.id
    LEFT JOIN categories c ON c.id = gc.category_id
    GROUP BY g.id, g.title
    ORDER BY g.title
    WHERE id = $1
    `,
    [id],
  );
  return rows;
}

async function getAllCategoriesOfAGame(id) {
  const { rows } = await pool.query(
    `SELECT
      C.name
    FROM
      categories AS C
    INNER JOIN
      games_categories AS CG ON C.id = CG.category_id
    INNER JOIN
      games AS G ON CG.game_id = G.id
    WHERE
      G.id = $1
    `,
    [id],
  );
}

module.exports = {
  getAllGamesInfo,
  getAllCategoriesOfAGame,
  getGameInfo,
};
