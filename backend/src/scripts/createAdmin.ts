import bcrypt from "bcrypt";
import pool from "../config/database";

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await pool.execute(
    `
        INSERT INTO users
        (name,email,password)
        VALUES (?,?,?)
        `,
    ["Admin", "admin@test.com", hashedPassword],
  );

  console.log("Admin created");

  process.exit();
};

createAdmin();
