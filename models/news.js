const mongoose = require("mongoose");

const news = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 not-verified , 1 verified
    default:0
  },
},
{ timestamps: true });
module.exports = new mongoose.model("news", news);
