const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const { validations, UserAuth } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();

connectDB()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(3000, () => {
      console.log("server is created1");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json()); //json niddleware
app.use(cookies()); //cookie middleware

const AuthRouter = require("./Routers/AuthRouter");
const Profilerouter = require("./Routers/ProfileRouter");
const RequestRouter = require("./Routers/RequestRouter");

app.use("/", AuthRouter);
app.use("/", Profilerouter);
app.use("/", RequestRouter);
