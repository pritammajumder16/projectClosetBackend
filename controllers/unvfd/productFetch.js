const productFetcher = require("express").Router();
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const productModel = require("../../models/product");

productFetcher.get("/fetchProducts", async (req, res, next) => {
  try {
    if (req.query.productId) {
      const productId = parseInt(req.query.productId);
      if (isNaN(productId)) {
        return raiseError(res, { message: "Invalid productId" });
      }
      const result = await productModel.findOne({ productId });
      return sendDataSuccess(res, result || []);
    }

    if (!req.query.pageSize || !req.query.pageIndex) {
      return raiseError(res, {
        message: "Page Size and Page Index are required",
      });
    }

    const pageSize = parseInt(req.query.pageSize);
    const pageIndex = parseInt(req.query.pageIndex);

    if (isNaN(pageSize) || isNaN(pageIndex)) {
      return raiseError(res, {
        message: "Invalid pageSize or pageIndex",
      });
    }

    const startIndex = (pageIndex - 1) * pageSize;
    const findObj = {};

    // Category Filter
    if (req.query.categoryFilter) {
      const filter = JSON.parse(req.query.categoryFilter);
      const categoryIds = Object.keys(filter)
        .filter((categoryId) => filter[categoryId])
        .map((categoryId) => parseInt(categoryId));
      if (categoryIds.length > 0) {
        findObj.categoryId = { $in: categoryIds };
      }
    }

    // Size Filter
    if (req.query.sizeFilter) {
      const filter = JSON.parse(req.query.sizeFilter);
      const sizes = Object.keys(filter).filter((size) => filter[size]);
      if (sizes.length > 0) {
        findObj.size = { $in: sizes };
      }
    }

    // Price Filter
    if (
      req.query.hasOwnProperty("priceFilterS1") ||
      req.query.hasOwnProperty("priceFilterS2")
    ) {
      findObj.price = {};
      if (req.query.hasOwnProperty("priceFilterS1")) {
        findObj.price.$gte = parseFloat(req.query.priceFilterS1);
      }
      if (req.query.hasOwnProperty("priceFilterS2")) {
        findObj.price.$lte = parseFloat(req.query.priceFilterS2);
      }
    }

    // Search Text
    if (req.query.searchText) {
      const regex = new RegExp(req.query.searchText, "i");
      findObj.$or = [{ productName: regex }, { categoryName: regex }];
    }

    // Fetching products with pagination and filters
    const products = await productModel
      .find(findObj)
      .sort({ productId: 1 })
      .skip(startIndex)
      .limit(pageSize);
    const count = await productModel.find(findObj).countDocuments();

    return sendDataSuccess(res, { products, count });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

module.exports = productFetcher;
