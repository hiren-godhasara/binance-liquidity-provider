const mongoose = require('mongoose');


async function dbConnection(db_url) {
  await mongoose
    .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log('Database connected successfully')
    })
    .catch((err) => {
      console.error('Database Connection error', err);
      process.exit();
    });
}


module.exports = {
    dbConnection,
};