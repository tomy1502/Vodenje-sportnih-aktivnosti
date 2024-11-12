const db = require("../database");

exports.addEvent = (req, res) => {
    const { name, description, date, location, organizer } = req.body;
    db.run(
        `INSERT INTO events (name, description, date, location, organizer) VALUES (?, ?, ?, ?, ?)`,
        [name, description, date, location, organizer],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
};

exports.getAllEvents = (req, res) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
};

exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    db.run(
        `DELETE FROM events WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(200).json({ message: "Dogodek uspešno izbrisan" });
            }
        }
    );
};


exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { name, description, date, location, organizer } = req.body;

    db.run(
        `UPDATE events SET name = ?, description = ?, date = ?, location = ?, organizer = ? WHERE id = ?`,
        [name, description, date, location, organizer, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message }); // Napaka pri posodobitvi
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Dogodek ni najden' }); // Če ID ne obstaja
            }
            res.status(200).json({ message: 'Dogodek posodobljen!', id }); // Uspešna posodobitev
        }
    );
};


// controllers/events.js za dodajanje in odstranjevanje prijav na event
exports.registerForEvent = (req, res) => {
    const { eventId, userId } = req.body;

    console.log('Received eventId:', eventId); // Verify if this logs
    console.log('Received userId:', userId);   // Verify if this logs

    db.run(
        `INSERT INTO Registrations (event_id, user_id) VALUES (?, ?)`,
        [eventId, userId],
        function (err) {
            if (err) {
                console.error("Database error:", err.message);
                return res.status(500).json({ error: "Error during registration: " + err.message });
            }
            res.status(201).json({ message: 'Prijava uspešna', id: this.lastID });
        }
    );
};

exports.deregisterFromEvent = (req, res) => {
    const { eventId } = req.params;  // We expect eventId in the URL parameter
    const { userId } = req.body;     // userId should come from the request body

    // SQL query to delete the registration
    db.run(
        `DELETE FROM Registrations WHERE event_id = ? AND user_id = ?`,
        [eventId, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // Respond with success message
            res.json({ message: 'Odjava uspešna' });
        }
    );
};


