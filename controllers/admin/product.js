const {
  sendDataSuccess,
  raiseError,
} = require("../../utils/responseFunctions");
const productUpload = require("express").Router();
const multer = require("multer");
const productModel = require("../../models/product");
const { sequenceGet, sequences } = require("../../utils/sequences");

// Set up storage and file handling for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Prefix filename with timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// Route to handle product upload and creation/updation
productUpload.post(
  "/productUpload",
  upload.array("files"),
  async (req, res, next) => {
    try {
      const product = JSON.parse(req.body.product);
      if (
        !product.productName ||
        !product.price ||
        !product.size ||
        !product.productImages ||
        !product.categoryId ||
        !product.categoryName
      ) {
        return raiseError(res, {
          message:
            "Product name, category Id, category name, price, size, and images are required",
        });
      }

      const obj = {
        productName: product.productName,
        price: product.price,
        size: product.size,
        description: product.description,
        productImages: product.productImages,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        ...(product.productId
          ? {
              productId: parseInt(product.productId),
              updatedBy: req.headers.requestedby || "system",
              updationTime: new Date().getTime(),
            }
          : {
              productId: await sequenceGet(sequences.product),
              createdBy: req.headers.requestedby || "system",
              creationTime: new Date().getTime(),
            }),
      };

      const result = await productModel.findOneAndUpdate(
        { productId: obj.productId },
        { $set: obj },
        { upsert: true, new: true } // Return the updated document
      );

      return sendDataSuccess(res, result);
    } catch (error) {
      console.error("Error in productUpload:", error.message);
      return raiseError(res, {
        message: "Failed to upload product",
        error: error.message,
      });
    }
  }
);

// Route to fetch all products with pagination
productUpload.get("/allProducts", async (req, res, next) => {
  try {
    const { pageSize, pageIndex } = req.query;
    if (!pageSize || !pageIndex) {
      return raiseError(res, {
        message: "Page Size and Page Index are required",
      });
    }

    const pageSizeNum = parseInt(pageSize);
    const pageIndexNum = parseInt(pageIndex);
    const startIndex = (pageIndexNum - 1) * pageSizeNum;

    const result = await productModel
      .find({})
      .sort({ productId: 1 })
      .skip(startIndex)
      .limit(pageSizeNum);

    const resultCount = await productModel.countDocuments({});

    return sendDataSuccess(res, { products: result, count: resultCount });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return raiseError(res, {
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// Route to delete a product
productUpload.post("/productDelete", async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return raiseError(res, { message: "Product ID is required" });
    }

    const result = await productModel.deleteOne({ productId });
    return sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return raiseError(res, {
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// Route to fetch a single product by ID
productUpload.get("/fetchProduct", async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return raiseError(res, { message: "Product ID is required" });
    }

    const result = await productModel.findOne({ productId });
    if (!result) {
      return raiseError(res, { message: "Product not found" });
    }

    return sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return raiseError(res, {
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

module.exports = productUpload;
