const express = require("express");

const authRoute = require("./auth");
const userRoute = require("./user");
const companyRoute = require("./companies");
const jobRoute = require("./job");

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); // api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}jobs`, jobRoute);

module.exports = router;
