const express = require("express");
const { UserAuth } = require("../utils/validations");

const Router  = express.Router();

Router.get("/getConnection", UserAuth, async (req, res) => {
  try {
    res.status(200).send("Connection established");
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

module.exports = Router;