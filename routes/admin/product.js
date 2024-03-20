const { sendDataSuccess, raiseError } = require("../../lib");
const productUpload = require("express").Router();
const multer = require("multer");
const productModel = require("../../models/product");
const { sequenceGet, sequences } = require("../../sequences");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Customize the filename here
    console.log(file)
    cb(null, file.originalname); // Example: timestamp-originalname
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, //2mb
  },
});
productUpload.post(
  "/productUpload",
  upload.array("files"),
  async (req, res, next) => {
    const product = JSON.parse(req.body.product);
    console.log(product)
    if (
      !product.productName ||
      !product.price ||
      !product.size ||
      !product.productImages||
      !product.categoryId ||
      !product.categoryName
    ) {
      return lib.raiseError(res, {
        message: "Product name, category Id, category name, price, size, images are required",
      });
    }
    let obj = {
      productName: product.productName,
      price: product.price,
      size: product.size,
      description:product.description,
      productImages: product.productImages,
      categoryId:product.categoryId,
      categoryName:product.categoryName
    };
    if (!product.productId) {
      const id = await sequenceGet(sequences.product);
      obj= {...obj,
        productId: id,
        createdBy: req.headers.requestedby,
        creationTime: new Date().getTime(),
      };
    } else {
      obj = {...obj,
        productId: parseInt(product.productId),
        updatedBy: req.headers.requestedby,
        updationTime: new Date().getTime(),
      };
    }
    console.log(obj)
    const result = await productModel.findOneAndUpdate({productId:obj.productId},{$set:obj},{upsert:true});
    return sendDataSuccess(res,obj)
  }
);
productUpload.get("/allProducts", async (req, res, next) => {
    if (!req.query.pageSize || !req.query.pageIndex)
      return raiseError(res, {
        message: "Page Size and page Index are required ",
      });
    const pageSize = parseInt(req.query.pageSize);
    const pageIndex = parseInt(req.query.pageIndex);
    const startIndex = (pageIndex - 1) * pageSize;
    const result = await productModel.find({}).sort({productId:1}).skip(startIndex).limit(pageSize);
    const resultCount = await productModel.find({}).count();
    return sendDataSuccess(res, {products:result,count:resultCount});
  });

  productUpload.post("/productDelete", async (req, res, next) => {
    if (!req.body.productId) {
      return raiseError(res,{message:"Product ID required"})
    }
    const result = await productModel.deleteOne({productId:req.body.productId});
    return sendDataSuccess(res,result)
  });
  productUpload.get("/fetchProduct", async(req,res,next)=>{
    if(!req.query.productId){
        return raiseError(res,{message:"Product ID is required"})
    }
    console.log("query req", req.query)
    const productId= req.query.productId;
    const result = await productModel.findOne({productId})
    return sendDataSuccess(res,result)
  })
module.exports = productUpload;
