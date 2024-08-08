const unvfdCategoryRouter = require("express").Router();
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const categoryModel = require("../../models/category");

unvfdCategoryRouter.get("/categoryList", async (req, res, next) => {
  try {
    const result = await categoryModel.find({}).sort({ categoryId: 1 });

    if (!result || result.length === 0) {
      return raiseError(res, "No categories found");
    }

    return sendDataSuccess(res, result);
  } catch (error) {
    next(error);
  }
});

module.exports = unvfdCategoryRouter;
