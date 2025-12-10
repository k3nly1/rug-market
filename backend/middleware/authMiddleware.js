const jwt = require('jsonwebtoken');

// Middleware для перевірки JWT токена
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Токен не знайдено. Будь ласка, авторизуйтесь.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Токен закінчився' });
    }
    return res.status(401).json({ success: false, message: 'Невалідний токен' });
  }
};

// Middleware для перевірки ролі
exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Будь ласка, авторизуйтесь' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Доступ заборонено. Потрібна роль: ${allowedRoles.join(' або ')}`,
      });
    }

    next();
  };
};

// Middleware для адміністраторів
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Авторизація необхідна' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Доступ дозволений тільки адміністраторам' });
  }

  next();
};

// Middleware для звичайних користувачів
exports.requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Авторизація необхідна' });
  }

  next();
};
