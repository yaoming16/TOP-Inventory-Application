const {Router} = require("express");
const categoriesController = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAllCategories);
categoriesRouter.get("/:id", categoriesController.getCategoryById);
categoriesRouter.put("/:id/edit", categoriesController.updateCategory);

module.exports = categoriesRouter;