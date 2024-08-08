const jwt = require("jsonwebtoken");
const { raiseError } = require("./lib");
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    return raiseError(res, { message: "No Authorization Header Present" });
  }
  const authToken = req.headers.authorization.split(" ")[1];
  const bool = jwt.verify(authToken, process.env.SECRET_KEY);
  if (bool) {
    return next();
  }
  return raiseError(res, { message: "Wrong Authorization token" });
};
