const db = require("../db/queries");
const { validationResult } = require("express-validator");

function createController(type) {
  return {
    getAll: async (req,res) => {
        const data = await db.getAll(type);
        res.render("categoryTemplate", {
          info: data,
          title: type,
          type: type,
        });
    },
    getById: async (req, res) => {
      const info = await db.getById(req.params.id, type);
      res.json(info);
    },
    update: async (req,res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).render("errors", { errors: errors.array() });
        }

        await db.edit(req.params.id, req.body.name.trim(), type);
        return res.sendStatus(200);
    },
    add: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).render("errors", { errors: errors.array() });
        }

        await db.add(req.body.name.trim(), type);
        return res.sendStatus(200);
    },
    delete: async (req, res) => {
        await db.deleteElement(req.params.id, type);
        return res.status(200).json({ success: true })
    }
  }
}

/* async function getAllCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render("categories", {
    info: categories,
    title: "Categories",
    type: "categories",
  });
} */

/* async function getCategoryById(req, res) {
  const category = await db.getCategoryById(req.params.id);
  res.json(category);
} */

/* async function updateCategory(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("errors", { errors: errors.array() });
  }

  await db.editCategory(req.params.id, req.body.name.trim());
  return res.redirect("/categories");
} */

/* async function addCategory(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("errors", { errors: errors.array() });
  }

  await db.addCategory(req.body.name.trim());
  return res.redirect("/categories");
} */

/* async function deleteCategory(req, res) {
  await db.deleteCategory(req.params.id);
  return res.status(200).json({ success: true })
} */



module.exports = {
  createController
};
