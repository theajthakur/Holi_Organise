const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

const app = express();
const port = 3000;

const staticRouter = require("./routes/static");
const payRouter = require("./routes/payment");
const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const logMiddleware = require("./middlewares/log");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(logMiddleware);
app.use("/", staticRouter);
app.use("/payment", payRouter);

const authMiddleware = require("./middlewares/auth");
app.use("/auth", authRouter);
app.use("/admin", authMiddleware, adminRouter);

app.listen(port, () => console.log(`App running on http://localhost:${port}`));
