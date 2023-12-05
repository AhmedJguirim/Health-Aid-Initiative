const fs = require("fs");
const jwt = require("jsonwebtoken");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const verifyJwt = async (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or invalid authorization header");
  }

  const token = authorizationHeader.substring("Bearer ".length);

  try {
    // Read the private key asynchronously
    const privateKey = await readFileAsync("keys/private_key.pem", "utf8");

    // Use jwt.verify asynchronously
    const decoded = await jwt.verify(token, privateKey);
    console.log("decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Unauthorized: Invalid token");
  }
};

module.exports = { verifyJwt };
