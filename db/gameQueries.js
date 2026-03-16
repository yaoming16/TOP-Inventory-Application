const pool = require("./pool");

async function getAllGamesInfo() {
  const { rows } = await pool.query(`
    SELECT
      g.id,
      g.title,
      g.description,
      g.release,
      g.image_link,
      d.name AS developer,
    COALESCE(
    ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL)
    ) AS categories
    FROM games AS G
    LEFT JOIN games_categories gc ON gc.game_id = g.id
    LEFT JOIN categories c ON c.id = gc.category_id
    LEFT JOIN developers d ON d.id = g.developer_id
    GROUP BY g.id, g.title, d.name
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
      g.developer_id,
    COALESCE(
    ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL)
    ) AS categories
    FROM games AS G
    LEFT JOIN games_categories gc ON gc.game_id = g.id
    LEFT JOIN categories c ON c.id = gc.category_id
    WHERE g.id = $1
    GROUP BY g.id, g.title
    ORDER BY g.title
    `,
    [id],
  );
  return rows[0] ?? null;
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
  return rows;
}

//Query to add categories to a game
async function addCategoriesToGame(client, gameId, categories) {
  const categoryArray = Array.isArray(categories) ? categories : [categories];

  await client.query(
    `
      INSERT INTO games_categories (game_id, category_id)
      SELECT $1, UNNEST($2::int[]);
    `,
    [gameId, categoryArray],
  );
}

//Query to delete game categories of a game
async function deleteGameCategories(client, gameId) {
  await client.query(
    `
    DELETE FROM games_categories
    WHERE game_id = $1
    `,
    [gameId],
  );
}

async function updateGame(gameInfo) {
  const { title, releaseDate, description, imgLink, developer, category, id } =
    gameInfo;

  const client = await pool.connect();

  try {
    // begin ... commit only commit to db if all the queries are successful
    await client.query("BEGIN");
    //Update game
    // Build SET clause and parameters safely to avoid SQL syntax errors when imgLink is absent
    const setClauses = [
      "title = $1",
      "release = $2",
      "description = $3",
      "developer_id = $4",
    ];
    const params = [title, releaseDate, description, developer];
    if (imgLink) {
      params.push(imgLink);
      setClauses.push(`image_link = $${params.length}`);
    }
    params.push(id); // id is the last param

    const updateQuery = `
      UPDATE games
      SET ${setClauses.join(", ")}
      WHERE id = $${params.length}
    `;
    await client.query(updateQuery, params);

    //Delete old categories related to this game
    await deleteGameCategories(client, id);

    //Insert new categories
    await addCategoriesToGame(client, id, category);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // return  connection
    client.release();
  }
}

async function addGame(newGameInfo) {
  const { title, releaseDate, description, imgLink, developer, category } =
    newGameInfo;

  //create connection to the db. Need this to use the same connection for all queries that follow instead of multiple by calling pool.query
  const client = await pool.connect();

  try {
    // begin ... commit only commit to db if all the queries are successful
    await client.query("BEGIN");
    //Insert game
    const { rows } = await client.query(
      `
      INSERT INTO games (title, release, description, image_link, developer_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
      `,
      [title, releaseDate, description, imgLink, developer],
    );
    const gameId = rows[0].id;

    //Insert categories related to this game in the games_categories table
    await addCategoriesToGame(client, gameId, category);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    //return the db connection back
    client.release();
  }
}

async function deleteGame(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    //delete game categories
    await deleteGameCategories(client, id);
    //delete game itself
    await client.query(
      `
      DELETE FROM games
      WHERE id = $1
      `,
      [id],
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
}

module.exports = {
  getAllGamesInfo,
  getAllCategoriesOfAGame,
  getGameInfo,
  addGame,
  updateGame,
  deleteGame,
};
