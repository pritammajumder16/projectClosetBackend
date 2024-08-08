const jwt = require("jsonwebtoken");
const { raiseError } = require("../utils/responseFunctions");

module.exports = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    if (!req.headers.authorization) {
      return raiseError(res, "No Authorization Header Present");
    }

    const authToken = req.headers.authorization.split(" ")[1];
    if (!authToken) {
      return raiseError(res, "Authorization token missing");
    }

    const decodedToken = jwt.verify(authToken, process.env.SECRET_KEY);

    if (!decodedToken) {
      return raiseError(res, "Invalid Authorization token");
    }

    req.userData = decodedToken;

    next();
  } catch (error) {
    return raiseError(res, "Authorization failed: " + error.message);
  }
};