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


// Update event with notifications for registered users
exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { name, description, date, location, organizer } = req.body;

    // Check for required fields
    if (!name || !description || !date || !location || !organizer) {
        return res.status(400).json({ error: "Vsi podatki so obvezni." });
    }

    // Update the event in the database
    db.run(
        `UPDATE events SET name = ?, description = ?, date = ?, location = ?, organizer = ? WHERE id = ?`,
        [name, description, date, location, organizer, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Dogodek ni najden' });
            }

            db.all(
                `SELECT user_id FROM Registrations WHERE event_id = ?`,
                [id],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikov' });
                    }

                    const message = `Dogodek "${name}" je bil posodobljen.`;

                    rows.forEach(row => {
                        db.run(
                            `INSERT INTO notifications (user_id, message) VALUES (?, ?)`,
                            [row.user_id, message],
                            (err) => {
                                if (err) console.log("Napaka pri ustvarjanju obvestila:", err.message);
                            }
                        );
                    });

                    res.status(200).json({ message: 'Dogodek posodobljen in obvestila poslata!', id });
                }
            );
        }
    );
};



// Backend funkcija za pridobivanje obvestil uporabnika
exports.getUserNotifications = (req, res) => {
    const { userId } = req.params;  // Pridobimo userId iz URL parametra


    db.all(`SELECT message FROM notifications WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Napaka pri pridobivanju obvestil" });
        }

        const messages = rows.map((row) => row.message);
        res.json(messages);  // Pošljemo seznam obvestil
    });
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

    if (!eventId || !userId) {
        return res.status(400).json({ error: "Missing eventId or userId" });
    }
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


