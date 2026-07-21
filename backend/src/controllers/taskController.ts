import { Response } from "express";
import pool from "../config/database";
import { AuthRequest } from "../middleware/authMiddleware";

//task create
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, due_date } = req.body;

    if (!title || !priority || !status || !due_date) {
      return res.status(401).json({
        message: "Title, priority, status and due date are required",
      });
    }

    const userId = req.user?.id;

    const [result]: any = await pool.execute(
      `
      INSERT INTO tasks
      (user_id,title,description,priority,status,due_date)
      VALUES(?,?,?,?,?,?)
      `,
      [userId, title, description || null, priority, status, due_date],
    );

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


