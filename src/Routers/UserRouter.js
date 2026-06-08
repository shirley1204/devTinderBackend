const express = require("express");
const { UserAuth } = require("../utils/validations");
const ConnectionRequest = require("../models/Connection");
const User = require("../models/User");

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
    const LoggedInuser = req?.user._id;
    const getConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: LoggedInuser, status: "Accepted" },
        { fromUserId: LoggedInuser, status: "Accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age gender about _id")
      .populate("toUserId", "firstName lastName age gender about _id");
    
    
     const data = getConnections.map((row) => {
      if (row?.fromUserId._id.toString() === LoggedInuser.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

Router.get("/feed", UserAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) ||10;
    const skip = (page -1) * limit;
    const LoggedInuser = req.user._id;
    const getConnections = await ConnectionRequest.find({
      $or: [{ toUserId: LoggedInuser }, { fromUserId: LoggedInuser }],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName");

    const blockedUser = new Set();
    getConnections.forEach((item) => {
      blockedUser.add(item.toUserId);
      blockedUser.add(item.fromUserId);
    });

    console.log("blockedUser",blockedUser)

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockedUser) } },
        {
          _id: { $ne: LoggedInuser },
        },
      ],
    }).select("firstName lastName").skip(skip).limit(limit);

    res.json({
      message: "data fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;
