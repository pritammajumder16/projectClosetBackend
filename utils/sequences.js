const sequenceModel = require("../models/sequences");

const sequences = {
  category: "category",
  product: "product",
};

const sequenceGet = async (sequenceStr) => {
  try {
    // Validate that the sequenceStr is one of the predefined sequences
    if (!Object.values(sequences).includes(sequenceStr)) {
      throw new Error(`Invalid sequence string: ${sequenceStr}`);
    }

    const updatedSequence = await sequenceModel.findOneAndUpdate(
      { sequenceId: 1 },
      { $inc: { [sequenceStr]: 1 } },
      { new: true } // Returns the updated document
    );

    if (!updatedSequence) {
      throw new Error(
        `Sequence document not found for sequence: ${sequenceStr}`
      );
    }

    return updatedSequence[sequenceStr];
  } catch (error) {
    console.error("Error while incrementing sequence:", error.message);
    throw new Error(`Failed to increment sequence: ${error.message}`);
  }
};

module.exports = { sequences, sequenceGet };
