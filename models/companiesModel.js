const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

// Define the company schema
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: true,
    },
    contact: { type: String },
    location: { type: String },
    about: { type: String },
    profileUrl: { type: String },
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
companySchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Method to create JWT
companySchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Create the Company model
const Companies = mongoose.model("Companies", companySchema);

module.exports = Companies;
