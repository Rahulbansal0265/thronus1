const { Timestamp, Double } = require("mongodb");
const mongoose = require("mongoose");
const { Decimal128 } = require('mongodb');
const products = new mongoose.Schema(
  {
    produto: {
      type: String,
      required: true,
    },
    cbd_mg: {
      type: String,
      required: false,
    },
    thc_mg: {
      type: String,
      required: false,
    },
    total_cbd: {
      type: String,
      required: false,
    },
    total_thc: {
      type: String,
      required: false,
    },
    investimento: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for the location field to enable geospatial queries

const UserModel = mongoose.model("products", products);

module.exports = UserModel;
