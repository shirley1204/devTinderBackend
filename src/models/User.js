const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender data");
        }
      },
    },
    about: {
      type: String,
      default: "Default Field",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder", {
    expiresIn: "1d",
  }); //field with secret key
  return token;
};

userSchema.methods.checkPassword = async function (inputPasswordByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(inputPasswordByUser, hashPassword)
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
