const mongoose = require("mongoose");
const doctor_prescriptions = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    title: {
      type: String,
    },
    patientName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    countryCode: {
      type: String,
      default: 0,
    },
    note: {
      type: String,
    },
    image:{
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
const prescription = mongoose.model(
  "doctor_prescriptions",
  doctor_prescriptions
);
module.exports = prescription;
