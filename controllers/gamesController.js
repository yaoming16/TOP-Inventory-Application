const gameDB = require("../db/gameQueries");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { randomUUID } = require("crypto");
const { validationResult, body } = require("express-validator");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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

function uploadToCloudinary(fileBuffer, imageName) {
  return new Promise((resolve, reject) => {
    const options = { folder: "inventory_games" };
    if (imageName) {
      options.public_id = imageName;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
}

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

async function updateGame(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .render("errors", { errors: errors.array(), goBack: "/games" });
  }

  // Img link won't change so we cant start it as null
  let imgLink = null;

  // Update the game in the database regardless of whether an image was uploaded
  await gameDB.updateGame({
    ...req.body,
    imgLink,
    id: req.params.id,
  });

  // If req.file exists we upload the new image that will replace the old one.
  // To do that we need to fetch the current img link from db to get the image name in cloudinary.
  // Img link wont change so we dont need to update link in db
  if (req.file) {
    response = await gameDB.getGameInfo(req.params.id);
    imgLink = response.image_link;
    const imgName = imgLink.split("/").pop().split(".")[0];
    const processedBuffer = await sharp(req.file.buffer).webp().toBuffer();
    const uploadResult = await uploadToCloudinary(processedBuffer, imgName);
  }

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
  const processedBuffer = await sharp(req.file.buffer).webp().toBuffer();

  // Use randomUUID to generate a unique name for the image
  const imgId = randomUUID();
  const uploadResult = await uploadToCloudinary(processedBuffer, imgId);

  const imgLink = uploadResult.secure_url;

  await gameDB.addGame({ ...req.body, imgLink });
  return res.sendStatus(200);
}

async function deleteGame(req, res) {
  const response = await gameDB.deleteGame(req.params.id);
  //Delete image in the server
  const imgPath = path.join(
    __dirname,
    "..",
    "public",
    `${response.image_link}`,
  );
  try {
    await fs.promises.unlink(imgPath);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating the game image", err);
  }
}

module.exports = {
  getAllGames,
  addGame,
  getGameById,
  updateGame,
  deleteGame,
  validationRules,
};
