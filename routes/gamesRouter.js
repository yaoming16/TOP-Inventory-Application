const { Router } = require("express");
const gamesController = require("../controllers/gamesController.js");
const upload = require("../middleware/upload.js");

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.post(
	"/add",
	upload.single("gameImg"),
	gamesController.validationRules,
	gamesController.addGame,
);

module.exports = gamesRouter;
