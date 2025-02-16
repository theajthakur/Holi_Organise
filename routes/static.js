const express = require("express");
const Pass = require("../models/Pass");
const Payment = require("../models/Payment");
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

  const users = await Pass.findById(order.userId);
  if (!users)
    return res.json({
      status: "error",
      message: "No Pass detail found with given Order!",
    });

  return res.json({ status: "success", data: users });
});

module.exports = router;
