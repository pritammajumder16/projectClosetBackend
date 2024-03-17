const categoryRouter = require("express").Router();
const lib = require("../../lib");
const categoryModel = require("../../models/category");
const { sequences, sequenceGet } = require("../../sequences");
categoryRouter.get("/category", async (req, res, next) => {
  if (!req.query.categoryName) {
    return lib.raiseError(res, { message: "Category Name is required" });
  }
  let obj = {}
  console.log(req.query)
  if (!req.query.categoryId) {
    const id = await sequenceGet(sequences.category)
    obj = {
        categoryId: id,
      categoryName: req.query.categoryName,
      createdBy: req.headers.requestedby,
      creationTime: new Date().getTime(),
    };
  } else {
    obj = {
      categoryId: parseInt(req.query.categoryId),
      categoryName: req.query.categoryName,
      updatedBy: req.headers.requestedby,
      updationTime: new Date().getTime(),
    };
  }
  console.log(obj)
  const result = await categoryModel.findOneAndUpdate({categoryId:obj.categoryId},{$set:obj},{upsert:true});
  return lib.sendDataSuccess(res,obj)
});

categoryRouter.post("/categoryDelete", async (req, res, next) => {
  if (!req.body.categoryId) {
    return lib.raiseError(res,{message:"Category ID required"})
  }
  const result = await categoryModel.deleteOne({categoryId:req.body.categoryId});
  return lib.sendDataSuccess(res,result)
});
module.exports = categoryRouter;
