const db = require("../database"); // Path to your database file
const multer = require("multer");

// Configure multer to use in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Controller for handling attachment uploads
const addAttachment = (req, res) => {
    const { eventId, description } = req.body;

    // Validate required fields
    if (!req.file || !eventId) {
        return res.status(400).json({ message: "Manjka datoteka ali ID dogodka" });
    }

    console.log("Received file:", req.file.originalname);
    console.log("Event ID:", eventId);

    // SQL query to insert attachment data
    const sql = `
        INSERT INTO attachments (event_id, file_name, file_data, description)
        VALUES (?, ?, ?, ?
    `;
    const params = [
        eventId,
        req.file.originalname,  // File name
        req.file.buffer,        // File content as binary
        description || "",      // Optional description
    ];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error saving attachment to the database:", err);
            return res.status(500).json({ message: "Napaka pri shranjevanju v bazo" });
        }

        res.status(201).json({
            message: "Priloga uspešno dodana!",
            attachmentId: this.lastID, // ID of the inserted row
        });
    });
};

const getAttachmentsByEvent = (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    // SQL query to fetch attachments for the given event ID
    const sql = `SELECT id, event_id, description, file_name FROM attachments WHERE event_id = ?`;

    db.all(sql, [eventId], (err, rows) => {
        if (err) {
            console.error("Error fetching attachments:", err);
            return res.status(500).json({ message: "Napaka pri pridobivanju prilog" });
        }

        res.status(200).json(rows);
    });
};

module.exports = {
    upload,
    addAttachment,
    getAttachmentsByEvent,
};
