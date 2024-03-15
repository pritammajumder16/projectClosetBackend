const router = require("express").Router()
const userModel = require("../../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/login",(req,res,next)=>{console.log(req.query)
    userModel.findOne({email:req.query.email}).then(user=>{
        if(!user)
        res.status(200).json({"success":false,data:{email:0}})
        console.log(user,req.query.email)
        bcrypt.compare(req.query.password,user.password).then(bool=>{
            if(bool){
                const obj = {username:user.username,email:user.email}
                const authToken = "Bearer "+jwt.sign(obj,process.env.SECRET_KEY,{expiresIn:"24h"})
                res.status(200).json({success:true,data:{authToken,userName:user.userName,email:user.email}})
            }else{
                res.status(200).json({"success":false,data:{password:0}})

            }
        })
    })

})
router.get("/silentLogin",(req,res,next)=>{
    const obj = {username:req.query.username,email:req.query.email}
    const authToken = "Bearer "+jwt.sign(obj,process.env.SECRET_KEY,{expiresIn:"24h"})
    res.status(200).json({success:true,data:{authToken,userName:user.userName,email:user.email}})
})

module.exports = router;