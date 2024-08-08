const router = require("express").Router();
const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendDataSuccess, raiseError } = require("../../lib");

router.get("/login", (req, res, next) => {
  console.log(req.query);
  if (!req.query.email)
    return raiseError(res, { message: "Email is required" });
  userModel.findOne({ email: req.query.email }).then((user) => {
    if (!user) return sendDataSuccess(res, { email: 0 }, 1, false);
    bcrypt.compare(req.query.password, user.password).then((bool) => {
      if (bool) {
        const obj = { username: user.username, email: user.email };
        const authToken =
          "Bearer " +
          jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: "24h" });
        return sendDataSuccess(res, {
          authToken,
          userName: user.userName,
          email: user.email,
        });
      } else {
        return sendDataSuccess(res, { password: 0 }, 1, false);
      }
    });
  });
});
router.get("/silentLogin", (req, res, next) => {
  const obj = { username: req.query.username, email: req.query.email };
  const authToken =
    "Bearer " + jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: "24h" });
  return sendDataSuccess(res, {
    authToken,
    userName: user.userName,
    email: user.email,
  });
});

module.exports = router;
