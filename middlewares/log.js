const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Create a write stream for logging (append mode)
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// Custom Morgan middleware
const logMiddleware = morgan("combined", { stream: logStream });

module.exports = logMiddleware;
