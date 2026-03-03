const {Router} = require("express");
const categoriesController = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

module.exports = categoriesRouter;