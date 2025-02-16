const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.status(200).render("about");
});

router.get("/tickets", (req, res) => {
  res.status(200).render("Ticket");
});

module.exports = router;
