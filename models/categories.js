const mongoose = require("mongoose");

const category = new mongoose.Schema({
  title: {
    type: String,
  },
  status: {
    type: Boolean,
  },
},
{ timestamps: true });
const categorySchema = mongoose.model("categories", category);
module.exports = categorySchema;
