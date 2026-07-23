# Task Management System

## Project Overview

This project is a **Task Management System** developed as part of the **Koncepthive Full Stack Web Developer Intern Technical Assessment**.

The application allows authenticated users to manage their daily tasks through a clean and responsive interface. Users can create, view, update, delete, search, filter, and sort tasks. Authentication is implemented using JWT, ensuring that each user can only access their own tasks.

---

## Features

- User Login & Logout
- JWT Authentication
- Dashboard with Task Statistics
- Create, Read, Update & Delete Tasks
- Search Tasks by Title
- Filter Tasks by Status & Priority
- Sort Tasks by Due Date and Created Date
- Form Validation (Frontend & Backend)
- Responsive Design (Desktop, Tablet & Mobile)

---

# Technology Stack

## Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Zustand

## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- bcrypt
- dotenv

## Database

- MySQL

---

# Project Structure

```
project/
│
├── frontend/
│   ├── taskflow/
│   │   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.tsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── models/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── .env
│
├── database/
│   └── taskflow.sql
│
└── README.md
```

---

# Installation Instructions

## Clone Repository

```bash
git clone <repository-url>

cd task-management-system
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install Frontend

```bash
cd frontend/taskflow

npm install
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow

JWT_SECRET=Koncepthive_jwt_secret_key
```

---

# Database Setup

Create database

```sql
CREATE DATABASE taskflow;

USE taskflow;
```

Create Users table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

Create Tasks table

```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low','Medium','High') NOT NULL,
    status ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);
```

Insert default user

> Password should be stored as a bcrypt hash.

```sql
INSERT INTO users(name,email,password)
VALUES(
'Admin',
'admin@test.com',
'<bcrypt hashed password>'
);
```

---

# Running the Backend

Navigate to backend

```bash
cd backend
```

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

Backend URL

```
http://localhost:5000
```

---

# Running the Frontend

Navigate to frontend

```bash
cd frontend/taskflow
```

Run application

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# API Documentation

## Authentication

### Login

**POST**

```
/api/auth/login
```

Request

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

Response

```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@test.com"
  }
}
```

---

## Get Dashboard Statistics

**GET**

```
/api/dashboard
```

Example Response

```json
{
  "totalTasks": 5,
  "pendingTasks": 2,
  "inProgressTasks": 1,
  "completedTasks": 2,
  "overdueTasks": 1
}
```

---

## Get All Tasks

**GET**

```
/api/tasks
```

Optional Query Parameters

| Parameter | Description |
|------------|------------|
| search | Search task title |
| status | Filter by status |
| priority | Filter by priority |
| sort | due_date, newest, oldest |

Example

```
GET /api/tasks?priority=High
```

Example Response

```json
[
  {
    "id": 7,
    "title": "API Integration",
    "description": "Connect the frontend with backend REST APIs for task management.",
    "priority": "High",
    "status": "In Progress",
    "due_date": "2026-07-23T18:30:00.000Z",
    "created_at": "2026-07-22T08:59:27.000Z",
    "updated_at": "2026-07-22T08:59:27.000Z",
    "user_id": 1
  },
  {
    "id": 6,
    "title": "Build Login Page",
    "description": "Create a responsive login page with form validation and authentication.",
    "priority": "High",
    "status": "Completed",
    "due_date": "2026-07-20T18:30:00.000Z",
    "created_at": "2026-07-22T08:58:48.000Z",
    "updated_at": "2026-07-22T08:58:48.000Z",
    "user_id": 1
  }
]
```

---

## Get Single Task

**GET**

```
/api/tasks/:id
```

Example

```
GET /api/tasks/10
```

Response

```json
{
  "id": 10,
  "title": "Assessment second",
  "description": "Develop a Task Management System that allows users to authenticate and manage their daily tasks",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-07-22T18:30:00.000Z",
  "created_at": "2026-07-22T09:19:36.000Z",
  "updated_at": "2026-07-22T09:19:36.000Z",
  "user_id": 1
}
```

---

## Create Task

**POST**

```
/api/tasks/create
```

Request

```json
{
  "title": "Assessment second",
  "description": "Develop a Task Management System that allows users to authenticate and manage their daily tasks",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-07-23"
}
```

Response

```json
{
  "message": "Task created successfully",
  "taskId": 10
}
```

---

## Update Task

**PUT**

```
/api/tasks/update/:id
```

Example

```
PUT /api/tasks/update/10
```

Request

```json
{
  "title": "Updated Assessment",
  "description": "Updated description",
  "priority": "Medium",
  "status": "Completed",
  "due_date": "2026-07-25"
}
```

Response

```json
{
  "message": "Task updated successfully"
}
```

---

## Delete Task

**DELETE**

```
/api/tasks/delete/:id
```

Example

```
DELETE /api/tasks/delete/10
```

Response

```json
{
  "message": "Task deleted successfully"
}
```

---

# Validation

The application validates both frontend and backend.

- Title is required.
- Priority is required.
- Status is required.
- Due date cannot be before today.
- Invalid requests return meaningful validation messages.

---

# Assumptions Made

- JWT authentication is used.
- Only one predefined user exists.
- Passwords are stored using bcrypt hashing.
- Dates use the `YYYY-MM-DD` format.
- MySQL is used as the database.

---

# Known Limitations

- User Registration is not implemented.
- Forgot Password functionality is not available.

---



---



---

# Author

**Tharindu Hashan**

Full Stack Web Developer Intern Assessment for **Koncepthive**.