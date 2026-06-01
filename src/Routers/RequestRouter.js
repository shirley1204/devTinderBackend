const express = require("express");
const { UserAuth } = require("../utils/validations");
const ConnectionRequest = require("../models/Connection");
const User = require("../models/User");

const Router = express.Router();

Router.post("/request/send/:status/:toUserId", UserAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const statusAllowed = ["Ignored", "Interested"];
    if (!statusAllowed.includes(status)) {
      throw new Error("status type is Invalid");
    }
    //Check toUserId valid or not
    const isToUserIdvalid = await User.findById(toUserId);
    if (!isToUserIdvalid) {
      throw new Error("Enter valid request id");
    }
    //Check for existing Connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnectionRequest) {
      res.status(400).send({
        message: "Connection Request already exist",
      });
    }
    const requestData = await new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    }).save();
    res.status(200).send("Connection Request send successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;
