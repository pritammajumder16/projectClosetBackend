const productFetcher = require("express").Router();
const { sendDataSuccess, raiseError } = require("../../lib");
const productModel = require("../../models/product");
productFetcher.get("/fetchProducts", async (req, res, next) => {
  if (req.query.productId) {
    const result = await productModel.findOne({
      productId: parseInt(req.query.productId),
    });
    return sendDataSuccess(res, result);
  }
  if (!req.query.pageSize || !req.query.pageIndex)
    return raiseError(res, {
      message: "Page Size and page Index are required ",
    });
  console.log(req.query);
  const pageSize = parseInt(req.query.pageSize);
  const pageIndex = parseInt(req.query.pageIndex);
  const startIndex = (pageIndex - 1) * pageSize;
  const findObj = {};
  if (req.query.categoryFilter) {
    const filter = JSON.parse(req.query.categoryFilter);
    findObj.categoryId = { $in: [] };
    Object.keys(filter).forEach((categoryId) => {
      if (filter[categoryId] == true) {
        findObj.categoryId.$in.push(parseInt(categoryId));
      }
    });
    if (findObj.categoryId.$in.length <= 0) {
      delete findObj.categoryId;
    }
  }
  if (req.query.sizeFilter) {
    const filter = JSON.parse(req.query.sizeFilter);
    findObj.size = { $in: [] };
    Object.keys(filter).forEach((size) => {
      if (filter[size] == true) {
        findObj.size.$in.push(size);
      }
    });
    if (findObj.size.$in.length <= 0) {
      delete findObj.size;
    }
  }
  if (req.query.hasOwnProperty("priceFilterS1")) {
    findObj.$and = [{}];
    findObj.$and[0].price = { $gte: parseFloat(req.query.priceFilterS1) };
  }

  if (req.query.hasOwnProperty("priceFilterS2")) {
    findObj.$and.push({});

    findObj.$and[1].price = { $lte: parseFloat(req.query.priceFilterS2) };
  }
  if (req.query.searchText) {
    findObj.$or = [
      { productName: new RegExp(req.query.searchText, "i") },
      { categoryName: new RegExp(req.query.searchText, "i") },
    ];
  }

  console.log(findObj);
  const result = await productModel
    .find(findObj)
    .sort({ productId: 1 })
    .skip(startIndex)
    .limit(pageSize);
  const resultCount = await productModel.find(findObj).count();
  return sendDataSuccess(res, { products: result, count: resultCount });
});
module.exports = productFetcher;
