const { Router } = require("express");
const {developersController, validationRules} = require("../controllers/developersController.js");

const developersRouter = Router();

developersRouter.get("/", developersController.getAll);
developersRouter.get("/:id", developersController.getById);
developersRouter.post(
  "/:id/edit",
  validationRules,
  developersController.update,
);
developersRouter.post(
  "/add",
  validationRules,
  developersController.add,
);
developersRouter.delete("/:id/delete",developersController.delete);

module.exports = developersRouter;