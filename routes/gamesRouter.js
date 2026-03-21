const { Router } = require("express");
const gamesController = require("../controllers/gamesController.js");
const multer = require("multer");

const gamesRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.get("/:id", gamesController.getGameById);
gamesRouter.post(
  "/add",
  upload.single("gameImg"),
  gamesController.validationRules,
  gamesController.addGame,
);
gamesRouter.post(
  "/:id/edit",
  upload.single("gameImg"),
  gamesController.validationRules,
  gamesController.updateGame,
);
gamesRouter.delete("/:id/delete", gamesController.deleteGame);

module.exports = gamesRouter;
