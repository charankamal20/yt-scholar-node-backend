const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const cookieParser = require("cookie-parser");
const authenticateToken = require("../middleware/auth");

router.use(cookieParser(), authenticateToken)

router.get("/health", async (req, res) => {
  res.status(200).json({ message: "success" });
});

router.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an item
router.post("/items", async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single item
router.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an item
router.delete("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.remove();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
