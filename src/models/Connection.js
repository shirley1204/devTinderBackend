const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
fromUserId:{
    type : mongoose.Schema.Types.ObjectId,
    required:true,
    ref : "User"
},
toUserId:{
    type : mongoose.Schema.Types.ObjectId,
    required:true,
     ref : "User"
},
status:{
    type: String,
    required : true,
    enum :{
        values:["Ignored" ,"Interested" ,"Accepted" ,"Rejected"],
        message:'{VALUE} status is not available', 
    }

}
},{
    timestamps: true
})

connectionSchema.pre('save', async function(){
    const connection = this;
    if(connection.fromUserId.equals(connection.toUserId)){
      throw new Error("Can not send connection request to yourself");
    }
})

//create index
connectionSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionSchema);

module.exports = ConnectionRequest;