const express = require("express");

const Prescription = require("../schemas/Prescription.schema");
const MedListing = require("../schemas/MedListing.schema");
const Dosage = require("../schemas/Dosage.schema");
const Alarm = require("../schemas/Alarm.schema");
const Medicine = require("../schemas/Medicine.schema");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils/auth");
const { default: axios } = require("axios");

exports.createPrescription = async (req, res) => {
  const { medListings } = req.body;
  const { patient } = req.params;

  try {
    // Verify the doctor's JWT
    const decodedJwt = await verifyJwt(req.headers.authorization);
    // Check if the doctor has the right to create a prescription for the specified patient
    const resp = await axios.get(
      `http://127.0.0.1:3001/api/consents/doctorPatient/add/${decodedJwt.doctor_id}/${patient}`
    );
    if (!resp) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(resp.data);
    // Create a new prescription
    const prescription = new Prescription({
      doctorID: resp.data.doctorID,
      patientID: resp.data.patientID,
      Date: new Date(),
    });

    // Save the prescription
    const savedPrescription = await prescription.save();

    // Arrays to store created medListings, dosages, and alarms
    const createdMedListings = [];
    const createdDosages = [];
    const createdAlarms = [];

    // Loop through each medListing in the request
    for (const medListingData of medListings) {
      const { medecineId, numberOfDays, critical, dosage } = medListingData;

      // Create a new medListing
      const medListing = new MedListing({
        isCritical: critical,
        numberOfDays,
        medicine: medecineId,
        prescription: savedPrescription._id,
      });

      // Save the medListing
      const savedMedListing = await medListing.save();
      createdMedListings.push(savedMedListing);
      prescription.medListings.push(savedMedListing._id);

      // Loop through each dosage in the medListing
      for (const dosageData of dosage) {
        const { quantity, time } = dosageData;

        // Create a new dosage
        const dosage = new Dosage({
          quantity,
          timeOfDay: time,
          medListing: savedMedListing._id,
        });

        // Save the dosage
        const savedDosage = await dosage.save();
        createdDosages.push(savedDosage);
        medListing.dosages.push(savedDosage._id);

        // Calculate datetime for the alarm (adjust this logic as needed)
        for (let index = 0; index < numberOfDays; index++) {
          const alarmDatetime = new Date(savedPrescription.Date);
          alarmDatetime.setDate(alarmDatetime.getDate() + index);
          if (time === "morning") {
            alarmDatetime.setHours(9, 0, 0, 0);
          } else if (time === "midday") {
            alarmDatetime.setHours(12, 0, 0, 0);
          } else if (time === "night") {
            alarmDatetime.setHours(19, 0, 0, 0);
          }

          // Create a new alarm
          const alarm = new Alarm({
            title: `Dose for ${savedMedListing.medicine.name} ${time} dose`,
            dateTime: alarmDatetime,
            dosage: savedDosage._id,
          });

          // Save the alarm
          const savedAlarm = await alarm.save();
          createdAlarms.push(savedAlarm);
          dosage.alarms.push(savedAlarm._id);
        }
        await dosage.save();
      }
      await medListing.save();
    }
    await prescription.save();
    // Response with created data
    res.status(201).json({
      prescription: {
        patient: savedPrescription.patientID,
        doctor: savedPrescription.doctorID,
        date: savedPrescription.Date,
        medListings: createdMedListings.map((medListing) => medListing._id),
      },
      medListings: createdMedListings,
      dosages: createdDosages,
      alarms: createdAlarms,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};