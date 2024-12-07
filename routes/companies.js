const express = require("express");
const { rateLimit } = require("express-rate-limit");
const userAuth = require("../middlewares/auth");
const { signIn } = require("../controllers/auth");
const {
  getCompanyProfile,
  getCompanyJobListing,
  getCompanies,
  getCompanyById,
  updateCompanyProfile,
  register,
} = require("../controllers/companies");

const router = express.Router();

// IP rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// REGISTER
router.post("/register", limiter, register);

// LOGIN
router.post("/login", limiter, signIn);

// GET DATA
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.post("/get-company-joblisting", userAuth, getCompanyJobListing);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// UPDATE DATA
router.put("/update-company", userAuth, updateCompanyProfile);

module.exports = router;
