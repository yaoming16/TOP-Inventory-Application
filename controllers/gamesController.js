const gameDB = require("../db/gameQueries");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { validationResult, body } = require("express-validator");

const validationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must have at least three characters")
    .escape(),
  body("releaseDate")
    .notEmpty()
    .withMessage("Release date is required")
    .isDate()
    .withMessage("Invalid date format")
    .isBefore(new Date().toISOString())
    .withMessage("Date must be in the past"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 15 })
    .withMessage("Description must be at least 15 characters")
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

async function getGameById(req, res) {
  const info = await gameDB.getGameInfo(req.params.id);
  return res.status(200).json(info);
}

//Function to convert, name and save the image
async function formatImg(file) {
  const imgId = randomUUID();
  const imagePath = path.join(
    __dirname,
    "..",
    "public",
    "images",
    `${imgId}.webp`,
  );
  await sharp(file.buffer).toFormat("webp").toFile(imagePath);
  return `/images/${imgId}`;
}

async function updateGame(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("errors", { errors: errors.array(), goBack: "/games" });
  }

  // If no file in req.file means user didnt selected a file to update the current one so we dont need to update link in db
  // That is why we set imgLink to null
  let imgLink = null;
  if (req.file) {
    imgLink = await formatImg(req.file);
  }

  await gameDB.updateGame({ ...req.body, imgLink, id: req.params.id });
  return res.sendStatus(200);
}

async function addGame(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("errors", { errors: errors.array(), goBack: "/games" });
  }

  if (!req.file) {
    return res.status(400).render("errors", {
      errors: [{ msg: "Game image is required" }],
      goBack: "/games",
    });
  }

  //We need to convert, name and save the image the user uploads
  const imgLink = await formatImg(req.file);

  await gameDB.addGame({ ...req.body, imgLink });
  return res.sendStatus(200);
}

async function deleteGame(req, res) {
  await gameDB.deleteGame(req.params.id);
  return res.status(200).json({ success: true });
}

module.exports = {
  getAllGames,
  addGame,
  getGameById,
  updateGame,
  deleteGame,
  validationRules,
};
