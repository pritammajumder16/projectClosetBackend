const signUp = require("./routes/auth/signUp");
const login = require("./routes/auth/login");
const bodyParser = require("body-parser");
const roleMatrix = require("./routes/auth/roleMatrix");
const categoryRouter = require("./routes/admin/category");
const jwtVerification = require("./jwtVerification");
const allCategoryRouter = require("./routes/admin/allCategories");
const middlewares = function (app) {
  app.use(bodyParser.json());
  //non Verification Routes
  app.use("/auth", signUp);
  app.use("/auth", login);
  app.use("/auth",roleMatrix)
  //verification
  app.use(jwtVerification)
  //verification routes
  app.use("/admin", categoryRouter)
  app.use("/admin",allCategoryRouter)
};
module.exports = middlewares;
