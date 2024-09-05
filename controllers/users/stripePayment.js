const credentials = require("../../constants/credentials");
const Stripe = require("stripe");
const {
  raiseError,
  sendDataSuccess,
} = require("../../utils/responseFunctions");
const router = require("express").Router();
const stripe = new Stripe(credentials.STRIPE_SECRET_KEY);
router.post("/stripe-create-checkout-session", async (req, res) => {
  try {
    const products = req.body.products;
    const customer = await stripe.customers.create({
      email: req.body.email,
    });

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.productName,
          description: product.description,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer: customer.id,
      success_url: credentials.FRONTEND_ENDPOINT + "payment-success",
      cancel_url: credentials.FRONTEND_ENDPOINT + "payment-cancel",
    });
    return sendDataSuccess(res, { session });
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
