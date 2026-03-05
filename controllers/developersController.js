const { createController } = require("./genericController");
const { body } = require("express-validator");

const validationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .escape(),
];

const developersController = createController("developers");

module.exports = {developersController, validationRules};