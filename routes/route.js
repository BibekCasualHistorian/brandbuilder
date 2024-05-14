const express = require("express");
const {
  addIndex,
  deleteIndex,
  getAllIndex,
  updateIndex,
} = require("../controllers/controller");

const Router = express.Router();

Router.post("/create", addIndex);

Router.delete("/delete", deleteIndex);

Router.patch("/update", updateIndex);

Router.get("/get", getAllIndex);

module.exports = { Router };
