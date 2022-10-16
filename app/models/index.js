const mongoose = require('mongoose');
const LiqudityProvider = require('./LiqudityProvider');


async function dbConnection(db_url) {
  await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log('Database connection established');
    })
    .catch((err) => {
      console.error('Database connection error', err);
      process.exit();
    });
}


module.exports = {
  dbConnection,
  LiqudityProvider
};