const express = require("express");
const { UserAuth } = require("../utils/validations");

const Router = express.Router();

Router.get("/profile", UserAuth, async (req, res) => {
  try {
    res.status(200).send("Profile data" + req.user);
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

Router.patch("/profile/edit", UserAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const allowUpdates = ["gender", "age", "userId", "firstName", "lastName"];
    const isAllowedUpdates = Object.keys(req.body).every((k) =>
      allowUpdates.includes(k),
    );
    if (!isAllowedUpdates) {
      throw new Error("Update not allowed");
    } else {
      await Object.keys(req.body).forEach((key) =>(loggedInUser[key] = req.body[key]));
      await loggedInUser.save();
      res.send("User Updated Successfully");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;
