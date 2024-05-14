const connectDB = require("./db/connectDB");
// const userRoute = require("./routes/userRoute");

const express = require("express");
const { Router } = require("./routes/route");

const app = express();

app.use(express.json());

app.use("/api/users", Router);

connectDB().then(() => {
  console.log("database connected");
  app.listen(3000, () => {
    console.log(`Server is running on port ${"3000"}`);
  });
});
