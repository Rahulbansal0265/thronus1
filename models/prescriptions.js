const mongoose = require("mongoose");
const prescriptions = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }, //blocked users
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }, // blocked by

    title: {
      type: String,
    },
    // image: [String],
    image:{
        type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0 not-verified , 1 verified
      default:0
    },
  },
  { timestamps: true }
);
const prescription = mongoose.model("prescriptions", prescriptions);
module.exports = prescription;
