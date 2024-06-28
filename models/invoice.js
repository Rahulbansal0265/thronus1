const mongoose = require("mongoose");

const invoice = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  invoice: {
    type: String,
  },
  imageType: {
    type: Number,
    enum: [0,1,2], // 0=other , 1=image , 2=pdf
    default:0,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 not-verified , 1 verified
    default:0
  },
},
{ timestamps: true });
module.exports = new mongoose.model("invoice", invoice);
