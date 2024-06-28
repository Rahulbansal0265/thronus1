const mongoose = require("mongoose");

const constant = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "message",
    default: null,
  }
},
{ timestamps: true }
);
module.exports = new mongoose.model("constant", constant);

