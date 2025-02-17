const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

Router.get("/", (req, res) => {
  res.render("admin", {
    user: req.user,
  });
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

module.exports = Router;
