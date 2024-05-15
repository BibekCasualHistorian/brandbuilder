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
        await IndexModel.findOneAndUpdate(
          { _id: each.id },
          { index: number + 1 },
          { new: true }
        );
      }
    });

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

    console.log("toBeUpdated", toBeUpdatedId, newIndex);

    if (!toBeUpdatedId || !newIndex) {
      throw Error("Invalid Credentails");
    }

    const allDocuments = await IndexModel.find({}).sort({ index: 1 });

    console.log("allDocuments", allDocuments);

    const toBeUpdatedIndex = allDocuments.findIndex(
      (each) => each.id == toBeUpdatedId
    );

    const splittedArray = allDocuments[toBeUpdatedIndex];

    if (newIndex >= allDocuments.length) {
      const newlyArrangedArray = allDocuments.filter(
        (each) => each.id !== toBeUpdatedId
      );
      console.log("before pushing newlyArranged", newlyArrangedArray);
      newlyArrangedArray.push(splittedArray);
      console.log("after pushing newlyArrangedArray", newlyArrangedArray);
      await newlyArrangedArray.map(async (each, number) => {
        console.log("each", each);
        each.index = number + 1;
        await IndexModel.findOneAndUpdate(
          { _id: each._id },
          { index: each.index },
          {
            new: true,
          }
        );
        // }
      });
      return res.status(200).json({ status: true });
    } else {
      const updatedAllDocument = await insertElementAtPosition(
        allDocuments,
        toBeUpdatedIndex,
        newIndex - 1
      );

      console.log("updatedAllDocument", updatedAllDocument);

      updatedAllDocument.map(async (each, number) => {
        each.index = number + 1;
        const updatedDocument = await IndexModel.findOneAndUpdate(
          { _id: each.id },
          { index: number + 1 },
          { new: true }
        );
        console.log("updatedDocument", updatedDocument);
      });

      const newAllDocuments = await IndexModel.find({}).sort({ index: 1 });

      console.log("newAllDocuments", newAllDocuments);

      return res.status(200).json({ status: true });
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
