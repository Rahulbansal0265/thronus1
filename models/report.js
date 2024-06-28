const mongoose = require("mongoose");

const report = new mongoose.Schema({
    reportBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    reportTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    description: {
        type: String,
    },
    status: {
        type: Number,
        enum: [0, 1], // 0 notVeify , 1 Verified
        default:0
      },
},
    { timestamps: true });
module.exports = new mongoose.model("report", report);
