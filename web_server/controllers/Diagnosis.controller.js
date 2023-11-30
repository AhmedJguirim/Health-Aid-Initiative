const express = require("express");

const Diagnosis = require("../schemas/Diagnosis.schema");
const DiseaseCaught = require("../schemas/DiseaseCaught.schema");
const AllergyCaught = require("../schemas/AllergyCaught.schema");
const fs = require("fs").promises; // for file reading

const { verifyJwt } = require("../utils/auth");
const { default: axios } = require("axios");
const forge = require("node-forge");

exports.createDiagnosis = async (req, res) => {
  const { notes, diseasesCaught, allergiesCaught, patient } = req.body;
  console.log(patient);

  try {
    // Verify the doctor's JWT
    const decodedJwt = await verifyJwt(req.headers.authorization);
    console.log(decodedJwt.doctor_id);
    // Check if the doctor has the right to create a prescription for the specified patient
    const resp = await axios.get(
      `http://127.0.0.1:3001/api/consents/doctorPatient/add/${decodedJwt.doctor_id}/${patient}`
    );
    if (!resp) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const encryptedAppointment = await axios.post(
      `http://127.0.0.1:3001/api/appointments`,
      {
        doctor: decodedJwt.doctor_id,
        patient,
        notes,
      }
    );
    //   appointmentID

    // Save the prescription
    const privateKey = await fs.readFile("keys/private_key.pem", "utf8");
    const pvkey = forge.pki.privateKeyFromPem(privateKey);
    const appID = pvkey.decrypt(encryptedAppointment.data.appointmentID);
    // Arrays to store created medListings, dosages, and alarms
    // Loop through each medListing in the request
    const diagnosis = new Diagnosis({ appointmentID: appID });
    const saveDiag = await diagnosis.save();
    for (const dsCaught of diseasesCaught) {
      const { notes, severity, disease, diseaseName } = dsCaught;

      // Create a new medListing
      const diseaseCaught = new DiseaseCaught({
        notes,
        severity,
        disease,
        diseaseName,
        diagnosis: saveDiag._id,
        appointmentID: appID,
      });
      await diseaseCaught.save();
      // Save the medListing
    }

    for (const AlgCaught of allergiesCaught) {
      const { notes, severity, allergy, allergyName } = AlgCaught;

      // Create a new medListing
      const allergieCaught = new AllergyCaught({
        notes,
        severity,
        allergy,
        allergyName,
        diagnosis: saveDiag._id,
        appointmentID: appID,
      });
      await allergieCaught.save();
      // Save the medListing
    }

    // Response with created data
    res.status(201).json({
      message: "nice",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
