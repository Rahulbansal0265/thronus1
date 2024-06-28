const mongoose = require("mongoose");

const cms = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  type: {
    type: Number,
    enum: [1, 2, 3], // 0 = admin, 1 = doctor 2 = pentient
    required: true,
  },

  status: {
    type: Number,
    enum: [0, 1], // 0 not-verified , 1 verified
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true }
);
module.exports = new mongoose.model("cms", cms);
