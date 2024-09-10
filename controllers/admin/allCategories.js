const allCategoryRouter = require("express").Router();
const lib = require("../../utils/responseFunctions");
const categoryModel = require("../../models/category");

// Route to fetch all categories with pagination
allCategoryRouter.get("/", async (req, res, next) => {
  try {
    const { pageSize, pageIndex } = req.query;

    // Validate query parameters
    if (!pageSize || !pageIndex) {
      return lib.raiseError(res, {
        message: "Page Size and Page Index are required",
      });
    }

    const parsedPageSize = parseInt(pageSize);
    const parsedPageIndex = parseInt(pageIndex);

    if (isNaN(parsedPageSize) || isNaN(parsedPageIndex)) {
      return lib.raiseError(res, {
        message: "Page Size and Page Index must be numbers",
      });
    }

    const startIndex = (parsedPageIndex - 1) * parsedPageSize;

    // Fetch categories with pagination
    const categories = await categoryModel
      .find({})
      .sort({ categoryId: 1 })
      .skip(startIndex)
      .limit(parsedPageSize);

    // Get total count of categories
    const totalCount = await categoryModel.countDocuments({});

    return lib.sendDataSuccess(res, { categories, count: totalCount });
  } catch (error) {
    console.error("Error in /allCategories route:", error.message);
    return lib.raiseError(res, {
      message: "An error occurred while fetching categories",
      error: error.message,
    });
  }
});

module.exports = allCategoryRouter;
