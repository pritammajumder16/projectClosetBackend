const router = require("express").Router();
const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");

router.get("/login", async (req, res, next) => {
  try {
    const { email, password } = req.query;

    if (!email) {
      return raiseError(res, { message: "Email is required" });
    }

    if (!password) {
      return raiseError(res, { message: "Password is required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      // Respond with a generic message to avoid giving hints
      return raiseError(res, { message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Respond with a generic message to avoid giving hints
      return raiseError(res, { message: "Invalid email or password" });
    }

    const payload = { username: user.username, email: user.email };
    const authToken =
      "Bearer " +
      jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

    return sendDataSuccess(res, {
      authToken,
      userName: user.username,
      email: user.email,
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

router.get("/silentLogin", (req, res, next) => {
  try {
    const { username, email } = req.query;

    if (!username || !email) {
      return raiseError(res, { message: "Username and Email are required" });
    }

    const payload = { username, email };
    const authToken =
      "Bearer " +
      jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" });

    return sendDataSuccess(res, {
      authToken,
      userName: username,
      email: email,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
