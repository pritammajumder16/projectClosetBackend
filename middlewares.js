const signUp = require("./routes/auth/signUp");
const login = require("./routes/auth/login");
const bodyParser = require("body-parser");
const middlewares = function (app) {
  app.use(bodyParser.json());
  app.use("/auth", signUp);
  app.use("/auth", login);
};
module.exports = middlewares;
