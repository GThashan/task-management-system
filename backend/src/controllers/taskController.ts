import { Response } from "express";
import pool from "../config/database";
import { AuthRequest } from "../middleware/authMiddleware";

import { RowDataPacket } from "mysql2";

interface Task extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
}

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

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const id = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Task id is required",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT * FROM tasks
      WHERE id = ? AND user_id = ?
      `,
      [id, userId],
    );

    const tasks = rows as Task[];

    if (tasks.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(tasks[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const  id  = req.params.id;
    const { title, description, priority, status, due_date } = req.body;

    await pool.execute(
      `UPDATE tasks SET title=?,description=?,priority=?,status=?,due_date=? WHERE id=? AND user_id=?`,
       [title, description, priority, status, due_date, id, userId],
    );

    res.json({message: "Task updated successfully",
});
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
