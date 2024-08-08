const allCategoryRouter = require("express").Router();
const lib = require("../../lib");
const categoryModel = require("../../models/category");
allCategoryRouter.get("/allCategories", async (req, res, next) => {
  if (!req.query.pageSize || !req.query.pageIndex)
    return lib.raiseError(res, {
      message: "Page Size and page Index are required ",
    });
  const pageSize = parseInt(req.query.pageSize);
  const pageIndex = parseInt(req.query.pageIndex);
  const startIndex = (pageIndex - 1) * pageSize;
  const result = await categoryModel
    .find({})
    .sort({ categoryId: 1 })
    .skip(startIndex)
    .limit(pageSize);
  const resultCount = await categoryModel.find({}).count();
  return lib.sendDataSuccess(res, { categories: result, count: resultCount });
});
module.exports = allCategoryRouter;
