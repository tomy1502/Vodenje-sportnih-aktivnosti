"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const eventRoutes = require("./routes/events");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/events", eventRoutes);
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
