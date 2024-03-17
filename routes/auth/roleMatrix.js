const Router = require("express").Router();
const lib = require("../../lib");
const userModel = require("../../models/userModel");
Router.get("/rolematrix",(req,res,next)=>{
    console.log(req.query.email)
    if(!req.query.email){
        return lib.raiseError(res,{message:"Email is required in query parameters"})
    }
    userModel.findOne({email:req.query.email}).then((val)=>{
        return lib.sendDataSuccess(res,{email:val.email,roleId:val.roleId,roleName:val.roleName})
    })
    .catch(err=>{
        return lib.raiseError(res,err)
    })
})
module.exports= Router