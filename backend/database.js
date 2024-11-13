"use strict";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        // Create the 'events' table
        db.run(`
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                date TEXT,
                location TEXT,
                organizer TEXT
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'events' table:", err.message);
            }
        });

        // Create the 'users' table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT,
                fullName TEXT,
                role TEXT
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'users' table:", err.message);
            }
        });

        // Create the 'Registrations' table
        db.run(`
            CREATE TABLE IF NOT EXISTS Registrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                user_id INTEGER,
                FOREIGN KEY (event_id) REFERENCES events(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'Registrations' table:", err.message);
            }
        });

    }
});

module.exports = db;
