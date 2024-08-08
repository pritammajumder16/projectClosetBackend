const codes = {
  1: 200, //OK
  2: 404, //resource not found
  3: 500, //internal server error
};
const raiseError = (res, data) => {
  return res.status(500).json({ success: false, data });
};
const sendDataSuccess = (res, data, code = 1, success = true) => {
  return res.status(codes[code]).json({ success, data });
};
module.exports = {
  raiseError,
  sendDataSuccess,
};
