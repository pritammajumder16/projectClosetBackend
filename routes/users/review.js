const reviewRouter = require("express").Router();
const { sendDataSuccess, raiseError } = require("../../lib");
const productModel = require("../../models/product");
reviewRouter.post("/postReview", async (req, res, next) => {
  if (!req.body.rating || !req.body.productId) {
    raiseError(res, "Rating and product Id required");
  }
  const productId = parseInt(req.body.productId.toString());
  const product = productModel.findOne({ productId });
  let review = "";
  if (req.body.review) {
    review = req.body.review;
  }
  let reviewLength = 0;
  if (product.reviews && product.reviews.length > 0) {
    reviewLength = product.reviews.length;
  }
  let productRating = 0;
  let previousRatings = 0;
  product.reviews?.forEach((review) => {
    previousRatings += review.rating;
  });
  const rating = (req.body.rating + previousRatings) / (reviewLength + 1);

  const obj = {
    $set: { rating: rating },
    $push: {
      reviews: {
        rating: req.body.rating,
        text: review,
        createdBy: req.headers.requestedby,
        reviewOn: new Date().getTime(),
      },
    },
  };
  console.log(obj, { productId });
  const finalResult = await productModel.updateOne({ productId }, obj);
  sendDataSuccess(res, finalResult);
});
module.exports = reviewRouter;
