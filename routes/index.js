const bodyParser = require("body-parser");
const signUp = require("../controllers/auth/signUp");
const login = require("../controllers/auth/login");
const roleMatrix = require("../controllers/auth/roleMatrix");
const categoryRouter = require("../controllers/admin/category");
const jwtVerification = require("../middlewares/jwtVerification");
const allCategoryRouter = require("../controllers/admin/allCategories");
const productUpload = require("../controllers/admin/product");
const fetchFiles = require("../controllers/admin/fetchFiles");
const userRoleUpdate = require("../controllers/admin/users");
const unvfdCategoryRouter = require("../controllers/unvfd/categoryList");
const productFetcher = require("../controllers/unvfd/productFetch");
const addToCartRouter = require("../controllers/users/cart");
const paymentRouter = require("../controllers/users/paymentGateway");
const orderRouter = require("../controllers/users/orders");
const pageInfoRouter = require("../controllers/admin/productInfo");
const reviewRouter = require("../controllers/users/review");
const stripeRouter = require("../controllers/users/stripePayment");

const routes = function (app) {
  // Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Non-verification Routes
  app.use("/auth", signUp);
  app.use("/auth", login);
  app.use("/auth", roleMatrix);
  app.use("/unvfd", unvfdCategoryRouter);
  app.use("/unvfd", productFetcher);
  app.use("/user", paymentRouter);
  app.use("/user", stripeRouter);

  // Verification Routes
  app.use("/user", jwtVerification, reviewRouter);
  app.use("/user", jwtVerification, addToCartRouter);
  app.use("/user", jwtVerification, orderRouter);

  // Admin Routes (Protected)
  app.use("/admin", jwtVerification);
  app.use("/admin/category", categoryRouter);
  app.use("/admin/allCategories", allCategoryRouter);
  app.use("/admin/productUpload", productUpload);
  app.use("/admin/fetchFiles", fetchFiles);
  app.use("/admin/userRoleUpdate", userRoleUpdate);
  app.use("/admin/pageInfo", pageInfoRouter);

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error("Internal server error:", err.stack);
    res.status(500).send({ message: "An internal server error occurred." });
  });
};

module.exports = routes;
