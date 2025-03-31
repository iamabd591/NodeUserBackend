const connectDb = require("./src/database/dbConnection");
const server = require("./server");
const dotenv = require("dotenv");
 
dotenv.config();

connectDb()
  .then(() => {
    const PORT = process.env.PORT || "4000";
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection failed: ${err.message}`);
  });
