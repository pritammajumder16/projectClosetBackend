const categoryRouter = require("express").Router();
const lib = require("../../utils/responseFunctions");
const categoryModel = require("../../models/category");
const { sequences, sequenceGet } = require("../../utils/sequences");

// Route to create or update a category
categoryRouter.get("/category", async (req, res, next) => {
  try {
    const { categoryName, categoryId } = req.query;

    if (!categoryName) {
      return lib.raiseError(res, { message: "Category Name is required" });
    }

    let obj = {};

    if (!categoryId) {
      // Generate new category ID
      const id = await sequenceGet(sequences.category);
      obj = {
        categoryId: id,
        categoryName,
        createdBy: req.headers.requestedby,
        creationTime: new Date().getTime(),
      };
    } else {
      obj = {
        categoryId: parseInt(categoryId),
        categoryName,
        updatedBy: req.headers.requestedby,
        updationTime: new Date().getTime(),
      };
    }

    // Update or create the category
    const result = await categoryModel.findOneAndUpdate(
      { categoryId: obj.categoryId },
      { $set: obj },
      { upsert: true, new: true } // Return the updated document
    );

    return lib.sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error in /category route:", error.message);
    return lib.raiseError(res, {
      message: "An error occurred while updating category",
      error: error.message,
    });
  }
});

// Route to delete a category
categoryRouter.post("/categoryDelete", async (req, res, next) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return lib.raiseError(res, { message: "Category ID required" });
    }

    // Delete the category
    const result = await categoryModel.deleteOne({ categoryId });
    return lib.sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error in /categoryDelete route:", error.message);
    return lib.raiseError(res, {
      message: "An error occurred while deleting category",
      error: error.message,
    });
  }
});

module.exports = categoryRouter;
