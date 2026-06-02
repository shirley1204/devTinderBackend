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

Router.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const statusAllowed = ["Accepted", "Rejected"];
      if (!statusAllowed.includes(status)) {
        throw new Error("status type is Invalid");
      }
      //Check requestId valid or not
      const isToUserIdvalid = await ConnectionRequest.findById(requestId);
      if (!isToUserIdvalid) {
        throw new Error("Enter valid request id");
      }
      const getConnection = await ConnectionRequest.findOne({
        _id: requestId,
        status: "Interested",
        toUserId: loggedInUser,
      });

      if (!getConnection) {
        res.status(400).json({
          message: "Request Not found",
        });
      }
      getConnection.status = status;
      await getConnection.save();
      res.status(200).send("Connection Request status changed successfully");
    } catch (err) {
      res.status(400).send("Something Went Wrong" + err);
    }
  },
);

module.exports = Router;
