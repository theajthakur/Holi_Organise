const express = require("express");

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

module.exports = router;
