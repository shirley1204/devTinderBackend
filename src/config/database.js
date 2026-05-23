const mongoose = require("mongoose");

const connectDB = async () => {
 await mongoose.connect("connection url")
}

module.exports = connectDB