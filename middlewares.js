const signUp = require("./routes/auth/signUp");
const bodyParser = require("body-parser");
const middlewares = function (app) {
  app.use(bodyParser.json());
  app.use("/auth/signUp", signUp);
};
module.exports = middlewares;
