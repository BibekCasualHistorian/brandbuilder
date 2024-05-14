const mongoose = require("mongoose");

const IndexSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      //   unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

IndexSchema.pre("save", async function (next) {
  if (!this.index) {
    this.index = await getNextIndex();
  }
  next();
});

IndexSchema.pre(
  "remove",
  { document: true, query: false },
  async function (next) {
    const deletedIndex = this.index;
    await updateIndexesAfterDelete(deletedIndex);
    next();
  }
);

async function updateIndexesAfterDelete(deletedIndex) {
  const Index = mongoose.model("position", IndexSchema);
  await Index.updateMany(
    { index: { $gt: deletedIndex } },
    { $inc: { index: -1 } }
  );
}

async function getNextIndex() {
  const Index = mongoose.model("index", IndexSchema);
  const highestIndexIndex = await Index.findOne(
    {},
    {},
    { sort: { index: -1 } }
  );
  const nextIndex = highestIndexIndex ? highestIndexIndex.index + 1 : 1;
  return nextIndex;
}

const IndexModel = mongoose.model("index", IndexSchema);
module.exports = IndexModel;
