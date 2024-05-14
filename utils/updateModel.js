const Model = require("../models/model");

const allIndex = await Model.find({});

allIndex.map(async (each, number) => {
  if (each.index == number + 1) {
    return;
  }
  const updateDocument = await Model.findOneAndUpdate(
    { _id: each.id },
    { index: number + 1 },
    { new: true }
  );
  console.log("updateDocument", updateDocument);
});

module.exports = {};
