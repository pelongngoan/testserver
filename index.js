const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const dbConnection = require("./config/config.js");
const router = require("./routes/index.js");
const errorMiddleware = require("./middlewares/error.js");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

// MONGODB CONNECTION
dbConnection();

// Middlewares
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(router);

// Error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});
