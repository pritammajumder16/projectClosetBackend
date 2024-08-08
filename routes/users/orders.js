const orderRouter = require("express").Router();
const { sendDataSuccess, raiseError } = require("../../lib");
const orderModel = require("../../models/orderModel");
orderRouter.get("/getOrders", async (req, res, next) => {
  if (req.query.email) {
    const finalResult = await orderModel.find({ createdBy: req.query.email });
    return sendDataSuccess(res, finalResult);
  } else if (req.query.pageIndex && req.query.pageSize) {
    const startIndex =
      parseInt(req.query.pageIndex - 1) * parseInt(req.query.pageSize);
    const finalResult = await orderModel
      .find({ status: { $ne: "cancelled" } })
      .skip(startIndex)
      .limit(parseInt(req.query.pageSize));
    const count = await orderModel
      .find({ status: { $ne: "cancelled" } })
      .count();
    return sendDataSuccess(res, { orders: finalResult, count });
  }
  return raiseError(res, "email is required");
});

orderRouter.post("/orderStatus", async (req, res, next) => {
  if (
    req.body.orderId &&
    req.body.status &&
    ["cancelled", "pending", "shipped", "completed"].includes(req.body.status)
  ) {
    console.log({ orderId: req.body.orderId });
    const finalResult = await orderModel.findOneAndUpdate(
      { orderId: req.body.orderId },
      { $set: { status: req.body.status } }
    );
    return sendDataSuccess(res, finalResult);
  }

  return raiseError(res, "order id and status are required");
});
module.exports = orderRouter;
