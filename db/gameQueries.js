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

async function addGame(newGameInfo) {
  const {title, releseDate, description, imgLink, developer, category} = newGameInfo;

  //create connection to the db. Need this to use the same connection for all queries that follow instead of multiple by calling pool.query
  const client = await pool.connect();

  try {
    // begin ... commit only commit to db if all the queries are successful
    await client.query("BEGIN");
    //Insert game
    const {rows} = await client.query(`
      INSERT INTO games (title, release, description, image_link, developer_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
      `, [title, releseDate, description, imgLink, developer]
    );
    const gameId = rows[0].id;
  
    //Insert categories related to this game in the games_categories table
    await client.query(`
      INSERT INTO games_categories (game_id, category_id)
      SELECT $1, UNNEST($2::int[]);
    `, [gameId, category]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    //return the db connection back
    client.release();
}
}

module.exports = {
  getAllGamesInfo,
  getAllCategoriesOfAGame,
  getGameInfo,
  addGame,
};
