const mongoose = require('mongoose');

const questions = mongoose.Schema({
  question:{
    type: String,
  }
  // answer:{
  //   type: String,
  // }
},{ timestamps: true });

module.exports = mongoose.model('questions', questions);

