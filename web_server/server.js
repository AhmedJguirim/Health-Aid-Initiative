const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3002;
console.log(process.env.MONGO);
mongoose.connect(process.env.MONGO, {});
const db = mongoose.connection;
db.on("error", function (err) {
  console.log(err.message);
});
db.once("open", function () {
  console.log("mongodb connection open");
});
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const diseaseRouter = require("./routes/Disease.router.js");
app.use("/api", diseaseRouter);
const heartRateRouter = require("./routes/HeartRate.router.js");
app.use("/api", heartRateRouter);
const authRouter = require("./routes/Auth.router.js");
app.use("/api", authRouter);
const medicineRouter = require("./routes/Medicine.router.js");
app.use("/api", medicineRouter);
const prescriptionRouter = require("./routes/Prescription.router.js");
app.use("/api", prescriptionRouter);
const allergieRouter = require("./routes/Allergie.router.js");
app.use("/api", allergieRouter);

app.listen(port, () => {
  console.log(`Server listening on the port  ${port}`);
});
