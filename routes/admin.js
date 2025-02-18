const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Pass = require("../models/Pass");
const Payment = require("../models/Payment");
const Referral = require("../models/Referral");

Router.get("/", async (req, res) => {
  try {
    const users = await Pass.find({});
    const payments = await Payment.find({});
    const referral = await Referral.find({});
    let payment = 0;
    payments.forEach((d) => {
      if (d.status == "completed") {
        payment += d.amount;
      }
    });
    res.render("admin", {
      user: req.user,
      users: users,
      payments: payments,
      referral: referral,
      payment: payment,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Server Error!" });
  }
});

// Router.post("/create", async (req, res) => {
//   const { name, number, password } = req.body;
//   if (!name || !number || !password)
//     return res
//       .status(400)
//       .json({ status: "error", message: "Invalid parameters" });

//   const user = await Admin.findOne({ number: number });
//   if (user)
//     return res
//       .status(400)
//       .json({ status: "error", message: `${name} Already Exists!` });

//   try {
//     const hashedPass = await bcrypt.hash(password, 10);
//     await Admin.create({
//       name: name,
//       number: number,
//       password: hashedPass,
//     });
//     res.json({ status: "success", message: `${name} Created!` });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "error", message: "Server Error" });
//   }
// });

Router.get("/api/dashboard", async (req, res) => {
  try {
    const users = await Pass.find({});
    const referral = await Referral.find({});
    res.json({
      status: "success",
      user: users,
      referral: referral,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Server Error!" });
  }
});

Router.post("/scan", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.json({ status: "error", message: "No Id Found!" });

  const user = await Pass.findById(id);
  if (!user)
    return res.json({ status: "error", message: "Invalid Qr Detected!" });

  const payment = await Payment.findOne({ userId: user._id });
  if (!payment || !payment.status == "completed")
    return res.json({
      status: "error",
      message: `No Payment found from ${user.name}`,
    });

  return res.status(200).json({
    status: "success",
    message: `${user.name} is verified`,
    user: user,
    payment: payment,
  });
});

module.exports = Router;
