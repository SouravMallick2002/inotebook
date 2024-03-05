const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/inotebook', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Online!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectToMongo;
