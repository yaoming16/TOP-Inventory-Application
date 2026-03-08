const { Router } = require("express");
const imagesController = require("../controllers/imagesController.js");

const imagesRouter = Router();

imagesRouter.get("/:id", imagesController.getImages);

module.exports = imagesRouter;
