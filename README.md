# Student Management System

A modern, comprehensive web application for managing student records with role-based access control. Features separate dashboards for administrators and students, built with React frontend and Node.js/Express backend.

## 🚀 Features

### Authentication & Security
- **Student Registration**: Secure student account creation
- **Role-based Access**: Separate login portals for administrators and students
- **JWT Authentication**: Token-based security with protected routes
- **Admin Management**: Default admin account with full system access

### Admin Dashboard
- **Student Management**: View, add, edit, and delete student records
- **User Administration**: Comprehensive user management system
- **Data Analytics**: Overview of student statistics and system metrics
- **Bulk Operations**: Efficient management of multiple student records

### Student Dashboard
- **Profile Management**: View and update personal information
- **Academic Records**: Access to personal academic data
- **Secure Access**: Protected student-only areas

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Glassmorphism UI**: Modern design with glass-like effects and gradients
- **Intuitive Navigation**: Clean, user-friendly interface
- **Error Handling**: Comprehensive error boundaries and user feedback

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
   git clone https://github.com/akkkshat07/student-management-system.git
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
npm run init-admin
```

This creates the default admin user with:
- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## 🔐 Default Login Credentials

### Admin
- **Email**: admin@example.com
- **Password**: admin123

### Test Student (if any exists)
- Use credentials created through the admin panel

## 📱 Usage

1. **Admin Login**: Access the admin dashboard to manage students and users (use default credentials)
2. **Student Registration**: New students can sign up and create their accounts
3. **Student Login**: Students can login and view/update their personal information


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
Add commentMore actions
**Note**: This is a development project. For production use, ensure proper security measures, input validation, and error handling are implemented.
