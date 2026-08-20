# TaskFlow: Modern Full-Stack MERN Task Management Application

A production-ready, feature-rich Task Management Web Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT user authentication, file attachment uploads via Cloudinary, automated email notifications via Nodemailer, and live location weather integration via OpenWeatherMap API.

---

## Live Links & Previews

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://task-flow-full-stack-mern-task-mana.vercel.app)
[![Source Code](https://img.shields.io/badge/SOURCE-CODE-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ananyadarna/TaskFlow-FullStack-MERN-Task-Management-Application)
[![Backend API](https://img.shields.io/badge/BACKEND-API-000000?style=for-the-badge&logo=render&logoColor=white)](https://taskflow-fullstack-mern-task-management.onrender.com)
[![Video Demo](https://img.shields.io/badge/VIDEO-DEMO-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1XI4ZayL2K4exGEqkHgIEDLT0gA4gJEF5/view?usp=sharing)

- **Live Demo (Frontend Vercel)**: [https://task-flow-full-stack-mern-task-mana.vercel.app](https://task-flow-full-stack-mern-task-mana.vercel.app)
- **API Endpoint (Backend Render)**: [https://taskflow-fullstack-mern-task-management.onrender.com](https://taskflow-fullstack-mern-task-management.onrender.com)
- **Source Code Repository**: [https://github.com/ananyadarna/TaskFlow-FullStack-MERN-Task-Management-Application](https://github.com/ananyadarna/TaskFlow-FullStack-MERN-Task-Management-Application)
- **Live Screen Recording Demo (Google Drive)**: [https://drive.google.com/file/d/1XI4ZayL2K4exGEqkHgIEDLT0gA4gJEF5/view?usp=sharing](https://drive.google.com/file/d/1XI4ZayL2K4exGEqkHgIEDLT0gA4gJEF5/view?usp=sharing)

---

## Key Features

- **Secure User Authentication**: Signup and login flow powered by JSON Web Tokens (JWT) and bcryptjs password hashing. Each task belongs exclusively to the logged-in user (`req.user._id`).
- **Complete Task CRUD**: Create, read, update, and delete tasks with attributes: `title`, `description`, `status` (`PENDING`, `IN_PROGRESS`, `DONE`), `priority` (`LOW`, `MEDIUM`, `HIGH`), `dueDate`, `location`, and `fileUrl`.
- **Filtering, Sorting & Pagination**:
  - Filter tasks dynamically by status and priority.
  - Live keyword search by title and description.
  - Page-based pagination returning `{ data: tasks, meta: { total, page, lastPage } }`.
- **Cloudinary File Uploads**: Attach image or document files to tasks via Multer and Cloudinary storage. Render live inline image preview thumbnails on task cards and modals.
- **Automated Email Notifications**: Confirmation emails dispatched via Nodemailer upon task creation and when a task's status is marked as `DONE`.
- **Live Weather Integration**: Real-time city temperature, weather condition description, and weather icons fetched via OpenWeatherMap API.
- **Responsive UI**: Vite + React 18 frontend styled with Tailwind CSS and Lucide icons.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Database** | MongoDB + Mongoose | ODM data modeling and document store |
| **Backend** | Node.js + Express.js | RESTful API server & routing |
| **Auth** | JSONWebToken + bcryptjs | JWT issue/verification & password hashing |
| **Integrations** | Cloudinary, Multer, Nodemailer, Axios | Multipart uploads, SMTP emails, OpenWeatherMap API |
| **Frontend** | React.js (Vite) + Tailwind CSS | Responsive SPA UI dashboard & modals |
| **State** | React Context API + Axios Interceptors | Global auth state & bearer token interceptor |

---

## Project Structure

```
task-management-mern/
├── README.md
├── .gitignore
├── backend/
│   ├── config/
│   │   ├── db.js             # Mongoose database connection
│   │   └── cloudinary.js     # Cloudinary SDK & Multer storage
│   ├── controllers/
│   │   ├── authController.js # Signup, Login & Me handlers
│   │   └── taskController.js # Task CRUD, filters & pagination
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Bearer protection guard
│   │   ├── uploadMiddleware.js # Multer single file upload handler
│   │   └── errorMiddleware.js# Central 404 & 500 error handler
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt password hook
│   │   └── Task.js           # Task schema referencing User
│   ├── routes/
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   └── taskRoutes.js     # /api/tasks endpoints
│   ├── utils/
│   │   ├── emailService.js   # Nodemailer email dispatcher
│   │   └── weatherService.js # OpenWeatherMap API wrapper
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express application entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Top bar navigation
    │   │   ├── ProtectedRoute.jsx   # Auth route guard
    │   │   ├── TaskCard.jsx         # Card with weather & image thumbnail
    │   │   ├── TaskFormModal.jsx    # Create/Edit task modal with preview
    │   │   └── WeatherBadge.jsx     # Weather pill badge
    │   ├── context/
    │   │   └── AuthContext.jsx      # Authentication context provider
    │   ├── pages/
    │   │   ├── DashboardPage.jsx    # Main task management dashboard
    │   │   ├── LoginPage.jsx        # Login page
    │   │   └── RegisterPage.jsx     # Registration page
    │   ├── services/
    │   │   └── api.js               # Axios instance with Bearer interceptor
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user & return JWT token |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials & return JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Get tasks with `page`, `limit`, `status`, `priority`, `search`, date filters |
| `POST` | `/api/tasks` | Private | Create task with file attachment upload & creation email |
| `GET` | `/api/tasks/:id` | Private | Get task details by ID with weather context |
| `PUT` | `/api/tasks/:id` | Private | Update task details & trigger completion email if `status` -> `DONE` |
| `DELETE` | `/api/tasks/:id` | Private | Delete task owned by logged-in user |

---

## Installation & Local Setup

### 1. Prerequisites
- Node.js (v18.x or v20.x)
- MongoDB instance (Local or MongoDB Atlas Cluster)

### 2. Environment Variables

Create `.env` inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=super_secret_jwt_key_taskflow_2026

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

OPENWEATHER_API_KEY=your_openweather_api_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Create `.env` inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```

### 4. Run the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
