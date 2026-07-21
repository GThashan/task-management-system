import express from "express";

import {createTask,getTaskById,updateTask} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();


router.post("/create", authenticate, createTask);
router.get("/:id", authenticate, getTaskById);
router.put("/update/:id", authenticate, updateTask);


export default router;
