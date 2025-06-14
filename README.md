# Student Management System

A comprehensive web application for managing student records with role-based access control. The system features separate dashboards for administrators and students, built with React frontend and Node.js/Express backend.

## 🚀 Features

- **Role-based Authentication**: Separate login for Admin and Students
- **Admin Dashboard**: 
  - View all students
  - Add new students
  - Edit student details
  - Delete students
  - User management
- **Student Dashboard**: 
  - View personal profile
  - Update personal information
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Secure API**: JWT-based authentication with protected routes

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Jest & React Testing Library

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

## 📁 Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   └── services/     # API service functions
│   └── public/           # Static assets
├── backend/           # Node.js backend API
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Authentication middleware
│   └── server.js         # Main server file
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd student-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

### Initial Admin Setup

Run the admin initialization script:
```bash
cd backend
node initAdmin.js
```

This creates an admin user with:
- **Email**: admin@example.com
- **Password**: admin123

## 🔐 Default Login Credentials

### Admin
- **Email**: admin@example.com
- **Password**: admin123

### Test Student (if any exists)
- Use credentials created through the admin panel

## 📱 Usage

1. **Admin Login**: Access the admin dashboard to manage students and users
2. **Student Login**: Students can view and update their personal information
3. **Registration**: New users can sign up (role assignment may require admin approval)

## 🌐 Deployment

### Frontend (Netlify)
1. Build the frontend: `npm run build` in the frontend directory
2. Deploy the `build` folder to Netlify
3. Configure environment variables for production API URL

### Backend (Heroku/Railway/Other)
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection is configured for production
3. Deploy the backend directory

## 🧪 Testing

Run tests for the frontend:
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Note**: This is a development project. For production use, ensure proper security measures, input validation, and error handling are implemented.
