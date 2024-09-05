const credentials = require("../../constants/credentials");
const Stripe = require("stripe");
const {
  raiseError,
  sendDataSuccess,
} = require("../../utils/responseFunctions");
const router = require("express").Router();
const stripe = new Stripe(credentials.STRIPE_SECRET_KEY);
const calculateAmount = require("../../utils/calculateAmount");
router.post("/stripe-create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateAmount(req.body.products),
      currency: "inr",
    });
    console.log(paymentIntent.client_secret);
    return sendDataSuccess(res, { clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("error", error);
    return raiseError(res, error);
  }
});
router.post("/stripe-webhook", (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // Handle successful payment
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return sendDataSuccess(res, {});
  } catch (error) {
    return raiseError(res, error);
  }
});
module.exports = router;
