const addToCartRouter = require("express").Router();
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const productModel = require("../../models/product");
const userModel = require("../../models/userModel");

addToCartRouter.post("/addToCart", async (req, res, next) => {
  const { productId, quantity, price, size } = req.body;

  if (!productId || !quantity || !price || !size) {
    return raiseError(res, "productId, quantity, price, and size are required");
  }

  const cartItem = {
    productId,
    quantity,
    price: price * quantity + 100,
    size,
  };

  try {
    const findObj = { email: req.headers.requestedby };
    const result = await userModel.findOneAndUpdate(
      findObj,
      { $push: { cart: cartItem } },
      { new: true }
    );

    if (!result) {
      return raiseError(res, "User not found");
    }

    return sendDataSuccess(res, result);
  } catch (error) {
    next(error);
  }
});
addToCartRouter.get("/getCart", async (req, res, next) => {
  try {
    const findObj = { email: req.query.email };
    const user = await userModel.findOne(findObj);

    if (!user) {
      return raiseError(res, "User not found");
    }

    const cart = user.cart || [];
    const productIds = [];
    const hashMap = {};

    cart.forEach((cartItem) => {
      const productId = parseInt(cartItem.productId);
      if (productId) {
        hashMap[productId] = (hashMap[productId] || 0) + cartItem.quantity;
        productIds.push(productId);
      }
    });

    const products = await productModel.find({
      productId: { $in: productIds },
    });
    const finalResult = products.map((product) => {
      const quantity = hashMap[product.productId];
      return {
        ...product.toObject(),
        quantity,
        totalPrice: quantity * parseFloat(product.price),
      };
    });

    return sendDataSuccess(res, finalResult);
  } catch (error) {
    next(error);
  }
});
module.exports = addToCartRouter;
