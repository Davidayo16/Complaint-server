const Category = require('../models/Category');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");
    const categories = await Category.find();
    console.log("Categories found:", categories);
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: 'Category already exists' });
    }
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (name) category.name = name;
    if (description) category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.remove();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
