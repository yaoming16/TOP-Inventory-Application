const { Router } = require("express");
const gamesController = require("../controllers/gamesController.js");

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.get("/:id", gamesController.getGameById);
gamesRouter.post(
  "/add",
  gamesController.validationRules,
  gamesController.addGame,
);
gamesRouter.post(
  "/:id/edit",
  gamesController.validationRules,
  gamesController.updateGame,
);
gamesRouter.delete("/:id/delete", gamesController.deleteGame);

module.exports = gamesRouter;
