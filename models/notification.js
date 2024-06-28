const mongoose = require("mongoose");

const notification = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  }, //blocked users
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  }, // blocked by
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor_prescription",
  }, 
  image: {
    type: String,
    default: "",
  },
  imageType: {
    type: Number,
    enum: [0,1,2], // 0=other , 1=image , 2=pdf
    default:1,
  },
  message: {
    type: String,
  },
  type: {
    type: Number,
    enum: [0,1,2,3,4,5], // 0 not-verified , 1 verified
    default:0
  },
},
{ timestamps: true });
module.exports = new mongoose.model("notification", notification);
