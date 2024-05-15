const mongoose = require("mongoose");

const IndexSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      // unique: true,
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
