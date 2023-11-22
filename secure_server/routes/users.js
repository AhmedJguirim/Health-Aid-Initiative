// require("dotenv").config; //so we can get stuff from .env
// const express = require("express");

// const router = express.Router();
// const userSc = require("../schemas/User.js");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// //get all

// router.get("/", async (req, res) => {
//   try {
//     const users = await userSc.where();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// //get one
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await userSc.where("_id").equals(req.params.id);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // create one
// router.post("/", async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedpass = await bcrypt.hash(req.body.password, salt);
//     const user = new userSc({
//       username: req.body.username,
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedpass,
//       phoneNumber: req.body.phoneNumber,
//       birthdate: req.body.birthdate,
//       sexe: req.body.sex,
//       address: {
//         country: req.body.country,
//         city: req.body.city,
//       },
//     });
//     user
//       .save()
//       .then((obj) => {
//         res.status(201).json("good job");
//       })
//       .catch((err) => res.status(201).send({ message: "hi" }));
//   } catch (err) {
//     res.status(422).json({ message: err.message });
//   }
// });

// //update
// router.patch("/:id", (req, res) => {});

// //deleting
// router.delete("/:id", (req, res) => {});

// //
// //
// //
// //
// //
// //auth

// router.post("/login", async (req, res) => {
//   // Attempt to find a user with a matching username in the database
//   const user = await userSc.findOne({ username: req.body.username });

//   // If no user is found, return a "cannot find user" error
//   if (!user) {
//     return res.status(401).json({ message: "Cannot find user" });
//   }

//   try {
//     // Compare the submitted password with the hashed password stored in the database
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     // If the passwords match, create a JWT payload with the user's username and email
//     if (isMatch) {
//       const payload = {
//         username: user.username,
//         email: user.email,
//       };
//       // Create an access token
//       const token = generateToken(payload);
//       //Create a refresh token
//       const refresh = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: "2d",
//       });
//       // Set the refresh token as a cookie
//       res.cookie("jwt", refresh, {
//         //  httpOnly: true,
//         // sameSite: "None",
//         // secure: true,
//         maxAge: 2 * 24 * 60 * 60 * 1000,
//       });
//       // Respond with the access token

//       res.json({ token });
//     } else {
//       res.status(401).json({ message: "Not allowed" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.post("/token", (req, res) => {
//   console.log(req.headers.cookie);
//   if (req.headers.cookie) {
//     // Destructuring refreshToken from cookie
//     const refreshToken = req.headers.cookie.split("=")[1];
//     // Verify the refresh token
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       (err, decoded) => {
//         if (err) {
//           return res.status(401).json({ message: err.message });
//         } else {
//           // If the token is valid, create a new access token
//           const accessToken = jwt.sign(
//             {
//               username: decoded.username,
//               email: decoded.email,
//             },
//             process.env.ACCESS_TOKEN_SECRET,
//             {
//               expiresIn: "10m",
//             }
//           );
//           // Respond with the new access token
//           return res.json({ accessToken });
//         }
//       }
//     );
//   } else {
//     // If no refresh token is found, return an unauthorized error
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// });
// //middleware to check if the token is valid
// function generateToken(user) {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });
// }
// function authToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
// module.exports = router;
