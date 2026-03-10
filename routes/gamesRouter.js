const { Router } = require("express");
const gamesController = require("../controllers/gamesController.js");

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.post("/add", gamesController.validationRules ,gamesController.addGame);

module.exports = gamesRouter;
