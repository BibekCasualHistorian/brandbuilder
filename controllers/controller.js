const IndexModel = require("../models/model");
const insertElementAtPosition = require("../utils/insertElementAtPosition");

const addIndex = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) throw Error("Invalid Credentails");
    const isAlreadyExist = await IndexModel.findOne({ email });
    if (isAlreadyExist) throw Error("The email already exists");
    const index = await IndexModel.create({ name, email });
    return res.status(200).json({ status: true, index });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ status: false, error: error.message });
  }
};

const deleteIndex = async (req, res) => {
  try {
    const { toBeDeletedId } = req.body;
    console.log("toBeDeletedId", toBeDeletedId);
    const isAlreadyExist = await IndexModel.findOneAndDelete({
      _id: toBeDeletedId,
    });

    console.log("isAlreadyExist", isAlreadyExist);

    const allIndex = await IndexModel.find({});
    console.log("allIndex", allIndex);

    allIndex.map(async (each, number) => {
      if (each.index == number + 1) {
        return;
      } else if (each.index > number + 1) {
        const updateDocument = await IndexModel.findOneAndUpdate(
          { _id: each.id },
          { index: number + 1 },
          { new: true }
        );
        console.log("updateDocument", updateDocument);
      }
    });

    // change the index of existing documents to the new index

    return res
      .status(200)
      .json({ status: true, message: "Postion delete successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ status: false, error: error.message });
  }
};

const updateIndex = async (req, res) => {
  try {
    const { toBeUpdatedId, newIndex } = req.body;
    let newIndexToBeUpdated = newIndex;
    console.log(toBeUpdatedId, newIndex);
    if (!toBeUpdatedId || !newIndex) {
      throw Error("Invalid Credentails");
    }

    const allDocuments = await IndexModel.find({}).sort({ index: 1 });

    const toBeUpdatedIndex = allDocuments.find((each) => {
      //   console.log("each", each);
      return each.id == toBeUpdatedId;
    });

    if (newIndexToBeUpdated > allDocuments.length) {
      // If newIndex is greater than the number of documents, place it at the end
      newIndexToBeUpdated = allDocuments.length + 1; // Place at the end
      const updatedIndex = await IndexModel.findOneAndUpdate(
        {
          _id: toBeUpdatedId,
        },
        { index: newIndexToBeUpdated },
        {
          new: true,
        }
      );

      const newAllDocuments = await IndexModel.find({}).sort({ index: 1 });

      newAllDocuments.map(async (each, number) => {
        if (each.index == number + 1) {
          return;
        }
        const updateDocument = await IndexModel.findOneAndUpdate(
          { _id: each.id },
          { index: number + 1 },
          { new: true }
        );
      });
      const updateIndex = await IndexModel.findOne({ _id: toBeUpdatedId });

      return res.status(200).json({ status: true, updateIndex });
    } else {
      const udpatedAllDocument = await insertElementAtPosition(
        allDocuments,
        toBeUpdatedIndex,
        newIndex
      );

      udpatedAllDocument.map(async (each) => {
        const update = await IndexModel.findOneAndUpdate(
          { _id: each.id },
          each,
          {
            new: true,
          }
        );
      });

      const newAllDocuments = await IndexModel.find({}).sort({ index: 1 });

      newAllDocuments.map(async (each, number) => {
        if (each.index == number + 1) {
          return;
        }
        const updateDocument = await IndexModel.findOneAndUpdate(
          { _id: each.id },
          { index: number + 1 },
          { new: true }
        );
        console.log("updateDocument", updateDocument);
      });
      const updateIndex = await IndexModel.findOne({ _id: toBeUpdatedId });
      return res.status(200).json({ status: true, updateIndex });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

const getAllIndex = async (req, res) => {
  const allIndex = await IndexModel.find({});
  return res.status(200).json({ status: true, allIndex });
};

module.exports = { addIndex, deleteIndex, getAllIndex, updateIndex };
