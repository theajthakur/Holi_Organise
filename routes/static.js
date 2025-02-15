const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.status(200).render("about");
});

router.get("/tickets", (req, res) => {
  res.status(200).json({ message: "Ruko Zara sabar karo!!" });
});

module.exports = router;
