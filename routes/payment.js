const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config(); // If using environment variables

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

// Route to verify payment after success
router.post("/verify-payment", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment success, update database
    res.json({ success: true, message: "Payment Verified" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment Verification Failed" });
  }
});

router.post("/checkOrder", async (req, res) => {
  const { orderId } = req.body;
  try {
    const response = await razorpay.orders.fetchPayments(orderId);
    res.json({ data: response });
  } catch (error) {
    console.error("Error fetching payment details:", error);
  }
});

module.exports = router;
