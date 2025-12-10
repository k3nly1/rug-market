// GET all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const { Category } = require('../../models');
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// GET category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { Category } = require('../../models');
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// POST create category
exports.createCategory = async (req, res, next) => {
  try {
    const { Category } = require('../../models');
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const category = await Category.create({
      name,
      description,
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// PUT update category
exports.updateCategory = async (req, res, next) => {
  try {
    const { Category } = require('../../models');
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.update({
      name: name || category.name,
      description: description || category.description,
    });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// DELETE category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { Category } = require('../../models');
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.destroy();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
