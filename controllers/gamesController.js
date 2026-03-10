const gameDB = require("../db/gameQueries");
const sharp = require("sharp");
const path = require("path");
const { randomUUID } = require("crypto");
const { validationResult, body } = require("express-validator");

const validationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .escape(),
  body("releseDate")
    .notEmpty()
    .withMessage("Release date is required")
    .isDate()
    .withMessage("Invalid date format")
    .isBefore(new Date().toISOString())
    .withMessage("Date must be in the past"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .escape(),
  body("developer").notEmpty().withMessage("Developer is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

async function getAllGames(req, res) {
  const data = await gameDB.getAllGamesInfo();
  let toReturn = {
    gamesInfo: data,
  };
  res.render("games", toReturn);
}

async function addGame(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("errors", { errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).render("errors", {
      errors: [{ msg: "Game image is required" }],
    });
  }

  //We need to convert, name and save the image the user uploads
  const imgId = randomUUID();
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "images",
    `${imgId}.webp`,
  );
  await sharp(req.file.buffer).toFormat("webp").toFile(imagePath);
  const imgLink = `/images/${imgId}`;

  await gameDB.addGame({ ...req.body, imgLink });
  return res.sendStatus(200);
}

module.exports = { getAllGames, addGame, validationRules };
