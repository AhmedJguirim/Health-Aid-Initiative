// const express = require("express");
// const router = express.Router();
// const forge = require("node-forge");
// const testSc = require("../schemas/testSc");
// const forge = require("node-forge");

// const storePublicKey = async (publicKey) => {
//   const newPublicKey = new testSc({ publicKey: publicKey });

//   await newPublicKey.save();
// };

// const retrievePublicKey = async () => {
//   const publicKeyDocument = await testSc.findOne();

//   if (publicKeyDocument) {
//     const publicKey = publicKeyDocument.publicKey;
//     return publicKey;
//   } else {
//     return null;
//   }
// };

// router.post("/", async (req, res) => {
//   try {
//     await storePublicKey(req.body.key);

//     const keyPem = await retrievePublicKey();
//     const key = forge.pki.publicKeyFromPem(keyPem);

//     res.json({ message: key.encrypt("hello") });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ message: err.message });
//   }
// });
// router.get("/", async (req, res) => {
//   try {
//     // await storePublicKey(req.body.key);

//     const keyPem = await retrievePublicKey();
//     const key = forge.pki.publicKeyFromPem(keyPem);

//     res.json({ message: key.encrypt("heheeee") });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
