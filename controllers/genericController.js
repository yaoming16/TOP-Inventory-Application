const db = require("../db/queries");
const { validationResult } = require("express-validator");

function createController(type) {
  return {
    getAllInfo: async (req, res) => {
      const data = await db.getAll(type);
      res.status(200).json(data);
    },
    getAll: async (req, res) => {
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
    update: async (req, res) => {
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
      return res.status(200).json({ success: true });
    },
  };
}

module.exports = {
  createController,
};
