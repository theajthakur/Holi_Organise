const mongoose = require("mongoose");

const PassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  packageName: {
    type: String,
    enum: ["Individual", "Couple", "Group"],
    required: true,
  },
  transactionID: {
    type: String,
    required: true,
    unique: true,
  },
  payStatus: {
    type: String,
    default: "none",
  },
  referrer: {
    type: String, // Stores the referral code
    default: null,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pass = mongoose.model("Pass", PassSchema);
module.exports = Pass;
