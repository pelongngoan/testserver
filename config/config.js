const mongoose = require("mongoose");

const dbConnection = () => {
  console.log(process.env.MONGODB_URL);

  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error: ", err));
};

module.exports = dbConnection;
