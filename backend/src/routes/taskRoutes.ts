import express from "express";

import {createTask,getTaskById} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();


router.post("/create", authenticate, createTask);
router.get("/:id", authenticate, getTaskById);


export default router;
