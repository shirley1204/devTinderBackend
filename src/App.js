const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();

connectDB()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(3000, () => {
      console.log("server is created1");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/singUp", async (req, res) => {
  const user = new User({
    firstName: "Jills",
    lastName: "Butti",
    emailId: "Jills@gmail.com",
    password: "abasssc@11",
    age: 12,
    gender: "Female",
  });
  try {
    await user.save();
    res.send("Data Added Successfully.");
  } catch (err) {
    res.status(400).send("Data not added" + err)
  }
});
