const { Op } = require('sequelize');
const { sequelize } = require('../../config/db');

// GET all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// GET product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// GET products with search, filter and pagination
exports.searchProducts = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const { query, minPrice, maxPrice, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (query) where.name = { [Op.like]: `%${query}%` };
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
    if (category) where.category = category;

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      order: [['id', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// GET product statistics
exports.getProductStats = async (req, res, next) => {
  try {
    const { Product } = require('../../models');

    const totalCount = await Product.count();
    const totalValue = await Product.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'total']],
    });
    const avgPrice = await Product.findAll({
      attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avg']],
    });
    const byCategory = await Product.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
      ],
      group: ['category'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalProducts: totalCount,
        totalValue: totalValue[0].dataValues.total || 0,
        avgPrice: Math.round(avgPrice[0].dataValues.avg || 0),
        byCategory,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST create product
exports.createProduct = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const { name, description, price, quantity, category, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      image,
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT update product
exports.updateProduct = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const { id } = req.params;
    const { name, description, price, quantity, category, image } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      quantity: quantity !== undefined ? quantity : product.quantity,
      category: category || product.category,
      image: image || product.image,
    });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { Product } = require('../../models');
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.destroy();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// GET products with orders info (JOIN приклад)
exports.getProductsWithOrders = async (req, res, next) => {
  try {
    const { Product, Order } = require('../../models');
    
    // Товари разом з інформацією про замовлення (LEFT JOIN)
    const products = await Product.findAll({
      include: [
        {
          model: Order,
          attributes: ['id', 'userId', 'status', 'totalAmount'],
          required: false, // LEFT JOIN
        },
      ],
      order: [['id', 'DESC']],
    });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
