const { sendDataSuccess, raiseError } = require("../../lib");
const roleMatrixModel = require("../../models/roleMatrix");
const userModel = require("../../models/userModel");
const userRoleUpdate = require("express").Router();

userRoleUpdate.get("/updateUsers", async (req, res, next) => {
  const user = req.query;
  console.log(user);
  if (!user.email || !user.roleId || !user.roleName) {
    return lib.raiseError(res, {
      message: "email, role Name and role ID are required",
    });
  }
  const obj = {
    roleId: user.roleId,
    roleName: user.roleName,
    updatedBy: req.headers.requestedby,
    updationTime: new Date().getTime(),
  };
  const result = await userModel.findOneAndUpdate(
    { email: user.email },
    { $set: obj },
    { upsert: false, new: true }
  );
  return sendDataSuccess(res, result);
});
userRoleUpdate.get("/allUsers", async (req, res, next) => {
  if (!req.query.pageSize || !req.query.pageIndex)
    return raiseError(res, {
      message: "Page Size and page Index are required ",
    });
  const pageSize = parseInt(req.query.pageSize);
  const pageIndex = parseInt(req.query.pageIndex);
  const startIndex = (pageIndex - 1) * pageSize;
  const result = await userModel
    .find({})
    .sort({ userName: 1 })
    .skip(startIndex)
    .limit(pageSize);
  const resultCount = await userModel.find({}).count();
  return sendDataSuccess(res, { users: result, count: resultCount });
});

userRoleUpdate.get("/fetchUser", async (req, res, next) => {
  if (!req.query.email) {
    return raiseError(res, { message: "Email ID is required" });
  }
  const email = req.query.email;
  const result = await productModel.findOne({ email });
  return sendDataSuccess(res, result);
});

userRoleUpdate.get("/getRoleMatrix", async (req, res, next) => {
  const result = await roleMatrixModel.find({});
  return sendDataSuccess(res, result);
});
module.exports = userRoleUpdate;
