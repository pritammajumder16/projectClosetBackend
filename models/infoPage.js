const mongoose = require("mongoose");

const pageInfo = mongoose.Schema({
    name: {type:String,required:true,unique:true},
    html: {type:String,required:true},
    updatedBy:{type:String},
    updatationTime:{type:Number}
})

const pageInfoModel = mongoose.model("infoPage",pageInfo)
module.exports = pageInfoModel;