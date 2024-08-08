const {
  raiseError,
  sendDataSuccess,
} = require("../../utils/responseFunctions");

const fetchFiles = require("express").Router();

fetchFiles.get("/fetchFiles", async (req, res, next) => {
  try {
    // Check if 'files' query parameter is present
    if (!req.query.files) {
      return raiseError(res, {
        message: "Files parameter is required",
      });
    }

    // Parse 'files' query parameter and handle potential JSON parsing errors
    let files;
    try {
      files = JSON.parse(req.query.files);
    } catch (error) {
      return raiseError(res, {
        message: "Failed to parse 'files' parameter",
        error: error.message,
      });
    }

    // Perform any necessary processing with 'files' here

    // Respond with success message
    return sendDataSuccess(res, {
      message: "Files received successfully",
      files,
    });
  } catch (error) {
    console.error("Error in fetchFiles:", error.message);
    return raiseError(res, {
      message: "An error occurred while fetching files",
      error: error.message,
    });
  }
});

module.exports = fetchFiles;
