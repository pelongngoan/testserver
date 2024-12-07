const mongoose = require("mongoose");

// Define the job schema
const jobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobType: { type: String, required: [true, "Job Type is required"] },
    location: { type: String, required: [true, "Location is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    vacancies: { type: Number },
    experience: { type: Number, default: 0 },
    detail: [
      {
        desc: { type: String },
        requirements: { type: String },
      },
    ],
    application: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

// Create the Job model
const Jobs = mongoose.model("Jobs", jobSchema);

module.exports = Jobs;
