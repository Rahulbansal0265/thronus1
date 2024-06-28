const mongoose = require("mongoose");
const salesforce = new mongoose.Schema(
  {
    role: {
      type: Number,
      enum: [0, 1, 2, 3], // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
      required: false,
    },
    accountId: {
      type: String,
      required: false,
    },
    salesforceId: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    cpfId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: [0,1],
      default: 0,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    countrycode: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
    },
    doctorId: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    notificationStatus: {
      type: Number,
      enum: [0, 1], // 0 for off , 1 for on
      default:1
    },
    emailNotificationStatus: {
      type: Number,
      enum: [0, 1], // 0 for off , 1 for on
      default:1
    },
  },
  { timestamps: true }
);

// Index for the location field to enable geospatial queries
salesforce.index({ location: "2dsphere" });

const salesForce = mongoose.model("salesforce", salesforce);

module.exports = salesForce;
