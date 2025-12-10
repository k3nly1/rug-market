require('dotenv').config();
const { sequelize } = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection failed:');
    console.error(err.message || err);
    process.exit(1);
  }
}

testConnection();
