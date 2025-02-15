const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const router = require("./routes/static");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

app.listen(port, () => console.log(`App running on http://localhost:${port}`));
