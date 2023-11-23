const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const axios = require("axios");
const forge = require("node-forge");

exports.authenticateDoctor = async (req, resp) => {
  axios
    .post(`http://127.0.0.1:3001/api/doctors/authenticate`, {
      email: req.body.email,
      password: req.body.password,
    })
    .then(async (res) => {
      const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
      const pkey = forge.pki.privateKeyFromPem(privateKey);

      const doctor_id = pkey.decrypt(res.data.doctor_id);
      const accessToken = jwt.sign({ doctor_id: doctor_id }, privateKey, {
        expiresIn: "15m",
        algorithm: "RS256",
      });
      const refreshToken = jwt.sign({ doctor_id: doctor_id }, privateKey, {
        expiresIn: "30d",
        algorithm: "RS256",
      });
      resp.json({ accessToken, refreshToken });
    })
    .catch((err) => {
      console.error(err.message);
      resp.status(401).json({ error: err.message });
    });
};

exports.authenticatePatient = async (req, resp) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:3001/api/patients/checkCardValidity`,
      {
        code: req.body.code,
        pinCode: req.body.pinCode,
      }
    );

    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    const accessToken = jwt.sign({ code: req.body.code }, privateKey, {
      expiresIn: process.env.JWT_EXPIRATION,
      algorithm: "RS256",
    });

    const refreshToken = jwt.sign(
      {
        userId: req.body.code,
        // tokenId: uuidv4()
      },
      privateKey,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        algorithm: "RS256",
      }
    );
    return resp.json({
      accessToken,
      refreshToken,
      encryptedData: res.data.encryptedData,
    });
  } catch (err) {
    console.error(err.message);
    resp.status(401).json({ error: err.message });
  }
};
exports.registerDoctor = async (req, resp) => {
  try {
    const res = await axios.post(`http://127.0.0.1:3001/api/doctors`, req.body);

    return resp.json(res.data);
  } catch (err) {
    console.error(err.message);
    resp.status(500).json({ error: err.message });
  }
};
exports.registerPatient = async (req, resp) => {
  try {
    const res = await axios.post(
      `http://127.0.0.1:3001/api/patients`,
      req.body
    );

    return resp.json(res.data);
  } catch (err) {
    console.error(err.message);
    resp.status(500).json({ error: err.message });
  }
};
