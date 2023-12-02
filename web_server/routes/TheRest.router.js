// routes/spo2Routes.js

const express = require("express");
const router = express.Router();
const theRest = require("../controllers/TheRest.controller");

router.get("/HighlightedCards", theRest.getHighlightedCards);

module.exports = router;
