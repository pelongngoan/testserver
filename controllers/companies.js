const mongoose = require("mongoose");
const Companies = require("../models/companiesModel");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    next("Company Name is required!");
    return;
  }
  if (!email) {
    next("Email address is required!");
    return;
  }
  if (!password) {
    next("Password is required and must be greater than 6 characters");
    return;
  }

  try {
    const accountExist = await Companies.findOne({ email });

    if (accountExist) {
      next("Email Already Registered. Please Login");
      return;
    }

    const company = await Companies.create({ name, email, password });
    const token = company.createJWT();

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next("Please Provide A User Credentials");
    return;
  }

  try {
    const company = await Companies.findOne({ email }).select("+password");
    if (!company || !(await company.comparePassword(password))) {
      next("Invalid email or Password");
      return;
    }

    company.password = "";
    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: company,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  if (!name || !contact || !location || !profileUrl || !about) {
    next("Please Provide All Required Fields");
    return;
  }

  try {
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).send(`No Company with id: ${id}`);
      return;
    }

    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };
    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    if (!company) return;

    const token = company.createJWT();
    company.password = "";

    res.status(200).json({
      success: true,
      message: "Company Profile Updated Successfully",
      company,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    const company = await Companies.findById({ _id: id });

    if (!company) {
      res.status(200).send({ message: "Company Not Found", success: false });
      return;
    }

    company.password = "";
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;
    const queryObject = {};

    if (search) queryObject.name = { $regex: search, $options: "i" };
    if (location) queryObject.location = { $regex: location, $options: "i" };

    let queryResult = Companies.find(queryObject).select("-password");

    if (sort) {
      const sortOptions = {
        Newest: "-createdAt",
        Oldest: "createdAt",
        "A-Z": "name",
        "Z-A": "-name",
      };
      queryResult = queryResult.sort(sortOptions[sort]);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Companies.countDocuments(queryResult);
    queryResult = queryResult.skip(skip).limit(limit);

    const companies = await queryResult;

    res
      .status(200)
      .json({
        success: true,
        total,
        data: companies,
        page,
        numOfPage: Math.ceil(total / limit),
      });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    const queryObject = {};
    if (search) queryObject.location = { $regex: search, $options: "i" };

    const sortingOptions = {
      Newest: "-createdAt",
      Oldest: "createdAt",
      "A-Z": "name",
      "Z-A": "-name",
    };

    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sortingOptions[sort] },
    });

    res.status(200).json({ success: true, companies: company });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: "-_id" },
    });

    if (!company) {
      res.status(200).send({ message: "Company Not Found", success: false });
      return;
    }

    company.password = "";
    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  register,
  signIn,
  updateCompanyProfile,
  getCompanyProfile,
  getCompanies,
  getCompanyJobListing,
  getCompanyById,
};
