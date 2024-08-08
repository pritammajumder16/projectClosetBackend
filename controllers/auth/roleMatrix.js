const Router = require("express").Router();
const {
  raiseError,
  sendDataSuccess,
} = require("../../utils/responseFunctions");
const userModel = require("../../models/userModel");

Router.get("/rolematrix", async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return raiseError(res, {
        message: "Email is required in query parameters",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return raiseError(res, {
        message: "User not found",
      });
    }

    return sendDataSuccess(res, {
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
    });
  } catch (err) {
    return raiseError(res, {
      message: "An error occurred while fetching the role matrix",
      error: err.message || err,
    });
  }
});

module.exports = Router;
