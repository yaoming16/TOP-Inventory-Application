const {Router} = require("express");
const indexController = require("../controllers/indexController.js");

const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);

module.exports = indexRouter;
