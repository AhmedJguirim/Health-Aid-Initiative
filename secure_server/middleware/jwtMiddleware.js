const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading

// Middleware to verify the JWT access token
exports.verifyAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const publicKey = await fs.readFile("keys/public_key.pem", "utf8"); // assuming you also have a public key
    jwt.verify(accessToken, publicKey, { algorithms: ["RS256"] });
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};
