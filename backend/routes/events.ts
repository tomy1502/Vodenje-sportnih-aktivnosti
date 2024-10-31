import express from "express";
import eventController from "../controllers/eventController";

const router = express.Router();

router.post("/", eventController.addEvent);
router.get("/", eventController.getAllEvents);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent);

export {router as eventRoutes};

//module.exports = router;
