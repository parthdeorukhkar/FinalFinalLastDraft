# HR Automation System

> AI-powered recruitment automation platform to streamline hiring processes

## Overview

The HR Automation System is a comprehensive solution that automates key recruitment tasks including resume screening, interview scheduling, candidate communication, and provides intelligent insights through AI-powered analytics and chatbot.

## Key Features

- **AI Resume Screening**: Automatically parse and rank resumes using NLP
- **Smart Matching**: Match candidates to job requirements with confidence scores
- **Auto-Scheduling**: Integrate with Google Calendar for automated interview scheduling
- **Email Automation**: Send acknowledgments, interview invites, and feedback automatically
- **Analytics Dashboard**: Visualize recruitment metrics and KPIs
- **RAG Chatbot**: AI assistant for HR queries using Retrieval Augmented Generation
- **Candidate Portal**: Allow candidates to track application status

## Tech Stack

### Frontend
- React.js 18 with Hooks
- Tailwind CSS for styling
- Axios for API calls
- Recharts for data visualization

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT authentication
- Google Calendar API
- Gmail API / Nodemailer

### AI/NLP Service
- Python 3.10+
- Spacy for NLP
- LangChain for RAG
- OpenAI API
- FastAPI for service endpoints

## Project Structure

```
hr-automation-system/
├── frontend/           # React application
├── backend/            # Node.js API server
├── ai-service/         # Python NLP service
├── database/           # Database migrations & seeds
├── docs/               # Documentation
└── tests/              # Test suites
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hr-automation-system
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Install Python Dependencies**
```bash
cd ../ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

5. **Configure Environment Variables**

Create `.env` files in `backend/`, `frontend/`, and `ai-service/` directories.

**Backend .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr_automation
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
PYTHON_SERVICE_URL=http://localhost:8000
```

**AI Service .env:**
```
OPENAI_API_KEY=your_openai_api_key
PORT=8000
SPACY_MODEL=en_core_web_md
```

**Frontend .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

Open three terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 3 - AI Service:**
```bash
cd ai-service
python src/api.py
```
AI Service runs on `http://localhost:8000`

## Development Approach

This project follows **Agile Scrum** methodology with 2-week sprints:

- **Sprint 1-2**: Foundation & Infrastructure
- **Sprint 3-4**: Resume Parsing & NLP Core
- **Sprint 5-6**: Interview Scheduling & Email Automation
- **Sprint 7-8**: Analytics & Candidate Dashboard
- **Sprint 9-10**: RAG Chatbot & AI Integration
- **Sprint 11-12**: Testing, Optimization & Deployment

See [AGILE_SPRINT_PLAN.md](AGILE_SPRINT_PLAN.md) for detailed sprint breakdown.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `POST /api/candidates` - Create candidate (with resume upload)
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Jobs
- `GET /api/jobs` - Get all job postings
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:id` - Get job details

### Interviews
- `POST /api/interviews/schedule` - Schedule interview
- `GET /api/interviews/:candidateId` - Get candidate interviews

### AI Service
- `POST /ai/parse-resume` - Parse resume PDF/DOCX
- `POST /ai/match-candidate` - Get candidate-job match score
- `POST /ai/chat` - RAG chatbot interaction

## Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Python tests
cd ai-service
pytest
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
- Connect GitHub repository to Render
- Set environment variables
- Deploy from main branch

### AI Service (AWS Lambda / Docker)
```bash
cd ai-service
docker build -t hr-ai-service .
docker push <your-registry>/hr-ai-service
```

## KPIs & Success Metrics

- **60%** reduction in manual HR effort per recruitment cycle
- **90%** accuracy in resume shortlisting
- **<5 minutes** average interview scheduling time
- **80%** HR adoption satisfaction rate

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Maintainer - [Your Name]
Project Link: [https://github.com/yourusername/hr-automation-system](https://github.com/yourusername/hr-automation-system)

## Acknowledgments

- Spacy for NLP capabilities
- OpenAI for GPT integration
- LangChain for RAG implementation
- React and Node.js communities

---

**Current Sprint**: Sprint 1 - Foundation & Infrastructure Setup
**Status**: In Progress
**Last Updated**: 2025-11-03
