const mongoose = require("mongoose");
const doctor_list = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  countrycode: {
    type: String,
    default:0
  },
  role: {
    type: Number,
    default:3
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    // enum: [1, 2, 3],
    // required: true,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 not-verified , 1 verified
    default:0
  },
},{
    timestamps:true
});
module.exports = new mongoose.model("doctor_list", doctor_list);
