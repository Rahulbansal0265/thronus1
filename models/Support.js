const mongoose = require("mongoose");

const Support = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 not-verified , 1 verified
    default:0
  },
},
{ timestamps: true });
const SupportSchema = mongoose.model("Support", Support);
module.exports = SupportSchema;
