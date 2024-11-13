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
                location TEXT
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'events' table:", err.message);
            } else {
                console.log("'events' table created or already exists.");
            }
        });

        // Create the 'users' table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullName TEXT,
                role TEXT
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'users' table:", err.message);
            } else {
                console.log("'users' table created or already exists.");
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
            } else {
                console.log("'Registrations' table created or already exists.");
            }
        });

        // Create the 'notifications' table
        db.run(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                message TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `, (err) => {
            if (err) {
                console.log("Error creating 'notifications' table:", err.message);
            } else {
                console.log("'notifications' table created or already exists.");
            }
        });


    }
});

module.exports = db;
