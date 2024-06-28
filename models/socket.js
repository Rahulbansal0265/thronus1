const mongoose = require("mongoose");

const socket = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  sockeId: {
    type: String,
  },
  type: {
    type: Number,
    enum: [0,1, 2, 3], // 0=admin, 1=subadmin, 2=patient, 3=doctor
    required: true,
  }
},
{ timestamps: true }
);
module.exports = new mongoose.model("socket", socket);

