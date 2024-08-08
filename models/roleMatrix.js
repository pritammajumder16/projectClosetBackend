const mongoose = require("mongoose");

const roleMatrixSchema = mongoose.Schema({
  roleId: Number,
  roleName: String,
  isActive: Boolean,
});

const roleMatrixModel = mongoose.model(
  "roleMatrix",
  roleMatrixSchema,
  "roleMatrix"
);
module.exports = roleMatrixModel;
