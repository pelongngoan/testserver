const express = require("express");
const userAuth = require("../middlewares/auth");
const {
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  updateJob,
} = require("../controllers/job");

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POSTS
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

module.exports = router;
