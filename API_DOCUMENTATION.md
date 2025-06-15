# Student Management System API Documentation

## Overview
This is a RESTful API for a Student Management System with role-based access control. The system supports two types of users: `admin` and `user`, with different levels of access to student data.

## Base URL
```
http://localhost:3001/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}, // Response data (if any)
  "errors": [] // Validation errors (if any)
}
```

## Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/signup`

Register a new user in the system.

#### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min 6 characters)",
  "role": "string (optional, default: 'user', enum: ['admin', 'user'])"
}
```

#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

#### Example Request
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. User Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

#### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

#### Example Request
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Student Management Endpoints

### 1. Create Student
**POST** `/students`

Create a new student record. **Admin only**.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Request Body
```json
{
  "name": "string (required)",
  "age": "number (required, positive integer)",
  "class": "string (required)"
}
```

#### Response
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "age": "number",
    "class": "string",
    "createdBy": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Example Request
```bash
curl -X POST http://localhost:3001/api/students \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "age": 20,
    "class": "Computer Science"
  }'
```

### 2. Get All Students
**GET** `/students`

Retrieve student records based on user role:
- **Admin**: Returns all student records
- **User**: Returns only students created by the logged-in user

#### Headers
```
Authorization: Bearer <token>
```

#### Response
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "string",
      "name": "string",
      "age": "number",
      "class": "string",
      "createdBy": {
        "_id": "string",
        "name": "string",
        "email": "string",
        "role": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "count": "number"
}
```

#### Example Request
```bash
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer <token>"
```

### 3. Get Student by ID
**GET** `/students/:id`

Retrieve a specific student by ID. Users can only access students they created.

#### Headers
```
Authorization: Bearer <token>
```

#### Parameters
- `id` (string, required): Student ID

#### Response
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "age": "number",
    "class": "string",
    "createdBy": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Example Request
```bash
curl -X GET http://localhost:3001/api/students/64f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer <token>"
```

### 4. Update Student
**PUT** `/students/:id`

Update a student record by ID. **Admin only**.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Parameters
- `id` (string, required): Student ID

#### Request Body
```json
{
  "name": "string (optional)",
  "age": "number (optional)",
  "class": "string (optional)"
}
```

#### Response
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "age": "number",
    "class": "string",
    "createdBy": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Example Request
```bash
curl -X PUT http://localhost:3001/api/students/64f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "age": 21
  }'
```

### 5. Delete Student
**DELETE** `/students/:id`

Delete a student record by ID. **Admin only**.

#### Headers
```
Authorization: Bearer <admin_token>
```

#### Parameters
- `id` (string, required): Student ID

#### Response
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": {
    "deletedStudent": {
      "id": "string",
      "name": "string",
      "age": "number",
      "class": "string"
    }
  }
}
```

#### Example Request
```bash
curl -X DELETE http://localhost:3001/api/students/64f8a1b2c3d4e5f6g7h8i9j0 \
  -H "Authorization: Bearer <admin_token>"
```

---

## Utility Endpoints

### Health Check
**GET** `/health`

Check if the server is running.

#### Response
```json
{
  "success": true,
  "message": "Server is running!",
  "timestamp": "string",
  "environment": "string"
}
```

### API Information
**GET** `/`

Get API information and available endpoints.

#### Response
```json
{
  "success": true,
  "message": "Student Management System API",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "signup": "POST /api/auth/signup",
      "login": "POST /api/auth/login"
    },
    "students": {
      "create": "POST /api/students (admin only)",
      "getAll": "GET /api/students",
      "getById": "GET /api/students/:id",
      "update": "PUT /api/students/:id (admin only)",
      "delete": "DELETE /api/students/:id (admin only)"
    },
    "health": "GET /api/health"
  }
}
```

---

## Role-Based Access Control

### Admin Users
- Can create, read, update, and delete all student records
- Can view all students in the system
- Have full access to student management features

### Regular Users
- Can only view student records they created
- Cannot create, update, or delete student records
- Have read-only access to their own data

---

## Error Handling

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Age must be a positive number"
  ]
}
```

### Authentication Errors
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Access denied. Required role: admin. Your role: user"
}
```

### Not Found Errors
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

## Testing Examples

### Complete Workflow Example

1. **Register an admin user:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

2. **Login to get token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

3. **Create a student (use token from login):**
```bash
curl -X POST http://localhost:3001/api/students \
  -H "Authorization: Bearer <token_from_login>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "age": 20,
    "class": "Grade 12"
  }'
```

4. **Get all students:**
```bash
curl -X GET http://localhost:3001/api/students \
  -H "Authorization: Bearer <token_from_login>"
```

---

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Environment Variables
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### Installation
```bash
npm install
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will be available at `http://localhost:3001`
