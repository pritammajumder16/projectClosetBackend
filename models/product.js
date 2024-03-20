const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  productName: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  size: { type: Array, required: true },
  productImages: { type: Array, required: true },
  createdBy: { type: String },
  creationTime: { type: String },
  categoryId:{type:Number,required:true},
  categoryName:{type:String,required:true},
  updatedBy: { type: String },
  updatationTime: { type: String },
});

const productModel = mongoose.model("products", productSchema, "products");
module.exports = productModel;
