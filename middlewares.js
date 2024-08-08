const signUp = require("./routes/auth/signUp");
const login = require("./routes/auth/login");
const bodyParser = require("body-parser");
const roleMatrix = require("./routes/auth/roleMatrix");
const categoryRouter = require("./routes/admin/category");
const jwtVerification = require("./jwtVerification");
const allCategoryRouter = require("./routes/admin/allCategories");
const productUpload = require("./routes/admin/product");
const fetchFiles = require("./routes/admin/fetchFiles");
const userRoleUpdate = require("./routes/admin/users");
const unvfdCategoryRouter = require("./routes/unvfd/categoryList");
const productFetcher = require("./routes/unvfd/productFetch");
const addToCartRouter = require("./routes/users/cart");
const paymentRouter = require("./routes/users/paymentGateway");
const orderRouter = require("./routes/users/orders");
const pageInfoRouter = require("./routes/admin/productInfo");
const reviewRouter = require("./routes/users/review");

const middlewares = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  //non Verification Routes
  app.use("/auth", signUp);
  app.use("/auth", login);
  app.use("/auth", roleMatrix);
  app.use("/unvfd", unvfdCategoryRouter);
  app.use("/unvfd", productFetcher);
  app.use("/user", paymentRouter);
  //verification routes
  app.use("/user", jwtVerification, reviewRouter);
  app.use("/user", jwtVerification, addToCartRouter);
  app.use("/user", jwtVerification, orderRouter);
  app.use("/admin", jwtVerification, categoryRouter);
  app.use("/admin", jwtVerification, allCategoryRouter);
  app.use("/admin", jwtVerification, pageInfoRouter);
  app.use("/admin", jwtVerification, productUpload);
  app.use("/admin", jwtVerification, fetchFiles);
  app.use("/admin", jwtVerification, userRoleUpdate);
};
module.exports = middlewares;
