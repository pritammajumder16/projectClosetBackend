const orderRouter = require("express").Router();
const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const orderModel = require("../../models/orderModel");

orderRouter.get("/getOrders", async (req, res, next) => {
  try {
    if (req.query.email) {
      console.log({ createdBy: req.query.email });
      const finalResult = await orderModel.find({ createdBy: req.query.email });
      return sendDataSuccess(res, finalResult);
    } else if (req.query.pageIndex && req.query.pageSize) {
      const pageIndex = parseInt(req.query.pageIndex);
      const pageSize = parseInt(req.query.pageSize);

      if (isNaN(pageIndex) || isNaN(pageSize)) {
        return raiseError(res, "Invalid pageIndex or pageSize");
      }

      const startIndex = (pageIndex - 1) * pageSize;
      const finalResult = await orderModel
        .find({ status: { $ne: "cancelled" } })
        .skip(startIndex)
        .limit(pageSize);
      const count = await orderModel
        .find({ status: { $ne: "cancelled" } })
        .countDocuments();

      return sendDataSuccess(res, { orders: finalResult, count });
    } else {
      return raiseError(res, "email or pagination parameters are required");
    }
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/orderStatus", async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    if (
      !orderId ||
      !status ||
      !["cancelled", "pending", "shipped", "completed"].includes(status)
    ) {
      return raiseError(res, "Valid order id and status are required");
    }

    const finalResult = await orderModel.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { new: true }
    );

    if (!finalResult) {
      return raiseError(res, "Order not found");
    }

    return sendDataSuccess(res, finalResult);
  } catch (error) {
    next(error);
  }
});

module.exports = orderRouter;
