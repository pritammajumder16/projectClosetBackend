const Router = require("express").Router();
const bcrypt = require("bcrypt");
const userModel = require("../../models/userModel");
const { USER, USER_ROLE_ID } = require("../../constants/constants");
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");

Router.post("/signup", async (req, res, next) => {
  try {
    const { userName, email, password, gender, dateOfBirth } = req.body;

    // Validate required fields
    if (!userName || !email || !password) {
      return raiseError(res, {
        message: "Username, email, and password are required",
      });
    }

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return sendDataSuccess(res, { emailExists: true }, 1, false);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object
    const user = new userModel({
      userName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      isActive: true,
      roleId: USER_ROLE_ID,
      roleName: USER,
      cart: [],
      createdTime: new Date().getTime(),
    });

    // Save the user to the database
    const result = await user.save();

    // Send success response
    return sendDataSuccess(res, result);
  } catch (err) {
    if (err.code === 11000) {
      return sendDataSuccess(res, { emailExists: true }, 1, false);
    }
    return raiseError(res, {
      message: "An error occurred during signup",
      error: err.message || err,
    });
  }
});

module.exports = Router;
