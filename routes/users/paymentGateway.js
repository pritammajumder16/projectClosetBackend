const paymentRouter = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
function generateSHA256Hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex"); // Output hash value as a hexadecimal string
}
const { raiseError, sendDataSuccess } = require("../../lib");
const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");

const generateOrderId = () => {
  const timestamp = new Date().getTime().toString();
  const randomString = Math.random().toString(36).slice(2, 7);
  return timestamp + randomString;
};
paymentRouter.post("/initiatePayment", async function (req, res, next) {
  if (!req.body.amount || !req.body.email || !req.body.shippingAddress)
    raiseError(res, { message: "Amount and email & address is required" });
  const orderId = generateOrderId();
  //   console.log(orderId)
  let normalPayLoad = {
    merchantId: process.env.PAYTM_MERCHANT_ID,
    merchantTransactionId: orderId,
    merchantUserId: req.headers.requestedby,
    amount: req.body.amount,
    redirectUrl: process.env.PAYTM_REDIRECT_URL,
    redirectMode: "POST",
    callbackUrl: process.env.PAYTM_REDIRECT_URL,
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  console.log(req.body);
  await userModel.findOneAndUpdate(
    { email: req.headers.requestedby },
    {
      $set: {
        lastOrder: {
          orderId,
          products: req.body.products,
          amount: req.body.amount,
          shippingAddress: req.body.shippingAddress,
        },
      },
    }
  );
  let saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  let saltIndex = 1;
  let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
  let base64String = bufferObj.toString("base64");
  let string = base64String + "/pg/v1/pay" + saltKey;
  let sha256_val = generateSHA256Hash(string);
  let checksum = sha256_val + "###" + saltIndex;
  axios
    .post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      {
        request: base64String,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      //   console.log("response", response.data.data.instrumentResponse.redirectInfo.url,req.body.orderId);
      return sendDataSuccess(
        res,
        response.data.data.instrumentResponse.redirectInfo.url
      );
    })
    .catch(function (error) {
      return raiseError(res, error);
    });
});

paymentRouter.post("/redirectUrl", async function (req, res) {
  // console.log("here", req.body)
  if (
    req.body.code == "PAYMENT_SUCCESS" &&
    req.body.merchantId &&
    req.body.transactionId &&
    req.body.providerReferenceId
  ) {
    if (!(req.body.merchantId == process.env.PAYTM_MERCHANT_ID))
      return raiseError(res, { message: "merchant id must match" });

    const user = await userModel.findOne({
      "lastOrder.orderId": req.body.transactionId,
    });
    if (!user) {
      return raiseError(res, { message: "wrong transaction id" });
    }
    0;
    if (user.lastOrder.amount != req.body.amount) {
      return raiseError(res, { message: "Amount manipulated" });
    }
    if (req.body.transactionId) {
      let saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
      let saltIndex = 1;
      let surl =
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/PGTESTPAYUAT/" +
        req.body.transactionId;
      let string =
        "/pg/v1/status/PGTESTPAYUAT/" + req.body.transactionId + saltKey;
      let sha256_val = generateSHA256Hash(string);
      let checksum = sha256_val + "###" + saltIndex;
      axios
        .get(surl, {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": req.body.transactionId,
            accept: "application/json",
          },
        })
        .then(async function (response) {
          console.log({ email: user.email }, { $set: { cart: [] } });
          userModel
            .updateOne({ email: user.email }, { $set: { cart: [] } })
            .then((result) => {
              console.log("Update successful:", result);
            })
            .catch((error) => {
              console.error("Update failed:", error);
            });
          const obj = {
            orderId: req.body.transactionId,
            products: user.lastOrder.products,
            totalAmount: parseFloat(req.body.amount.toString()),
            status: "pending",
            createdBy: user.email,
            creationTime: new Date().getTime(),
            shippingAddress: user.lastOrder.shippingAddress,
          };
          const order = new orderModel(obj);
          order.save();
          return res.redirect("http://localhost:4200/orders");
        })
        .catch(function (error) {
          return raiseError(res, error);
        });
    } else {
      return raiseError(res, { message: "Transaction Cancelled" });
    }
  } else {
    return raiseError(res, { message: "Data manipulated" });
  }
});
module.exports = paymentRouter;
