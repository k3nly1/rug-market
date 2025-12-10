require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { sequelize } = require('./models');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', routes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    if (process.env.DB_SYNC === 'true') {
      
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
