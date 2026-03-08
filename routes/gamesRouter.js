const { Router } = require("express");
const gamesController = require("../controllers/gamesController.js");

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getAllGames);

module.exports = gamesRouter;
