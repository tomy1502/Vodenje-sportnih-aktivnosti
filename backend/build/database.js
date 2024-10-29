"use strict";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
    else {
        db.run(`CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                date TEXT,
                location TEXT
            );
            
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullName TEXT,
                role TEXT
            )
            
            `, (err) => {
            if (err) {
                console.log("Error creating table:", err.message);
            }
            else {
                console.log("Connected to the SQLite database and table is ready.");
            }
        });
    }
});
module.exports = db;
