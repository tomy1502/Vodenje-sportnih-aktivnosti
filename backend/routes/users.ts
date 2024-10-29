import express from "express";
import { usersController } from "../controllers/usersController";

const router = express.Router();

router.post("/", usersController.add);
router.get("/", usersController.getAll);
router.delete("/:id", usersController.delete);
router.put("/:id", usersController.update);

export {router as usersRoutes};
