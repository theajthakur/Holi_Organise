const express = require("express");
const QRCode = require("qrcode");
const path = require("path");
const Pass = require("../models/Pass");
const Payment = require("../models/Payment");
const Referral = require("../models/Referral");
const router = express.Router();

require("dotenv").config();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.status(200).render("about");
});

router.get("/tickets", (req, res) => {
  res.status(200).render("Ticket", {
    captchaKey: process.env.CAPTCHA_SITE_KEY,
  });
});

router.get("/terms-and-conditions", (req, res) => {
  res.render("pages/term-n-condition");
});

router.get("/privacy-policy", (req, res) => {
  res.render("pages/privacy-policy");
});

router.get("/shipping-delivery", (req, res) => {
  res.render("pages/shipping-delivery");
});

router.get("/cancellation-refund", (req, res) => {
  res.render("pages/cancellation-refund");
});

router.get("/contact-us", (req, res) => {
  res.render("pages/contact-us");
});

router.get("/orders", (req, res) => {
  res.render("Orders");
});

router.post("/orders", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId)
    return res
      .status(404)
      .json({ status: "error", message: "No Order ID Given!!" });

  const order = await Payment.findOne({ txnid: orderId });
  if (!order)
    return res.json({
      status: "error",
      message: "No Order Found with given ID",
    });

  const users = await Pass.find({
    $or: [{ _id: order.userId }, { leader: order.userId }],
  });
  if (!users)
    return res.json({
      status: "error",
      message: "No Pass detail found with given Order!",
    });

  return res.json({ status: "success", data: users });
});

router.get("/qr/generate/:data", async (req, res) => {
  const data = req.params.data;

  QRCode.toBuffer(
    data,
    {
      type: "png",
      margin: 1,
      width: 400,
      height: 400,
      scale: 10,
    },
    (err, buffer) => {
      if (err) {
        res.status(500).send("Error generating QR code");
      } else {
        res.type("png");
        res.send(buffer);
      }
    }
  );
});

router.get("/download/pass/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({ status: "error", message: "No Id found!" });
  try {
    const user = await Pass.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "No User Found!" });

    const payment = await Payment.findById(user._id);

    if (!payment)
      return res.status(404).json({
        status: "error",
        message: `No Payment Found for ${user.name}!`,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: "Invalid Input" });
  }
});

router.get("/vj/logs", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "middlewares", "access.log"));
});

router.get("/logout", (req, res) => {
  res.cookie("auth_token", "").redirect("/");
});

router.post("/refer-status", async (req, res) => {
  const { mobile, link, token } = req.body;
  if (!mobile || !link || !token)
    return res.json({ status: "error", message: "Invalid parameters!" });

  const gcapr = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: process.env.CAPTCHA_SECRET_KEY,
      response: token,
    }),
  });

  if (!gcapr.ok) {
    console.error("Error during reCAPTCHA verification:", gcapr.statusText);
    return;
  }

  const result = await gcapr.json();
  if (!result.success)
    return res.json({ status: "error", message: "Captcha Validation Failed!" });

  const referral = link.split("=")[1];
  if (!referral)
    return res.json({ status: "error", message: "Invalid Referral Link" });
  const affilate = await Referral.find({ code: referral, mobile: mobile });
  if (!affilate)
    return res.json({
      status: "error",
      message: "Invalid link or Mobile Number",
    });
  const refered = await Pass.find({ referrer: referral });
  // if (refered.length === 0)
  //   return res.json({
  //     status: "error",
  //     message:
  //       "No Referral Found, Share link with your friend to get Rewards and many more!",
  //   });

  let amount = 0;
  let successUsers = 0;

  refered.forEach(async (unit) => {
    const success = await Payment.findOne({
      status: "completed",
      userId: unit._id,
    });
    amount += success.amount;
    successUsers++;
  });

  return res.json({
    status: "success",
    message: "Fetched Successfully!",
    earning: (amount * 0.05).toFixed(2),
    totalUsers: refered.length,
    paidUsers: successUsers,
  });
});

router.get("/refer-status", (req, res) => {
  return res.render("referral_status", {
    captchaKey: process.env.CAPTCHA_SITE_KEY,
  });
});

module.exports = router;
