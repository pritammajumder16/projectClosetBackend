const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    "userName": {type:String, required:true,},
	"email": {type:String, required:true,unique:true},
	"gender":{type:Number, required:true},
	"phoneNumber":{type:Number, required:true},
	"dateOfBirth" :{type:Number, required:true},
	"isActive": {type:Boolean, required:true},
	"createdBy": {type:String},
	"createdTime":{type:Number},
	"updatedBy": {type:String},
	"updatationTime": {type:Number},
	"password": {type:String, required:true}
})


const userModel = mongoose.model("User",userSchema)
module.exports = userModel;