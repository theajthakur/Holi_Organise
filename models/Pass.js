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
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
    default: "Male",
  },
  packageName: {
    type: String,
    enum: ["individual", "couple", "group"],
    required: true,
    default: "Individual",
  },
  referrer: {
    type: String,
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
