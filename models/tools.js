const mongoose = require("mongoose");

const tools = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: Number,
    enum: [1, 2, 3], // 1 = patient_booklet, 2 = monography & Practical guide, 3 = thronus education
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true }
);
module.exports = new mongoose.model("tools", tools);
