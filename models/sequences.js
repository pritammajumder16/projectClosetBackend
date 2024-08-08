const mongoose = require("mongoose");

const sequencesSchema = mongoose.Schema({
  category: Number,
  sequenceId: Number,
  product: Number,
});

const sequenceModel = mongoose.model("sequence", sequencesSchema, "sequences");
module.exports = sequenceModel;
