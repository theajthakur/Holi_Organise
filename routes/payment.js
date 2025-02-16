require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

const PAYU_BASE_URL = "https://test.payu.in"; // Use test URL for sandbox

router.post("/pay", async (req, res) => {
  try {
    const { amount, productinfo, firstname, email, phone } = req.body;
    const txnid = "Txn" + Math.floor(100000 + Math.random() * 900000); // Generate transaction ID

    const data = {
      key: process.env.PAYU_MERCHANT_KEY,
      txnid: txnid,
      amount: amount,
      productinfo: productinfo,
      firstname: firstname,
      email: email,
      phone: phone,
      surl: process.env.PAYU_SUCCESS_URL, // Success URL
      furl: process.env.PAYU_FAILURE_URL, // Failure URL
      service_provider: "payu_paisa",
    };

    // Generate hash
    const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${process.env.PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;

    res.json({
      paymentUrl: `${PAYU_BASE_URL}/_payment`,
      payload: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

module.exports = router;
