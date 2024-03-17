const sequenceModel = require("./models/sequences");

const sequences = {
  category: "category",
};
const sequenceGet = async (sequenceStr) => {
    const str = `${sequences[sequenceStr]}`
   const val =await sequenceModel.findOneAndUpdate({ sequenceId: 1 }, { $inc:{"category":1} })
   return val[sequences[sequenceStr]];
};

module.exports = { sequences ,sequenceGet};
