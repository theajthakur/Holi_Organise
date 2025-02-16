const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Referral = mongoose.model("Referral", ReferralSchema);
module.exports = Referral;
