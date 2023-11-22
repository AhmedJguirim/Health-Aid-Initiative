const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3001;
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

//creating an admin for testing once the app starts
// const testRouter = require("./routes/tests.js");
// app.use("/api/tests", testRouter);
const patientRouter = require("./routes/Patient.router.js");
app.use("/api", patientRouter);
const doctorRouter = require("./routes/Doctor.router.js");
app.use("/api", doctorRouter);

app.listen(port, () => {
  console.log(`Server listening on the port  ${port}`);
});
