const express = require("express");
const { UserAuth } = require("../utils/validations");
const ConnectionRequest = require("../models/Connection");

const Router = express.Router();

Router.get("/user/request/recieved", UserAuth, async (req, res) => {
  try {
    const LoggedInuser = req.user._id;
    const getConnections = await ConnectionRequest.find({
      toUserId: LoggedInuser,
      status: "Interested",
    }).populate("fromUserId", "firstName lastName");
    res.json({
      message: "data fetched successfully",
      data: getConnections,
    });
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

Router.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const LoggedInuser = req.user._id;
    const getConnections = await ConnectionRequest.find({
     $or: [{ toUserId: LoggedInuser ,status :"Accepted"},
      { fromUserId: LoggedInuser,status:"Accepted"}]}
    ).populate("fromUserId", "firstName lastName").populate("toUserId", "firstName lastName");

    res.json({
      message: "data fetched successfully",
      data: getConnections,
    });
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;
