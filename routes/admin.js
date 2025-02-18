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
    res.render("admin", {
      user: req.user,
      users: users,
      payments: payments,
      referral: referral,
      payment: 0,
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

module.exports = Router;
