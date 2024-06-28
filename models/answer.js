const mongoose = require('mongoose');

const answers = mongoose.Schema({
  questionId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "questions",
    default: null
  },
  answer:{
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null
  },
},{ timestamps: true });

module.exports = mongoose.model('answers', answers);

