const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    orderId: {type:String,required:true,unique:true},
    products: {type:Array,required:true},
    totalAmount:{type:Number,required:true},
    createdBy:{type:String,required:true},
    status:{type:String,required:true},
    shippingAddress:{type:String,required:true},
    creationTime:{type:Number},
    updatedBy:{type:String},
    updatationTime:{type:Number},
})

const orderModel = mongoose.model("order",orderSchema)
module.exports = orderModel;