const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res
      .status(403)
      .render("admin_login", { error: "No token, authorization denied!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).render("admin_login", { error: "Invalid Login" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
