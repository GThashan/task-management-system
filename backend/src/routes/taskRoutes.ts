import express from "express";

import {createTask,getTaskById,updateTask,deleteTask} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();


router.post("/create", authenticate, createTask);
router.get("/:id", authenticate, getTaskById);
router.put("/update/:id", authenticate, updateTask);
router.delete("/delete/:id",authenticate,deleteTask)



export default router;
