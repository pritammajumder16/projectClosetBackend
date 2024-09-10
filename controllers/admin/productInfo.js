const {
  raiseError,
  sendDataSuccess,
} = require("../../utils/responseFunctions");
const pageInfoModel = require("../../models/infoPage");

const pageInfoRouter = require("express").Router();

pageInfoRouter.post("/", async (req, res, next) => {
  try {
    const { html, name } = req.body;

    if (!html || !name) {
      return raiseError(res, {
        message: "name and html are required",
      });
    }

    const obj = {
      name,
      html,
      updatedBy: req.headers.requestedby || "system", // Default to 'system' if no header provided
      updatationTime: new Date().getTime(),
    };

    const result = await pageInfoModel.findOneAndUpdate(
      { name },
      { $set: obj },
      { upsert: true, new: true } // `new: true` returns the updated document
    );

    return sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error updating page info:", error.message);
    return raiseError(res, {
      message: "Failed to update page info",
      error: error.message,
    });
  }
});

pageInfoRouter.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;

    if (name) {
      const result = await pageInfoModel.findOne({ name });
      if (!result) {
        return raiseError(res, { message: "Page info not found" });
      }
      return sendDataSuccess(res, result);
    }

    const result = await pageInfoModel.find({});
    return sendDataSuccess(res, result);
  } catch (error) {
    console.error("Error fetching page info:", error.message);
    return raiseError(res, {
      message: "Failed to fetch page info",
      error: error.message,
    });
  }
});

module.exports = pageInfoRouter;
