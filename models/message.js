const mongoose = require('mongoose');

const message = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  chatConstantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "constant",
  },
  message:{
    type: String,
  },
  readStatus:{
    type: Number,
    enum: [0,1], // 0=unread, 1=read
    default: 0,
    required: true,
  },
  messageType:{
    type: Number,
    enum: [0,1], // 0=text, 1=media
    required: true,
  },
  deletedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  }
},{ timestamps: true });

module.exports = mongoose.model('message', message);

