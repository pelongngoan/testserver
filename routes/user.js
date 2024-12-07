const express = require("express");
const userAuth = require("../middlewares/auth");
const { getUser, updateUser } = require("../controllers/user");

const router = express.Router();

// GET user by userId (by params)
router.get("/get-user/:userId", userAuth, getUser);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

module.exports = router;
