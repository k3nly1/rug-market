const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Генерувати JWT токен
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

// РЕЄСТРАЦІЯ користувача
exports.register = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const { email, firstName, lastName, password, role = 'user' } = req.body;

    // Валідація
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Усі поля обов\'язкові: email, firstName, lastName, password',
      });
    }

    // Перевірити чи користувач існує
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Користувач з цією електронною адресою вже існує',
      });
    }

    // Хешувати пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Створити користувача
    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role,
    });

    // Згенерувати токен
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Реєстрація успішна',
      token,
      user: {
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

// ЛОГІН користувача
exports.login = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const { email, password } = req.body;

    // Валідація
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email та пароль обов\'язкові',
      });
    }

    // Знайти користувача
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Невалідні облікові дані (користувач не знайдено)',
      });
    }

    // Перевірити пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Невалідні облікові дані (неправильний пароль)',
      });
    }

    // Згенерувати токен
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Логін успішний',
      token,
      user: {
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

// ОТРИМАТИ ПРОФІЛЬ ПОТОЧНОГО КОРИСТУВАЧА
exports.getProfile = async (req, res, next) => {
  try {
    const { User } = require('../models');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Авторизація необхідна' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувач не знайдено' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ЗМІНИТИ ПАРОЛЬ
exports.changePassword = async (req, res, next) => {
  try {
    const { User } = require('../models');
    const { oldPassword, newPassword } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Авторизація необхідна' });
    }

    // Валідація
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Старий та новий паролі обов\'язкові',
      });
    }

    // Знайти користувача
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Користувач не знайдено' });
    }

    // Перевірити старий пароль
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Старий пароль невірний',
      });
    }

    // Хешувати новий пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Оновити пароль
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Пароль успішно змінено',
    });
  } catch (err) {
    next(err);
  }
};

// ВИХІД (на фронтенді просто видаліть токен)
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Вихід успішний. Видаліть токен зі сховища браузера.',
  });
};
