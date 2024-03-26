const { raiseError, sendDataSuccess } = require("../../lib");
const pageInfoModel = require("../../models/infoPage");

const pageInfoRouter = require("express").Router();

pageInfoRouter.post("/pageInfo", async (req, res, next) => {
  if (!req.body.html || !req.body.name)
    return raiseError(res, {
      message: "name and html are required ",
    });
    const obj = {
        name:req.body.name,
        html:req.body.html,
        updatedBy:req.headers.requestedby,
        updatationTime:new Date().getTime()
    }
  const result = await pageInfoModel.findOneAndUpdate({name:req.body.name},{$set:obj},{upsert:true})
  return sendDataSuccess(res, result);
});
pageInfoRouter.get("/pageInfo", async (req, res, next) => {
    let obj = {}
    if(req.query.name){
        obj.name = req.query.name
    }
    const result = await pageInfoModel.find(obj)
    return sendDataSuccess(res, result);
  });
module.exports = pageInfoRouter;
