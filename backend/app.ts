import express from "express";
import bodyParser from "body-parser";
import {eventRoutes} from "./routes/events";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
