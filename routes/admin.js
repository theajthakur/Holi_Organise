const mongoose = require("mongoose");
const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Pass = require("../models/Pass");
const Payment = require("../models/Payment");
const Referral = require("../models/Referral");
const { v4: uuidv4 } = require("uuid");

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

  try {
    if (!id) {
      return res.json({ status: "error", message: "No Id Found!" });
    }

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ status: "error", message: "Invalid Ticket Code!" });
    }

    const user = await Pass.findById(id);
    if (!user) {
      return res.json({ status: "error", message: "Invalid Qr Detected!" });
    }

    const payment = await Payment.findOne({ userId: user._id });
    if (!payment || payment.status !== "completed") {
      return res.json({
        status: "error",
        message: `No Payment found from ${user.name}`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `${user.name} is verified`,
      user: user,
      payment: payment,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: `Data is manipulated: ${id}` });
  }
});

Router.post("/refer", async (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile)
    return res.json({ status: "error", message: "Invalid Parameters!" });

  try {
    const refer = await Referral.findOne({ mobile: mobile });
    if (refer)
      return res.json({
        status: "success",
        message: `Already Generated: <a target="_blank" href="https://api.whatsapp.com/send?text=Hey ${refer.name}, I just earned a reward by inviting friends! 🎉 Join me here: https://seal-app-z4br9.ondigitalocean.app/?referrer=${refer.code} and get exclusive benefits too! 🚀">Share on Whatsapp</a>`,
      });

    const referralCode = uuidv4();

    await Referral.create({
      name: name,
      mobile: mobile,
      code: referralCode,
      admin: req.user.name,
    });

    return res.json({
      status: "success",
      message: `Referral Generated: <a target="_blank" href="https://api.whatsapp.com/send?text=Hey ${name}, I just earned a reward by inviting friends! 🎉 Join me here: https://seal-app-z4br9.ondigitalocean.app/?referrer=${referralCode} and get exclusive benefits too! 🚀">Share on Whatsapp</a>`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "success",
      message: "Server Error while creating Referral",
    });
  }
});

Router.get("/refer", async (req, res) => {
  try {
    const refers = await Referral.find();
    return res.json({
      status: "success",
      message: "Fetched All Refers",
      data: refers,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Server Error while fetching refers",
    });
  }
});

module.exports = Router;
