const mongoose = require("mongoose");
const QRHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    default: null,
  },
  admin: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QRHistory = mongoose.model("QRHistory", QRHistorySchema);

module.exports = QRHistory;
