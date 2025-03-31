const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to database\n");
  } catch (error) {
    console.log(`Unable to connect to database: ${error.message}\n`);
    process.exit(1);
  }
};

module.exports = connectDb;
