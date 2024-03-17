const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    categoryId: {type:Number,required:true,unique:true},
    categoryName: {type:String,required:true},
    createdBy:{type:String},
    creationTime:{type:String},
    updatedBy:{type:String},
    updatationTime:{type:String}
})

const categoryModel = mongoose.model("category",categorySchema,"categories")
module.exports = categoryModel;