const { raiseError, sendDataSuccess } = require("../../lib");

const fetchFiles = require("express").Router();
fetchFiles.get("/fetchFiles", async (req, res, next) => {
  if (!req.query.files)
    return raiseError(res, {
      message: "files is required",
    });
  const files = JSON.parse(req.query.files);
  console.log(files);

  return sendDataSuccess(res, { message: "Wait ok" });
});
module.exports = fetchFiles;

``;
