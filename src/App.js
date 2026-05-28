const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();

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

//dybamic signup
app.post("/singUp", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Data Added Successfully.");
  } catch (err) {
    res.status(400).send("Data not added" + err);
  }
});

//get User data
app.get("/getUser", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    console.log(user);
    if (!user) {
      res.status(502).send("Data not found");
    } else {
      res.send("Data fetched Successfully");
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//delete record
app.delete("/delete", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ lastName: req.body.lastName });
    res.send("Data deleted Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

app.patch("/update", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId,req.body,{runValidators:true});
    res.send("Data Updated Successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
