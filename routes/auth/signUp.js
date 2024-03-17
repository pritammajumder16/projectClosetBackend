const Router = require("express").Router();
const userModel = require("../../models/userModel");
const bcrypt = require("bcrypt");
const {USER,USER_ROLE_ID} = require("../../constants")
const lib = require("../../lib")
Router.post("/signup", (req, res, next) => {
  const obj = {
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    isActive: true,
    roleId:USER_ROLE_ID,
    roleName:USER,
    createdTime: new Date().getTime(),
  };
  console.log(obj);
  bcrypt
    .hash(obj.password, 10)
    .then((hash) => {
      obj.password = hash;
      const user = new userModel(obj);
      user
        .save()
        .then((result) => {
          return lib.sendDataSuccess(res,result)
        })
        .catch((err) => {
          if(err.code==11000)
          return lib.sendDataSuccess(res,{emailExists:true},1,false)
          return lib.raiseError(res,err)
        });
    })
    .catch((err) => {
      return lib.raiseError(res,err)
    });
});

module.exports = Router;
