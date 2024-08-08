const reviewRouter = require("express").Router();
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const productModel = require("../../models/product");

reviewRouter.post("/postReview", async (req, res, next) => {
  try {
    const { rating, productId, review = "" } = req.body;
    if (!rating || !productId) {
      return raiseError(res, "Rating and product Id are required");
    }

    const parsedProductId = parseInt(productId.toString());
    const product = await productModel.findOne({ productId: parsedProductId });

    if (!product) {
      return raiseError(res, "Product not found");
    }

    const reviewLength = product.reviews?.length || 0;
    const previousRatings =
      product.reviews?.reduce((acc, review) => acc + review.rating, 0) || 0;

    const newRating = (rating + previousRatings) / (reviewLength + 1);

    const updateObj = {
      $set: { rating: newRating },
      $push: {
        reviews: {
          rating: rating,
          text: review,
          createdBy: req.headers.requestedby,
          reviewOn: new Date().getTime(),
        },
      },
    };

    const finalResult = await productModel.updateOne(
      { productId: parsedProductId },
      updateObj
    );

    return sendDataSuccess(res, finalResult);
  } catch (error) {
    next(error);
  }
});

module.exports = reviewRouter;
