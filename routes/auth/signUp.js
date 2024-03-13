const Router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt")
Router.post("/signup", (req, res, next) => {
  const obj = {
    userName: req.body.userName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,password:req.body.password,
    gender: req.body.gender,
    dateOfBirth: req.body.dateOfBirth,
    isActive: true,
    createdTime: new Date().getTime(),
  };
  bcrypt.hash(obj.password,10).then(hash=>{
    obj.password=hash;
    const user = new userModel(obj);
    user.save().then(result=>{
        res.status(200).json(result)
      }).catch(err=>{
        res.status(500).send(err)
      })
  }).catch(err=>{
    res.status(500).send(err)
  })

});

module.exports = Router;
