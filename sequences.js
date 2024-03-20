const sequenceModel = require("./models/sequences");

const sequences = {
  category: "category",
  product: "product"
};
const sequenceGet = async (sequenceStr) => {
  try {
    const updatedSequence = await sequenceModel.findOneAndUpdate(
      { sequenceId: 1 },
      { $inc: { [`${sequenceStr}`]: 1 } },
      { new: true } // Returns the updated document
    );

    if (!updatedSequence) {
      throw new Error(`Sequence document not found for sequence: ${sequenceStr}`);
    }

    return updatedSequence[sequenceStr];
  } catch (error) {
    console.error('Error while incrementing sequence:', error);
    throw error; // Rethrow the error to handle it outside this function
  }
};

module.exports = { sequences ,sequenceGet};
