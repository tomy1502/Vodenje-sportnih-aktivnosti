const db = require("../database");

exports.addEvent = (req, res) => {
    const { name, description, date, location } = req.body;
    db.run(
        `INSERT INTO events (name, description, date, location) VALUES (?, ?, ?, ?)`,
        [name, description, date, location],
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