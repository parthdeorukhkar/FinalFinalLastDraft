# HR Automation System - Setup Guide

## Quick Start Guide

Follow these steps to get the HR Automation System up and running on your local machine.

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/downloads/)
- **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud database) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/downloads)

---

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd hr-automation-system
```

---

## Step 2: Backend Setup (Node.js/Express)

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hr_automation
JWT_SECRET=your_super_secret_key_here
OPENAI_API_KEY=your_openai_api_key
PYTHON_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 2.3 Start MongoDB

If using local MongoDB:
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
```

### 2.4 Start Backend Server

```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

✅ Test: Visit `http://localhost:5000/health` - you should see a success message

---

## Step 3: Python AI Service Setup

### 3.1 Create Virtual Environment

```bash
cd ../ai-service
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

### 3.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Download Spacy Model

```bash
python -m spacy download en_core_web_md
```

### 3.4 Configure Environment Variables

Create a `.env` file in the `ai-service/` directory:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
SPACY_MODEL=en_core_web_md
PORT=8000
```

### 3.5 Start Python Service

```bash
cd src
python api.py
```

The AI service should now be running on `http://localhost:8000`

✅ Test: Visit `http://localhost:8000/health` - you should see a health check response

---

## Step 4: Frontend Setup (React)

### 4.1 Install Dependencies

```bash
cd ../../frontend
npm install
```

### 4.2 Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AI_SERVICE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

### 4.3 Start Frontend Development Server

```bash
npm start
```

The frontend should now be running on `http://localhost:3000`

✅ The application will automatically open in your browser

---

## Step 5: Create Initial User

### Option 1: Using API Tool (Postman/Insomnia)

Send a POST request to `http://localhost:5000/api/auth/register`:

```json
{
  "name": "Admin User",
  "email": "admin@hr.com",
  "password": "password123",
  "role": "Admin",
  "department": "IT"
}
```

### Option 2: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `hr_automation`
4. Create collection: `users`
5. Insert document manually

---

## Step 6: Login to the Application

1. Go to `http://localhost:3000/login`
2. Use the credentials you created:
   - Email: `admin@hr.com`
   - Password: `password123`
3. You should be redirected to the dashboard

---

## Running All Services

For convenience, you can run all three services in separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - AI Service:**
```bash
cd ai-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
cd src
python api.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

---

## Troubleshooting

### Backend Issues

**Problem:** MongoDB connection error
- **Solution:** Make sure MongoDB is running (`mongod` command)
- Check if `MONGODB_URI` in `.env` is correct

**Problem:** Port 5000 already in use
- **Solution:** Change `PORT` in backend `.env` to another port (e.g., 5001)

### Python Service Issues

**Problem:** Spacy model not found
- **Solution:** Run `python -m spacy download en_core_web_md`

**Problem:** Module not found errors
- **Solution:** Make sure virtual environment is activated and dependencies are installed

### Frontend Issues

**Problem:** Cannot connect to backend
- **Solution:** Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

**Problem:** npm install fails
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## Testing the System

### 1. Create a Job Posting

Use Postman/Insomnia:
```
POST http://localhost:5000/api/jobs
Authorization: Bearer <your-token-from-login>
Body:
{
  "title": "Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "description": "We are looking for a talented software engineer...",
  "requiredSkills": [
    {"name": "Python", "importance": "Required"},
    {"name": "React", "importance": "Preferred"}
  ],
  "requiredExperience": {"min": 2, "max": 5},
  "requiredEducation": "Bachelor"
}
```

### 2. Upload a Resume

Use the frontend or API:
```
POST http://localhost:5000/api/candidates
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

firstName: John
lastName: Doe
email: john@example.com
phone: 1234567890
appliedFor: <job-id-from-step-1>
resume: <upload-pdf-or-docx-file>
```

### 3. Check AI Analysis

The resume should be automatically parsed by the Python AI service.
View the candidate in the dashboard to see extracted skills, experience, and match score.

---

## Next Steps

Now that your system is running:

1. **Explore the Dashboard** - View candidates, jobs, and analytics
2. **Upload Test Resumes** - Test the AI parsing functionality
3. **Review Sprint Plan** - Check [AGILE_SPRINT_PLAN.md](AGILE_SPRINT_PLAN.md) for development roadmap
4. **Start Development** - Begin implementing Sprint 2 features

---

## Development Workflow

1. Create a new branch for each feature
2. Make changes and test locally
3. Commit with clear messages
4. Create pull request for review
5. Merge to main after approval

---

## Need Help?

- Check [README.md](README.md) for project overview
- Review [AGILE_SPRINT_PLAN.md](AGILE_SPRINT_PLAN.md) for development timeline
- Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture details

---

## OpenAI API Key Setup (Optional)

For AI features (resume analysis, chatbot):

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add to `.env` files in both `backend/` and `ai-service/`:
   ```
   OPENAI_API_KEY=sk-...
   ```

**Note:** The system will work without OpenAI API key, but AI features will be limited.

---

**Happy Coding!** 🚀
