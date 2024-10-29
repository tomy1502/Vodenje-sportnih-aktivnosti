"use strict";
const db = require("../database");
exports.addEvent = (req, res) => {
    const { name, description, date, location } = req.body;
    db.run(`INSERT INTO events (name, description, date, location) VALUES (?, ?, ?, ?)`, [name, description, date, location], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(201).json({ id: this.lastID });
        }
    });
};
exports.getAllEvents = (req, res) => {
    db.all("SELECT * FROM events", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.json(rows);
        }
    });
};
exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM events WHERE id = ?`, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(200).json({ message: "Dogodek uspešno izbrisan" });
        }
    });
};
exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { name, description, date, location } = req.body;
    db.run(`UPDATE events SET name = ?, description = ?, date = ?, location = ? WHERE id = ?`, [name, description, date, location, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message }); // Napaka pri posodobitvi
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Dogodek ni najden' }); // Če ID ne obstaja
        }
        res.status(200).json({ message: 'Dogodek posodobljen!', id }); // Uspešna posodobitev
    });
};
