# Complete Setup Guide - HR Automation System

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [AI Models Used](#ai-models-used)
5. [Initial Setup](#initial-setup)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [AI Service Setup](#ai-service-setup)
9. [Database Setup](#database-setup)
10. [Environment Configuration](#environment-configuration)
11. [Running the Application](#running-the-application)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)
14. [Project Structure](#project-structure)
15. [Key Features](#key-features)

---

## System Requirements

### Hardware Requirements
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 5GB free space
- **Processor**: Dual-core 2.0GHz or higher

### Software Requirements
- **Node.js**: v18.x or higher (v20.x recommended)
- **Python**: 3.8 or higher (3.10+ recommended)
- **MongoDB**: v6.0 or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Operating System
- Windows 10/11
- macOS 10.15 or higher
- Linux (Ubuntu 20.04 or higher)

---

## Project Overview

**HR Automation System** is a full-stack web application that streamlines the recruitment process using AI-powered resume parsing and candidate matching.

### What This System Does:
- Automated resume parsing using Google Gemini AI
- AI-powered candidate-job matching with percentage scores
- Job posting management
- Interview scheduling with email notifications
- Candidate tracking and management
- Dark mode support across all pages
- Real-time AI analysis of candidate strengths and weaknesses

---

## Technology Stack

### Frontend
- **Framework**: React.js 18.x
- **Styling**: Tailwind CSS 3.x
- **Icons**: React Icons (Feather Icons)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email Service**: Nodemailer with Gmail
- **Security**: bcryptjs, CORS
- **Validation**: Express Validator

### AI Service
- **Language**: Python 3.10+
- **Web Framework**: FastAPI
- **AI Model**: Google Gemini 1.5 Pro
- **PDF Processing**: PyPDF2
- **DOCX Processing**: python-docx
- **HTTP Client**: httpx

### Database
- **MongoDB**: NoSQL database for all data storage
- **Collections**: Users, Jobs, Candidates, Interviews

---

## AI Models Used

### Google Gemini 1.5 Pro
**Purpose**: Resume parsing and candidate analysis

**Capabilities**:
- Extracts structured data from resumes (PDF/DOCX)
- Parses contact information, skills, experience, education
- Generates AI summaries of candidate profiles
- Identifies candidate strengths and weaknesses
- Calculates job-candidate match scores
- Recommends suitable job roles

**API**: Google Generative AI API
**Model ID**: `gemini-1.5-pro`

**What It Parses**:
- Personal Information (name, email, phone)
- Professional Summary
- Work Experience (company, position, duration, responsibilities)
- Education (degree, institution, field, year)
- Skills (technical and soft skills)
- Projects and Achievements
- Certifications

**Matching Algorithm**:
- Skill-based matching (40% weight)
- Experience matching (30% weight)
- Education matching (20% weight)
- Keyword analysis (10% weight)

---

## Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/parthdeorukhkar/FinalFinalLastDraft.git
cd FinalFinalLastDraft
```

### 2. Install Node.js
Download and install from: https://nodejs.org/
```bash
# Verify installation
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

### 3. Install Python
Download and install from: https://www.python.org/downloads/
```bash
# Verify installation
python --version  # Should show 3.8 or higher
pip --version
```

### 4. Install MongoDB
**Option 1: MongoDB Atlas (Cloud - Recommended)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a new cluster
- Get your connection string

**Option 2: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Connection string: `mongodb://localhost:27017/hr-automation`

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

**Key Dependencies Installed**:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: Authentication
- `bcryptjs`: Password hashing
- `multer`: File uploads
- `nodemailer`: Email service
- `cors`: Cross-origin requests
- `dotenv`: Environment variables

### 3. Create Environment File
Create a file named `.env` in the `backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hr-automation
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr-automation?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=HR Automation <your-gmail@gmail.com>

# AI Service URL
AI_SERVICE_URL=http://localhost:8000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 4. Email Setup (Gmail App Password)
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password to `.env` as `EMAIL_PASSWORD`

### 5. Create Upload Directory
```bash
mkdir uploads
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

**Key Dependencies Installed**:
- `react`: UI library
- `react-dom`: React DOM rendering
- `react-router-dom`: Routing
- `axios`: HTTP client
- `react-toastify`: Notifications
- `react-icons`: Icon library
- `tailwindcss`: CSS framework

### 3. Create Environment File
Create a file named `.env` in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## AI Service Setup

### 1. Navigate to AI Service Directory
```bash
cd ../ai-service
```

### 2. Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Key Dependencies Installed**:
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `google-generativeai`: Google Gemini API
- `PyPDF2`: PDF processing
- `python-docx`: DOCX processing
- `httpx`: HTTP client
- `pydantic`: Data validation

### 4. Get Google Gemini API Key

**Steps to Get API Key**:
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### 5. Create Environment File
Create a file named `.env` in the `ai-service` folder:

```env
# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Backend URL
BACKEND_URL=http://localhost:5000

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

---

## Database Setup

### 1. Start MongoDB
**If using local MongoDB**:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 2. Database Structure
The application will automatically create these collections:
- **users**: Admin users and credentials
- **jobs**: Job postings
- **candidates**: Candidate profiles and resumes
- **interviews**: Interview schedules

### 3. Create Initial Admin User
The system will prompt you to create an admin account on first run, or you can use MongoDB Compass to create one manually.

**Default Admin Credentials** (for testing):
- Email: `admin@example.com`
- Password: `admin123`

---

## Environment Configuration

### Summary of All .env Files Needed

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr-automation
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=HR Automation <your-gmail@gmail.com>
AI_SERVICE_URL=http://localhost:8000
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**ai-service/.env**
```env
GEMINI_API_KEY=your-gemini-api-key
BACKEND_URL=http://localhost:5000
PORT=8000
```

---

## Running the Application

### Method 1: Run All Services Separately

**Terminal 1 - Backend**:
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

**Terminal 3 - AI Service**:
```bash
cd ai-service
# Activate virtual environment first
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run the service
python -m uvicorn src.api:app --reload --port 8000
```
AI Service runs on: http://localhost:8000

### Method 2: Quick Start Script

Create a file named `start-all.bat` (Windows) or `start-all.sh` (macOS/Linux) in the root directory:

**start-all.bat** (Windows):
```batch
@echo off
echo Starting HR Automation System...

start cmd /k "cd backend && npm start"
timeout /t 5 /nobreak
start cmd /k "cd frontend && npm start"
timeout /t 5 /nobreak
start cmd /k "cd ai-service && venv\Scripts\activate && python -m uvicorn src.api:app --reload --port 8000"

echo All services started!
```

**start-all.sh** (macOS/Linux):
```bash
#!/bin/bash
echo "Starting HR Automation System..."

# Start backend
cd backend
npm start &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

# Start AI service
cd ../ai-service
source venv/bin/activate
python -m uvicorn src.api:app --reload --port 8000 &
AI_PID=$!

echo "All services started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "AI Service PID: $AI_PID"
```

---

## Testing

### 1. Test Backend API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or use browser: http://localhost:5000/api/health
```

### 2. Test AI Service
```bash
# Test health endpoint
curl http://localhost:8000/health

# Or use browser: http://localhost:8000/health
```

### 3. Test Frontend
Open browser and navigate to: http://localhost:3000

### 4. Test Resume Parsing
1. Log in to the system
2. Go to Candidates page
3. Click "Add Candidate"
4. Upload a resume (PDF or DOCX)
5. Select a job position
6. Click "Analyze Resume"
7. Check AI-generated match score and analysis

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
**Error**: `Port 5000 is already in use`
**Solution**:
```bash
# Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. MongoDB Connection Failed
**Error**: `MongooseServerSelectionError`
**Solution**:
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `backend/.env`
- For MongoDB Atlas, check network access and IP whitelist

#### 3. AI Service Not Responding
**Error**: `AI service unavailable`
**Solution**:
- Check if Python virtual environment is activated
- Verify Gemini API key in `ai-service/.env`
- Check AI service logs for errors
- Test API key: https://makersuite.google.com/app/apikey

#### 4. Email Not Sending
**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`
**Solution**:
- Enable 2-Factor Authentication on Gmail
- Generate App-specific password
- Use app password in `EMAIL_PASSWORD` (not your regular Gmail password)

#### 5. Frontend Build Errors
**Error**: `Module not found`
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 6. Resume Upload Fails
**Error**: `File upload failed`
**Solution**:
- Check `uploads/` folder exists in backend
- Verify file size is under 5MB
- Check file format (PDF or DOCX only)
- Check multer configuration in `backend/src/middleware/upload.js`

#### 7. Dark Mode Not Working
**Solution**:
- Clear browser cache
- Check if ThemeContext is imported in App.js
- Verify Tailwind config has `darkMode: 'class'`

---

## Project Structure

```
FinalYearFinalProjectLastDraft/
│
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── server.js         # Main server file
│   ├── uploads/              # Uploaded resumes
│   ├── package.json
│   └── .env                  # Backend environment variables
│
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── .env                  # Frontend environment variables
│
├── ai-service/               # Python AI service
│   ├── src/
│   │   ├── api.py           # FastAPI application
│   │   ├── gemini_parser.py # Gemini AI integration
│   │   ├── matching_engine.py # Matching algorithm
│   │   └── resume_parser.py # Resume parsing logic
│   ├── requirements.txt      # Python dependencies
│   ├── .env                 # AI service environment variables
│   └── venv/                # Python virtual environment
│
└── Documentation Files       # All .md files
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── DARK_MODE_GUIDE.md
    └── ... (other documentation)
```

---

## Key Features

### 1. AI-Powered Resume Parsing
- Automatic extraction of candidate information
- Support for PDF and DOCX formats
- Structured data extraction (experience, education, skills)

### 2. Intelligent Job Matching
- AI calculates match percentage (0-100%)
- Multi-factor matching algorithm
- Ranked candidate recommendations

### 3. Interview Management
- Schedule interviews with email notifications
- Support for video, in-person, phone interviews
- Bulk interview scheduling
- Interview feedback system

### 4. Job Posting Management
- Create and manage job postings
- Track applicants per job
- Filter by status, department
- View job analytics

### 5. Dark Mode
- System-wide dark mode support
- Smooth transitions
- Persistent user preference
- Toggle button in sidebar

### 6. Email Notifications
- Automated interview invitations
- Status change notifications
- Application confirmations

### 7. Dashboard Analytics
- Total candidates, jobs, interviews
- Recent candidate activity
- Quick stats overview

---

## Default Credentials

**Admin Login** (Create on first run or manually):
- Email: `admin@hrautomation.com`
- Password: `Admin@123`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create candidate
- `POST /api/candidates/upload` - Upload resume
- `POST /api/candidates/:id/analyze` - Analyze with AI
- `GET /api/candidates/job/:jobId` - Get candidates by job

### Interviews
- `GET /api/interviews` - Get all interviews
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id` - Update interview
- `DELETE /api/interviews/:id` - Cancel interview

### AI Service
- `POST /parse-resume` - Parse resume with AI
- `POST /match-candidate` - Match candidate to job
- `GET /health` - Health check

---

## Updating the Project

### Pull Latest Changes
```bash
git pull origin main
```

### Update Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# AI Service
cd ai-service
pip install -r requirements.txt
```

---

## Support and Documentation

- **Main README**: See [README.md](README.md)
- **Setup Guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Dark Mode**: See [DARK_MODE_GUIDE.md](DARK_MODE_GUIDE.md)
- **Architecture**: See [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md)

---

## Quick Reference Commands

```bash
# Start MongoDB (local)
mongod

# Start Backend
cd backend && npm start

# Start Frontend
cd frontend && npm start

# Start AI Service
cd ai-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn src.api:app --reload

# Install all dependencies
npm install  # in backend and frontend folders
pip install -r requirements.txt  # in ai-service folder

# Check running processes
# Windows: tasklist | findstr node
# macOS/Linux: ps aux | grep node
```

---

## Production Deployment Notes

### Before Deploying:
1. Change all `.env` secrets
2. Set `NODE_ENV=production`
3. Use production MongoDB cluster
4. Enable CORS only for your domain
5. Use HTTPS for all services
6. Set up proper logging
7. Configure rate limiting
8. Set up automated backups

---

## License

This project is for educational purposes.

---

## Contributors

- Your Name - Initial Development
- Claude AI - AI Implementation Assistant

---

**Last Updated**: November 2025
**Version**: 1.0.0