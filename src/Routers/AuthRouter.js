const express = require("express");
const bcrypt = require("bcrypt");
const { validations, UserAuth } = require("../utils/validations");
const User = require("../models/User");

const Router = express.Router();

//dynamic signup
Router.post("/singUp", async (req, res) => {
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
    res.json({message :"Data Added Successfully.",data : user});
  } catch (err) {
    res.status(400).send("Data not added" + err);
  }
});

//Login Api
Router.post("/login", async (req, res) => {
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
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.status(200).json({message :"Login Successfully" , data : user});
    } else {
      res.status(400).send("Login Failed");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong: " + err);
  }
});

Router.patch("/updatePassword", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findOne({ emailId: loggedInUser.emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = loggedInUser.password === user.password;
    if (!isPasswordValid) {
      throw new Error("Current password is not matched");
    } else {
      const passwordhash = await bcrypt.hash(req.body.password, 10);
      loggedInUser["password"] = passwordhash;
      loggedInUser.save();
      res.send("Password updated successfully");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

Router.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successfully");
});

module.exports = Router;
