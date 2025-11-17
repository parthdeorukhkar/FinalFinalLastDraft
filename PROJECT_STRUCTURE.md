# HR Automation System - Project Structure

```
hr-automation-system/
├── frontend/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Dashboard/
│   │   │   ├── CandidateList/
│   │   │   ├── ResumeUpload/
│   │   │   ├── Analytics/
│   │   │   └── Chatbot/
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Candidates.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/            # API calls
│   │   │   └── api.js
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   │   ├── candidateController.js
│   │   │   ├── jobController.js
│   │   │   ├── interviewController.js
│   │   │   └── emailController.js
│   │   ├── models/              # Database models
│   │   │   ├── Candidate.js
│   │   │   ├── Job.js
│   │   │   ├── Application.js
│   │   │   └── Interview.js
│   │   ├── routes/              # API routes
│   │   │   ├── candidateRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   └── emailRoutes.js
│   │   ├── middleware/          # Auth, validation
│   │   │   ├── auth.js
│   │   │   ├── upload.js
│   │   │   └── errorHandler.js
│   │   ├── services/            # Business logic
│   │   │   ├── emailService.js
│   │   │   ├── calendarService.js
│   │   │   └── analyticsService.js
│   │   ├── config/              # Configuration
│   │   │   ├── database.js
│   │   │   └── config.js
│   │   ├── utils/               # Utilities
│   │   └── server.js            # Entry point
│   ├── uploads/                 # Uploaded resumes
│   ├── package.json
│   └── .env
│
├── ai-service/                   # Python NLP/AI service
│   ├── src/
│   │   ├── resume_parser.py     # Resume parsing
│   │   ├── nlp_processor.py     # NLP operations
│   │   ├── matching_engine.py   # Resume-job matching
│   │   ├── rag_chatbot.py       # RAG chatbot
│   │   └── api.py               # Flask/FastAPI endpoints
│   ├── models/                  # Trained models
│   ├── data/                    # Training data
│   ├── requirements.txt
│   └── .env
│
├── database/
│   ├── migrations/              # DB migrations
│   └── seeds/                   # Seed data
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── USER_MANUAL.md
│   └── DEPLOYMENT_GUIDE.md
│
├── tests/
│   ├── frontend/               # Frontend tests
│   ├── backend/                # Backend tests
│   └── ai-service/             # Python tests
│
├── scripts/
│   ├── setup.sh                # Project setup script
│   ├── deploy.sh               # Deployment script
│   └── seed-db.js              # Database seeding
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # CI/CD pipeline
│
├── docker-compose.yml           # Docker setup
├── .gitignore
├── README.md
└── AGILE_SPRINT_PLAN.md
```

## Technology Stack Details

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Context API / Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts / Chart.js
- **Forms**: React Hook Form
- **File Upload**: React Dropzone

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Storage**: Multer + AWS S3
- **Email**: Nodemailer + Gmail API
- **Calendar**: Google Calendar API
- **Validation**: Joi / Express Validator
- **API Docs**: Swagger

### AI/NLP Service
- **Language**: Python 3.10+
- **Framework**: FastAPI / Flask
- **NLP**: Spacy, NLTK
- **AI**: OpenAI API, LangChain
- **Vector DB**: Pinecone / ChromaDB
- **PDF Parsing**: PyPDF2, pdfplumber
- **DOCX Parsing**: python-docx
- **ML**: scikit-learn

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / AWS EC2
- **Database Hosting**: MongoDB Atlas
- **Monitoring**: LogRocket / Sentry

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hr_automation
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_API_KEY=your_calendar_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
PYTHON_SERVICE_URL=http://localhost:8000
```

### Python AI Service (.env)
```
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
SPACY_MODEL=en_core_web_md
PORT=8000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB
- Git

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd hr-automation-system

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Python dependencies
cd ../ai-service
pip install -r requirements.txt

# Set up environment variables
# Copy .env.example to .env in backend, frontend, and ai-service

# Start development servers
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Python service
cd ai-service && python src/api.py
```

## Development Workflow

1. Create feature branch from `main`
2. Implement feature following DoD
3. Write tests
4. Create pull request
5. Code review
6. Merge to `main`
7. Auto-deploy to staging
8. Manual deploy to production

## API Structure

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.yourapp.com/api`

### Endpoints
- `/auth` - Authentication
- `/candidates` - Candidate management
- `/jobs` - Job postings
- `/applications` - Application tracking
- `/interviews` - Interview scheduling
- `/emails` - Email automation
- `/analytics` - Analytics data
- `/chatbot` - AI chatbot

### Python AI Service
- Base URL: `http://localhost:8000`
- `/parse-resume` - Parse resume
- `/match-candidate` - Match candidate to job
- `/chat` - RAG chatbot endpoint
