// GET all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { User } = require('../../models');
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// GET user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { User } = require('../../models');
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// POST create user
exports.createUser = async (req, res, next) => {
  try {
    const { User } = require('../../models');
    const { email, firstName, lastName, password, role } = req.body;
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const user = await User.create({
      email,
      firstName,
      lastName,
      password, // у реальному коді потрібно хешувати пароль!
      role: role || 'user',
    });
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT update user
exports.updateUser = async (req, res, next) => {
  try {
    const { User } = require('../../models');
    const { id } = req.params;
    const { email, firstName, lastName, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.update({
      email: email || user.email,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      role: role || user.role,
    });
    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE user
exports.deleteUser = async (req, res, next) => {
  try {
    const { User } = require('../../models');
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
