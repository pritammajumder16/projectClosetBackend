const unvfdCategoryRouter = require("express").Router();
const lib = require("../../lib");
const categoryModel = require("../../models/category");
unvfdCategoryRouter.get("/categoryList", async (req, res, next) => {
  
  const result = await categoryModel.find({}).sort({categoryId:1})
  return lib.sendDataSuccess(res, result);
});
module.exports = unvfdCategoryRouter;
