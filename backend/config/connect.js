const mongoose = require('mongoose');

const connectionOfDb = () => {
  mongoose
    .connect("mongodb+srv://chandrasoodanchandrasoodan021:soodan@cluster0.5eojp.mongodb.net/")
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      throw new Error(`Could not connect to MongoDB: ${err}`);
    });
};

module.exports = connectionOfDb;