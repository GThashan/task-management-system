import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API Running",
  });
});
app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5000;

const connectDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Database Connected Successfully");

    connection.release();
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
};

connectDatabase();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
