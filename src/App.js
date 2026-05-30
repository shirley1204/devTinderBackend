const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const { validations, UserAuth } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

app.use(express.json()); //json niddleware
app.use(cookies()); //cookie middleware

//dybamic signup
app.post("/singUp", async (req, res) => {
  const { firstName, lastName, password, emailId, age, gender } = req.body;
  try {
    await validations(req.body);
    const passwordhash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      password: passwordhash,
    });
    await user.save();
    res.send("Data Added Successfully.");
  } catch (err) {
    res.status(400).send("Data not added" + err);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.checkPassword(password);
    if (isPasswordValid) {
      const token = await user.getToken();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      res.status(200).send("Login Successfully");
    } else {
      res.status(400).send("Login Failed");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

//get User data
app.get("/getUser", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    console.log(user);
    if (!user) {
      res.status(502).send("Data not found");
    } else {
      res.send("Data fetched Successfully");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//delete record
app.delete("/delete", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ lastName: req.body.lastName });
    res.send("Data deleted Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

app.patch("/update", async (req, res) => {
  const allowUpdates = ["gender", "age", "userId"];
  try {
    isAllowedUpdates = Object.keys(req.body).every((k) =>
      allowUpdates.includes(k),
    );
    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(req.body.userId, req.body, {
      runValidators: true,
    });
    res.send("Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

app.get("/profile", UserAuth, async (req, res) => {
  try {
    res.status(200).send("Profile data" + req.user);
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

app.get("/getConnection", UserAuth, async (req, res) => {
  try {
    res.status(200).send("Connection established");
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});
