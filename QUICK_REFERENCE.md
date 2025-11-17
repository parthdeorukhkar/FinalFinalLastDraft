# HR Automation System - Quick Reference Card

## 🚀 Start All Services

```bash
# Terminal 1: Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: AI Service (Port 8000)
cd ai-service
source venv/bin/activate  # Windows: venv\Scripts\activate
cd src
python api.py

# Terminal 3: Frontend (Port 3000)
cd frontend
npm start
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React UI |
| Backend API | http://localhost:5000/api | REST API |
| Backend Health | http://localhost:5000/health | Health check |
| AI Service | http://localhost:8000 | Python NLP API |
| AI Health | http://localhost:8000/health | Health check |
| MongoDB | mongodb://localhost:27017 | Database |

---

## 📁 Key File Locations

```
Project Root
├── backend/
│   ├── src/server.js              ← Main backend entry
│   ├── src/models/                ← Database schemas
│   ├── src/controllers/           ← Business logic
│   ├── src/routes/                ← API routes
│   └── .env                       ← Backend config
│
├── frontend/
│   ├── src/App.js                 ← Main React component
│   ├── src/pages/                 ← Page components
│   ├── src/services/api.js        ← API calls
│   └── .env                       ← Frontend config
│
└── ai-service/
    ├── src/api.py                 ← FastAPI server
    ├── src/resume_parser.py       ← NLP parser
    ├── src/matching_engine.py     ← Matching algorithm
    └── .env                       ← AI service config
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr_automation
JWT_SECRET=your_secret_key
OPENAI_API_KEY=sk-...
PYTHON_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### AI Service (.env)
```env
OPENAI_API_KEY=sk-...
SPACY_MODEL=en_core_web_md
PORT=8000
```

---

## 📡 API Endpoints Cheat Sheet

### Authentication
```
POST /api/auth/register    - Create new user
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user
```

### Candidates
```
GET    /api/candidates           - Get all candidates
GET    /api/candidates/:id       - Get candidate by ID
POST   /api/candidates           - Create candidate (with resume)
PUT    /api/candidates/:id       - Update candidate
DELETE /api/candidates/:id       - Delete candidate
POST   /api/candidates/:id/analyze - Analyze with AI
```

### Jobs
```
GET    /api/jobs                 - Get all jobs
GET    /api/jobs/:id             - Get job by ID
POST   /api/jobs                 - Create job
PUT    /api/jobs/:id             - Update job
DELETE /api/jobs/:id             - Delete job
```

### Interviews
```
GET    /api/interviews           - Get all interviews
POST   /api/interviews           - Schedule interview
PUT    /api/interviews/:id       - Update interview
POST   /api/interviews/:id/feedback - Add feedback
```

### AI Service
```
POST /parse-resume        - Parse resume file
POST /match-candidate     - Calculate match score
POST /chat                - RAG chatbot (Sprint 5)
```

---

## 🔧 Common Commands

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# AI Service
cd ai-service && pip install -r requirements.txt
python -m spacy download en_core_web_md
```

### Database
```bash
# Start MongoDB (Mac/Linux)
sudo systemctl start mongod

# Start MongoDB (Windows)
mongod

# Connect with MongoDB Compass
mongodb://localhost:27017
```

### Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Python tests
cd ai-service && pytest
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Check if mongod is running |
| Port already in use | Change port in .env file |
| Spacy model error | Run `python -m spacy download en_core_web_md` |
| Frontend can't reach backend | Check backend is running on port 5000 |
| JWT token expired | Login again to get new token |
| CORS error | Check FRONTEND_URL in backend .env |

---

## 📦 Package Scripts

### Backend (package.json)
```json
"start": "node src/server.js"      // Production
"dev": "nodemon src/server.js"     // Development
"test": "jest --coverage"          // Tests
```

### Frontend (package.json)
```json
"start": "react-scripts start"     // Development
"build": "react-scripts build"     // Production build
"test": "react-scripts test"       // Tests
```

---

## 🗄️ Database Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| users | System users | email, password, role |
| candidates | Job applicants | email, resumeUrl, matchScore |
| jobs | Job postings | title, requiredSkills, status |
| interviews | Interview schedules | candidate, scheduledDate, status |

---

## 🎨 UI Routes

| Route | Component | Access |
|-------|-----------|--------|
| /login | Login | Public |
| /dashboard | Dashboard | Private |
| /candidates | Candidates | Private |
| /jobs | Jobs | Private |
| /analytics | Analytics | Private |
| /settings | Settings | Private |

---

## 📊 Sprint Progress Tracker

- ✅ Sprint 1: Foundation & Infrastructure (Weeks 1-2)
- 🎯 Sprint 2: Resume Parsing & NLP (Weeks 3-4)
- 🔜 Sprint 3: Scheduling & Emails (Weeks 5-6)
- 🔜 Sprint 4: Analytics Dashboard (Weeks 7-8)
- 🔜 Sprint 5: RAG Chatbot (Weeks 9-10)
- 🔜 Sprint 6: Testing & Deployment (Weeks 11-12)

---

## 🔐 Default Test Credentials

```
Email: admin@hr.com
Password: password123
Role: Admin
```

(Create this user via POST /api/auth/register first)

---

## 📝 Code Snippets

### Create Candidate (JavaScript)
```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john@example.com');
formData.append('phone', '1234567890');
formData.append('appliedFor', jobId);
formData.append('resume', fileObject);

await candidateAPI.create(formData);
```

### API Call with Auth (JavaScript)
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('/api/candidates', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 🎯 Next Sprint Goals (Sprint 2)

1. ✅ Build candidate list UI with filtering
2. ✅ Implement drag-drop resume upload
3. ✅ Display AI analysis results
4. ✅ Add candidate detail modal
5. ✅ Implement status updates

---

## 📚 Documentation Files

1. **README.md** - Project overview
2. **SETUP_GUIDE.md** - Detailed setup steps
3. **AGILE_SPRINT_PLAN.md** - Sprint breakdown
4. **PROJECT_STRUCTURE.md** - Architecture details
5. **PROJECT_SUMMARY.md** - Current status
6. **QUICK_REFERENCE.md** - This file

---

## 💾 Backup & Version Control

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Sprint 1 complete"

# Create remote repository on GitHub
git remote add origin <your-repo-url>
git push -u origin main
```

---

## 🔍 Useful Tools

- **MongoDB Compass** - GUI for MongoDB
- **Postman/Insomnia** - API testing
- **VS Code Extensions** - ESLint, Prettier, Python
- **React DevTools** - Browser extension
- **Redux DevTools** - State management (if using Redux)

---

**Print this card and keep it handy!** 📋
