const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    "userName": {type:String, required:true,},
	"email": {type:String, required:true,unique:true},
	"gender":{type:String},
	"dateOfBirth" :{type:Number},
	"isActive": {type:Boolean, required:true},
	"createdBy": {type:String},
	"createdTime":{type:Number},
	"updatedBy": {type:String},
	"updatationTime": {type:Number},
	"roleId":{type:Number, required:true},
	"roleName":{type:String, required:true},
	"password": {type:String, required:true},
	"cart":{type:Array,required:false},
	"lastOrder":{type:Object,required:false}
})


const userModel = mongoose.model("User",userSchema)
module.exports = userModel;