const mongoose = require("mongoose");
const referralCodeGenerator = require("referral-code-generator");
const userSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      enum: [0, 1, 2, 3], // 0 = admin, 1 = subAdmin 2 = Patient 3 = doctor
      required: true,
    },
    firstName: {
      type: String,
      required: false,
      default: "",
    },
    lastName: {
      type: String,
      required: false,
      default: "",
    },
    subAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    dob: {
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
      default: "",
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      default: null
    },
    categoryName: {
      type: String,
      required: false,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "constant",
      default: null
    },
    doctorId: {
      type: String,
      required: false,
    },
    referralcode: {
      type: String,
      default: referralCodeGenerator.custom("uppercase", 3, 3, "code"),
    },
    password: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],//latitude ,longitude
      },
    },
    deviceToken: {
      type: String,
      default: "",
    },
    deviceType: {
      type: Number,
      enum: [1, 2], // 1 for android , 2 for IOs
      default: 1
    },
    gender: {
      type: Number,
      enum: [0, 1, 2], // 0=other , 1=male , 2=female
      default:1
    },
    loginTime: {
      type: String,
      default: "",
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
    AssignedSubAdminId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    patients: [
      { type: String }
    ],
    doctors: [
      { type: String }
    ],
    isVerify: {
      type: Number,
      enum: [0, 1], // 0 notVeify , 1 Verified
      default:0
    },
    chatStatus: {
      type: Number,
      enum: [0, 1], // 0 for off , 1 for on
      default:1
    },
    forgotPasswordToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for the location field to enable geospatial queries
userSchema.index({ location: "2dsphere" });

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
