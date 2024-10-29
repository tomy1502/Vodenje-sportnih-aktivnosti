"use strict";
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
router.post("/", eventController.addEvent);
router.get("/", eventController.getAllEvents);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent);
module.exports = router;
