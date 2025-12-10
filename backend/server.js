require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', routes);

// 404 handler + general error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    if (process.env.DB_SYNC === 'true') {
      // In development you can enable `DB_SYNC=true` to auto-sync models.
      await sequelize.sync({ alter: true });
      console.log('Database synced (alter).');
    }

    app.listen(PORT, () => {
      console.log(`Backend server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server — database connection failed:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
