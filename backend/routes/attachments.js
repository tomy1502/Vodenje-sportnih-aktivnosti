const express = require("express");
const multer = require("multer");
const db = require("../database"); // Adjust the path to your database connection file
const router = express.Router();

// Use in-memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", upload.single("file"), (req, res) => {
    const { eventId, description } = req.body;

    // Validate inputs
    if (!req.file || !eventId) {
        return res.status(400).json({ message: "Manjka datoteka ali ID dogodka" });
    }

    console.log("Received file:", req.file.originalname);
    console.log("Received event ID:", eventId);

    // Save to the database
    const sql = `
        INSERT INTO attachments (event_id, file_name, file_data, description)
        VALUES (?, ?, ?, ?)
    `;
    const params = [
        eventId,
        req.file.originalname,  // File name
        req.file.buffer,        // File data as binary
        description || "",      // Optional description
    ];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error saving to the database:", err);
            return res.status(500).json({ message: "Napaka pri shranjevanju v bazo" });
        }

        res.status(201).json({
            message: "Priloga uspešno dodana!",
            attachmentId: this.lastID, // ID of the inserted row
        });
    });
});

module.exports = router;
