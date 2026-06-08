const express = require("express");
const { UserAuth } = require("../utils/validations");

const Router = express.Router();

Router.get("/profile", UserAuth, async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ message: "Profile data", data: req.user });
    } else {
      res.status(400).json({ message: "Please Login", data: null });
    }
  } catch (err) {
    res.status(401).send("Something Went Wrong" + err);
  }
});

Router.patch("/profile/edit", UserAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const allowUpdates = ["gender", "age", "userId", "firstName", "lastName","about"];
    const isAllowedUpdates = Object.keys(req.body).every((k) =>
      allowUpdates.includes(k),
    );
    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    } else {
      await Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );
      await loggedInUser.save();
      res.json({message:"User Updated Successfully",data:loggedInUser });
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;
