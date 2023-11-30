const jwt = require("jsonwebtoken");
const fs = require("fs").promises; // for file reading
const axios = require("axios");
const forge = require("node-forge");
const { verifyJwt } = require("../utils/auth");

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
        expiresIn: "30d",
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
      expiresIn: "30d",
      algorithm: "RS256",
    });

    const refreshToken = jwt.sign(
      {
        userId: req.body.code,
        // tokenId: uuidv4()
      },
      privateKey,
      {
        expiresIn: "30d",
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
    //todo: you can incript from front with public key of secure server and send it fully secure
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

exports.addAddressToPatient = async (req, resp) => {
  const { code, country, city, street, zipcode } = req.body;
  try {
    //todo: you can incript from front with public key of secure server and send it fully secure
    const decodedJwt = await verifyJwt(req.headers.authorization);
    const pID = await axios.get(
      `http://127.0.0.1:3001/api/patients/ID/${decodedJwt.code}`
    );
    if (!pID) {
      return res.status(404).json({ error: "Not found: card not found" });
    }
    const res = await axios.post(`http://127.0.0.1:3001/api/addresses`, {
      patientID: pID.data.patientID,
      country,
      city,
      street,
      zipcode,
    });
    return resp.json(res.data);
  } catch (err) {
    console.error(err.message);
    resp.status(500).json({ error: err.message });
  }
};
exports.registerDoctorEncrypted = async (req, resp) => {
  try {
    //todo:finish this
    const publicKey_secure = await fs.readFile(
      "keys/public_key_secure.pem",
      "utf8"
    );
    const pbkey = forge.pki.publicKeyFromPem(publicKey_secure);
    const {
      publicKey,
      name,
      birthDate,
      email,
      phoneNumber,
      licenseNumber,
      password,
    } = req.body;
    const doctorEnc = pbkey.encrypt(
      JSON.stringify({
        name,
        birthDate,
        email,
        phoneNumber,
        licenseNumber,
        password,
      })
    );
    const res = await axios.post(`http://127.0.0.1:3001/api/doctorsEnc`, {
      data: doctorEnc,
      publicKey,
    });

    return resp.json(res.data);
  } catch (err) {
    console.error(err.message);
    resp.status(500).json({ error: err.message });
  }
};
exports.registerPatientEncrypted = async (req, resp) => {
  try {
    //todo:finish this
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

exports.getPatientData = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    // Handle the case where the JWT is not present in the headers
    res.status(401).json({ error: "Unauthorized - JWT missing" });
  }
  // Extract the JWT token from the Authorization header
  const token = authorizationHeader.replace("Bearer ", "");
  const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
  jwt.verify(token, privateKey, async (err, decoded) => {
    try {
      if (err) {
        // Handle the case where the JWT verification fails
        res.status(401).json({ error: err.message });
      } else {
        console.log("patient:" + decoded.code);
        const resp = await axios.get(
          `http://127.0.0.1:3001/api/patients/${decoded.code}`
        );
        if (!resp.data) {
          res.status(401).json({ error: "Unauthorized" });
        }
        // const heartrates = HeartRate.find({ patientID });
        // Continue processing the request
        console.log(resp.data);

        res.json(resp.data);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

exports.getDoctorData = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    // Handle the case where the JWT is not present in the headers
    res.status(401).json({ error: "Unauthorized - JWT missing" });
  }
  // Extract the JWT token from the Authorization header
  const token = authorizationHeader.replace("Bearer ", "");
  const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
  jwt.verify(token, privateKey, async (err, decoded) => {
    try {
      if (err) {
        // Handle the case where the JWT verification fails
        res.status(401).json({ error: err.message });
      } else {
        const resp = await axios.get(
          `http://127.0.0.1:3001/api/doctors/${decoded.doctor_id}`
        );
        if (!resp.data) {
          res.status(401).json({ error: "Unauthorized" });
        }
        // const heartrates = HeartRate.find({ patientID });
        // Continue processing the request
        console.log(resp.data);

        res.json(resp.data);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

exports.searchDoctorsByName = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    // Handle the case where the JWT is not present in the headers
    res.status(401).json({ error: "Unauthorized - JWT missing" });
  }
  // Extract the JWT token from the Authorization header
  const token = authorizationHeader.replace("Bearer ", "");
  const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
  jwt.verify(token, privateKey, async (err, decoded) => {
    try {
      if (err) {
        // Handle the case where the JWT verification fails
        res.status(401).json({ error: err.message });
      } else {
        const resp = await axios.get(
          `http://127.0.0.1:3001/api/doctors/${decoded.doctor_id}`
        );
        if (!resp.data) {
          res.status(401).json({ error: "Unauthorized" });
        }
        // const heartrates = HeartRate.find({ patientID });
        // Continue processing the request
        console.log(resp.data);

        res.json(resp.data);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};
