# TEJA - SOLVIMATE

A translation management platform built with Next.js, MongoDB, and Redux. This application facilitates translation tasks with role-based workflows for Admins, Quality Assurance (QA) members, and Candidates.

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Teja-solvimate

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 4. Seed the database (optional - creates test users)
node standalone-seed.js

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup](#environment-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [User Roles & Test Accounts](#user-roles--test-accounts)
8. [Project Structure](#project-structure)
9. [API Documentation](#api-documentation)
10. [Features](#features)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Redux Toolkit, Tailwind CSS 4
- **Backend:** Next.js API Routes, MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **File Processing:** ExcelJS, Multer
- **UI Components:** DaisyUI, Lucide React, Framer Motion
- **Charts:** Chart.js
- **Audio:** Waveform Player

---

## 📌 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### Check Node.js version:
```bash
node --version
```

---

## 💾 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Teja-solvimate.git
cd Teja-solvimate
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required packages listed in `package.json`.

---

## ⚙️ Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Or create it manually with the following content:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/teja-solvimate
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/teja-solvimate

# JWT Secret Key (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Node Environment
NODE_ENV=development
```

### 2. Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `NODE_ENV` | Environment mode (`development`/`production`) | Optional |

---

## 🗄️ Database Setup

### Option 1: Using Seed Script (Recommended for Development)

Run the provided seed script to populate the database with initial data and test users:

```bash
node standalone-seed.js
```

**What this does:**
- Connects to your MongoDB
- Clears existing data
- Creates default languages (HINDI, ENGLISH, MARATHI, GUJRATI)
- Creates test user accounts

**Expected Output:**
```
Connecting to MongoDB...
✅ Connected to MongoDB
Clearing existing data...
✅ Cleared existing data
Inserting languages...
✅ Inserted languages
Inserting QA user...
✅ Inserted QA user
Inserting Admin user...
✅ Inserted Admin user
Inserting Candidate user...
✅ Inserted Candidate user

🎉 Database seeded successfully!

Test accounts created:
  - Admin: admin@teja.com / 12345678
  - QA: aakashqa@teja.com / 12345678
  - Candidate: aakash@teja.com / 12345678

Disconnected from MongoDB
```

### Option 2: Manual Setup

1. Ensure MongoDB is running:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string
   ```

2. The application will automatically create collections when you first run it.

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

This starts the Next.js development server on `http://localhost:3000`.

**Features in dev mode:**
- Hot module reloading
- Fast refresh
- Detailed error messages

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Linting

```bash
npm run lint
```

---

## 👥 User Roles & Test Accounts

After running the seed script, you can log in with these test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@teja.com` | `12345678` | Full system access, manage users, create tasks |
| **Quality Assurance** | `aakashqa@teja.com` | `12345678` | Review translations, provide feedback |
| **Candidate** | `aakash@teja.com` | `12345678` | Complete assigned translation tasks |

### Role Permissions

#### Admin
- ✅ Manage all users (add, delete, block/unblock)
- ✅ Create and assign tasks
- ✅ Add new languages
- ✅ View all tasks and progress
- ✅ Download translation summaries

#### Quality Assurance (QA)
- ✅ View assigned tasks
- ✅ Review candidate translations
- ✅ Approve or request rework
- ✅ Add remarks to translations

#### Candidate
- ✅ View assigned translation tasks
- ✅ Submit translations
- ✅ View feedback/remarks from QA
- ✅ Track task progress

---

## 📁 Project Structure

```
Teja-solvimate/
├── .env.local                 # Environment variables
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs           # Next.js configuration
├── package.json
├── postcss.config.mjs
├── README.md
├── standalone-seed.js         # Database seeding script
├── TODO.md
├── docs/                      # Documentation
│   ├── APIs.md               # API documentation
│   ├── DB-Design.txt         # Database schema
│   └── Teja.postman_collection.json
├── public/                   # Static assets
│   ├── images/
│   └── uploads/              # Uploaded files storage
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── candidate/       # Candidate pages
│   │   ├── chart/           # Analytics charts
│   │   ├── components/      # Reusable components
│   │   ├── database/        # Database models & configs
│   │   ├── login/           # Login page
│   │   ├── quality-assurance/ # QA dashboard pages
│   │   ├── signup/          # Signup page
│   │   ├── store/           # Redux store configuration
│   │   └── transcription/   # Transcription feature
│   └── utils/                # Utility functions
└── test-file/               # Test data files
```

### Key Directories

- **`src/app/admin/`** - Admin panel pages (dashboard, user management, task creation)
- **`src/app/api/`** - Backend API routes (authentication, employee management, translation tasks)
- **`src/app/database/`** - MongoDB schemas and database connection
- **`src/app/components/`** - Reusable UI components (sidebar, cards, modals)
- **`src/app/store/`** - Redux state management

---

## 📚 API Documentation

Full API documentation is available in [`docs/APIs.md`](docs/APIs.md).

### Key Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

#### Languages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/language` | Fetch all languages |
| POST | `/api/language` | Add new language (Admin only) |

#### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employee/candidate` | Get all candidates (Admin) |
| GET | `/api/employee/quality-assurance` | Get all QA users (Admin) |
| DELETE | `/api/employee/delete/:id` | Delete employee (Admin) |
| PATCH | `/api/employee/common/toggle-blocked-status/:id` | Block/unblock user (Admin) |

#### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employee/service/translation` | Create translation task (Admin) |
| GET | `/api/employee/service/translation` | Get all tasks (Role-based) |
| GET | `/api/employee/candidate/service/translation/:taskId` | Get task sentences (Candidate) |
| PATCH | `/api/employee/candidate/service/translation` | Submit translation (Candidate) |
| GET | `/api/employee/quality-assurance/service/translation/:taskId` | Get sentences for review (QA) |
| PATCH | `/api/employee/quality-assurance/service/translation` | Submit QA review |

#### File Processing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employee/service/translation/extract-data-from-sheet` | Extract sentences from Excel |
| GET | `/api/employee/service/translation/summary/:taskId` | Download translation summary |

---

## ✨ Features

### User Management
- 👤 Role-based authentication (Admin, QA, Candidate)
- 🔐 Secure JWT-based authentication
- 🚫 Block/unblock users
- 🗃️ User profile management

### Task Management
- 📝 Create translation tasks
- 📊 Assign tasks to specific candidates or make public
- ⏰ Set deadlines
- 📈 Track task progress

### Translation Workflow
- 📄 Sentence-by-sentence translation
- ✅ Quality assurance review process
- 💬 Remark system for rework requests
- 📥 Download translations as Excel sheets

### Dashboard & Analytics
- 📊 Task completion statistics
- 📈 Progress charts
- 👥 User management views

### File Handling
- 📊 Excel file upload and processing
- 📋 Extract sentences from spreadsheets
- 📥 Download translation summaries

---

## 🔧 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod

# Test connection string
node -e "const mongoose = require('mongoose'); mongoose.connect('your-mongodb-uri');"
```

### Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Issues

Make sure `JWT_SECRET` is set in `.env.local` and is consistent across sessions.

---

## 📝 Development Notes

### Adding New Features

1. Create new API routes in `src/app/api/`
2. Add corresponding pages in `src/app/`
3. Update Redux store if needed in `src/app/store/`
4. Add database models in `src/app/database/models/`

### Database Models

Located in `src/app/database/models/`:
- `Admin.js` - Admin user schema
- `Candidate.js` - Candidate user schema
- `QA.js` - Quality Assurance schema
- `Language.js` - Supported languages
- `Task.js` - Translation tasks
- `Sentence.js` - Individual sentences for translation

---

## 📄 License

This project is private and intended for use by Teja Organization.

---

## 🤝 Support

For issues or questions:
1. Check the [TODO.md](TODO.md) for known issues
2. Review [API Documentation](docs/APIs.md)
3. Check existing GitHub issues

---

**Built with ❤️ using Next.js and MongoDB**

