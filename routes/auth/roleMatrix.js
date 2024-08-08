const Router = require("express").Router();
const { raiseError, sendDataSuccess } = require("../../lib");
const userModel = require("../../models/userModel");
Router.get("/rolematrix", (req, res, next) => {
  console.log(req.query.email);
  if (!req.query.email) {
    return raiseError(res, {
      message: "Email is required in query parameters",
    });
  }
  userModel
    .findOne({ email: req.query.email })
    .then((val) => {
      return sendDataSuccess(res, {
        email: val.email,
        roleId: val.roleId,
        roleName: val.roleName,
      });
    })
    .catch((err) => {
      return raiseError(res, err);
    });
});
module.exports = Router;
