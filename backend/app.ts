import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {eventRoutes} from "./routes/events";
import { usersRoutes } from "./routes/users";
import attachmentsRoutes from "./routes/attachments";


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/attachments", attachmentsRoutes);


const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
