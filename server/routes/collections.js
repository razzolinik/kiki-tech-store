const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");

router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const collection = await Collection.findOne({ id: req.params.id });
    if (!collection) return res.status(404).json({ error: "Colección no encontrada" });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;