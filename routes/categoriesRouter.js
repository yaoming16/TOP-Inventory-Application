const { Router } = require("express");
const {categoriesController, validationRules} = require("../controllers/categoriesController.js");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getAll);
categoriesRouter.get("/:id", categoriesController.getById);
categoriesRouter.post(
  "/:id/edit",
  validationRules,
  categoriesController.update,
);
categoriesRouter.post(
  "/add",
  validationRules,
  categoriesController.add,
);
categoriesRouter.delete("/:id/delete",categoriesController.delete);

module.exports = categoriesRouter;
