const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.render("admin_login");
});

router.post("/", async (req, res) => {
  const { number, password } = req.body;
  if (!number || !password)
    return res
      .status(400)
      .render("admin_login", { error: "Invalid Parameters!" });

  const user = await Admin.findOne({ number: number });
  if (!user)
    return res
      .status(404)
      .render("admin_login", { error: "No Admin Account found!" });

  if (!(await bcrypt.compare(password, user.password))) {
    return res
      .status(400)
      .render("admin_login", { error: "Invalid Password!" });
  }
  const token = jwt.sign(
    { userId: user._id, number: user.number, name: user.name },
    process.env.JWT_SECRET
  );

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res.redirect("/admin");
});
module.exports = router;
