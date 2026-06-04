const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function validations(value) {
  const { firstName, lastName, emailId } = value;
  if (!firstName || !lastName) {
    throw new Error("Name should be Valid");
  } else if (firstName.length > 50 || firstName.length < 4) {
    throw new Error("Name should be between length 4to50");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter Valid email id");
  }
}

async function UserAuth(req, res, next) {
  try {
    const token = await req.cookies.token;
    if (!token) {
     res.status(401).send("Please Login")
    } else {
      const decodedId = await jwt.verify(token, "Dev@Tinder");
      const user = await User.findById(decodedId);
      if (!user) {
        throw new Error("User Not found");
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
}

module.exports = { validations, UserAuth };
