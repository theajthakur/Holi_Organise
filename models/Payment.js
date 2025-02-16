const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  txnid: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  productinfo: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
