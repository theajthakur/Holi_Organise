const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Pass = require("../models/Pass");
const Payment = require("../models/Payment");
require("dotenv").config(); // If using environment variables

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  const { amount, data } = req.body;
  const ticketCount = data.length;
  if (!amount || !data || ticketCount == 0)
    return res
      .status(400)
      .json({ status: "error", message: "Invalid Parameters!" });

  const leader = data[0];
  if (!data.every((d) => d.packageName == leader.packageName))
    return res
      .status(401)
      .json({ status: "error", message: "Currupted information" });

  if (
    !(ticketCount == 1 && leader.packageName == "individual") &&
    !(ticketCount == 2 && leader.packageName == "couple") &&
    !(ticketCount == 5 && leader.packageName == "group")
  )
    return res.status(402).json({
      status: "error",
      message: "Invalid Package selected against tickets!",
    });

  let calcAmount = 0;

  switch (ticketCount) {
    case 1:
      calcAmount = 499;
      break;
    case 2:
      calcAmount = 899;
      break;
    case 5:
      calcAmount = 2249;
    default:
      calcAmount = 499;
      break;
  }

  const leaderData = await Pass.create(leader);
  if (ticketCount > 1) {
    for (let i = 1; i < ticketCount; i++) {
      const otherTickets = await Pass.create({
        ...data[i],
        leader: leaderData._id,
      });
    }
  }
  const options = {
    amount: calcAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    await Payment.create({
      userId: leaderData._id,
      txnid: order.id,
      amount: amount,
    });
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
    await Payment.updateOne({ txnid: orderId }, { status: "completed" });
    const response = await razorpay.orders.fetchPayments(orderId);
    return res.json({ status: "success", data: response });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return res.json({
      status: "error",
      message: "Error Fetching payment details!",
    });
  }
});

module.exports = router;
