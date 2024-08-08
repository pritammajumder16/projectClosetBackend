const addToCartRouter = require("express").Router();
const { sendDataSuccess, raiseError } = require("../../lib");
const productModel = require("../../models/product");
const userModel = require("../../models/userModel");
addToCartRouter.post("/addToCart", async (req, res, next) => {
  if (
    !req.body.productId ||
    !req.body.quantity ||
    !req.body.price ||
    !req.body.size
  ) {
    raiseError(res, "productId, quantity, price and size are required");
  }
  const obj = {
    $push: {
      cart: {
        productId: req.body.productId,
        quantity: req.body.quantity,
        price: req.body.price * req.body.quantity + 100,
      },
    },
  };
  const findObj = { email: req.headers.requestedby };
  const result = await userModel.findOneAndUpdate(findObj, obj);
  return sendDataSuccess(res, result);
});
addToCartRouter.get("/getCart", async (req, res, next) => {
  const findObj = { email: req.query.email };
  const { cart } = await userModel.findOne(findObj);
  const productIds = [];
  const hashMap = {};
  if (cart && cart.length > 0) {
    cart.forEach((cartItem) => {
      if (cartItem.productId) {
        if (!hashMap[parseInt(cartItem.productId)])
          hashMap[parseInt(cartItem.productId)] = cartItem.quantity;
        else {
          hashMap[parseInt(cartItem.productId)] += cartItem.quantity;
        }
        productIds.push(parseInt(cartItem.productId));
      }
    });
  }
  const products = await productModel.find({ productId: { $in: productIds } });
  const finalResult = [];
  if (products && products.length > 0) {
    products.forEach((product) => {
      const quantity = hashMap[product.productId];
      const obj = JSON.parse(JSON.stringify(product));
      obj.quantity = quantity;
      obj.totalPrice = quantity * parseFloat(obj.price);
      finalResult.push(obj);
    });
  }
  return sendDataSuccess(res, finalResult);
});
module.exports = addToCartRouter;
