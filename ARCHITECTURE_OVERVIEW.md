# HR Automation System - Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React Frontend (Port 3000)                                 │ │
│  │  - Dashboard, Candidates, Jobs, Analytics, Settings         │ │
│  │  - Tailwind CSS, React Router, Axios                        │ │
│  │  - JWT Authentication, Protected Routes                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Node.js/Express Backend (Port 5000)                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │ Auth Routes  │  │ Candidate    │  │ Job Routes   │     │ │
│  │  │ - Register   │  │ Routes       │  │ - CRUD       │     │ │
│  │  │ - Login      │  │ - CRUD       │  │ - Search     │     │ │
│  │  │ - JWT        │  │ - Upload     │  │              │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │ Interview    │  │ Email        │  │ Analytics    │     │ │
│  │  │ Routes       │  │ Routes       │  │ Routes       │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                │                            │
                │                            │ HTTP/REST
                ▼                            ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│    DATABASE LAYER        │    │      AI/ML LAYER             │
│  ┌────────────────────┐  │    │  ┌────────────────────────┐ │
│  │  MongoDB           │  │    │  │ Python FastAPI         │ │
│  │  (Port 27017)      │  │    │  │ (Port 8000)            │ │
│  │  ┌──────────────┐  │  │    │  │ ┌──────────────────┐  │ │
│  │  │ Collections: │  │  │    │  │ │ Resume Parser    │  │ │
│  │  │ - users      │  │  │    │  │ │ - PDF/DOCX       │  │ │
│  │  │ - candidates │  │  │    │  │ │ - Spacy NLP      │  │ │
│  │  │ - jobs       │  │  │    │  │ └──────────────────┘  │ │
│  │  │ - interviews │  │  │    │  │ ┌──────────────────┐  │ │
│  │  └──────────────┘  │  │    │  │ │ Matching Engine  │  │ │
│  └────────────────────┘  │    │  │ │ - Skill Match    │  │ │
└──────────────────────────┘    │  │ │ - Score Calc     │  │ │
                                │  │ │ - AI Analysis    │  │ │
                                │  │ └──────────────────┘  │ │
                                │  │ ┌──────────────────┐  │ │
                                │  │ │ RAG Chatbot      │  │ │
                                │  │ │ (Sprint 5)       │  │ │
                                │  │ └──────────────────┘  │ │
                                │  └────────────────────────┘ │
                                └──────────────────────────────┘
```

---

## Data Flow Diagram

### Resume Upload & Analysis Flow

```
1. User uploads resume (PDF/DOCX)
   │
   ├─► Frontend: File selected via upload component
   │
   ├─► Backend API: POST /api/candidates
   │   ├─ Multer middleware saves file to /uploads
   │   ├─ Create candidate record in MongoDB
   │   └─ Return candidate ID
   │
   ├─► Backend triggers async call to AI Service
   │
   ├─► AI Service: POST /parse-resume
   │   ├─ Extract text from PDF/DOCX
   │   ├─ Spacy NLP processes text
   │   ├─ Extract: Skills, Experience, Education
   │   └─ Return structured data
   │
   ├─► Backend updates candidate record
   │   └─ Store: skills[], experience[], education[]
   │
   ├─► AI Service: POST /match-candidate
   │   ├─ Compare candidate skills vs job requirements
   │   ├─ Calculate weighted match score (0-100)
   │   ├─ Identify strengths and weaknesses
   │   └─ Return match analysis
   │
   ├─► Backend updates candidate record
   │   └─ Store: matchScore, aiSummary, strengths[], weaknesses[]
   │
   └─► Frontend displays candidate with AI analysis
       └─ Show: Name, Skills, Match Score, Status
```

---

## Technology Stack Layers

### Presentation Layer (Frontend)
```
┌─────────────────────────────────────┐
│  React 18 + Tailwind CSS            │
├─────────────────────────────────────┤
│  • Pages: Dashboard, Candidates,    │
│    Jobs, Analytics, Settings        │
│  • Components: Layout, Sidebar,     │
│    Cards, Tables, Forms             │
│  • State: Context API (Auth)        │
│  • Routing: React Router v6         │
│  • HTTP: Axios with interceptors    │
│  • UI: Tailwind, React Icons        │
└─────────────────────────────────────┘
```

### Application Layer (Backend)
```
┌─────────────────────────────────────┐
│  Node.js + Express.js               │
├─────────────────────────────────────┤
│  • Routes: RESTful API endpoints    │
│  • Controllers: Business logic      │
│  • Middleware: Auth, Upload, Error  │
│  • Services: Email, Calendar, AI    │
│  • Authentication: JWT + bcrypt     │
│  • File Upload: Multer              │
└─────────────────────────────────────┘
```

### Data Layer (Database)
```
┌─────────────────────────────────────┐
│  MongoDB + Mongoose                 │
├─────────────────────────────────────┤
│  • Models: User, Candidate, Job,    │
│    Interview                        │
│  • Schema Validation                │
│  • Indexes for performance          │
│  • Relationships (refs)             │
└─────────────────────────────────────┘
```

### Intelligence Layer (AI Service)
```
┌─────────────────────────────────────┐
│  Python + FastAPI                   │
├─────────────────────────────────────┤
│  • NLP: Spacy (en_core_web_md)      │
│  • Document Parsing: PyPDF2, docx   │
│  • AI: OpenAI API (optional)        │
│  • Matching: Custom algorithm       │
│  • Future: LangChain, Vector DB     │
└─────────────────────────────────────┘
```

---

## Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum['Admin', 'HR Manager', 'Recruiter', 'Interviewer'],
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Candidates Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  resumeUrl: String,
  resumeText: String,

  // Parsed Resume Data (from AI)
  skills: [{
    name: String,
    proficiency: Enum['Beginner', 'Intermediate', 'Advanced', 'Expert']
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number,
    gpa: Number
  }],

  // AI Analysis
  matchScore: Number (0-100),
  aiSummary: String,
  strengths: [String],
  weaknesses: [String],

  // Application Data
  appliedFor: ObjectId (ref: Job),
  status: Enum['New', 'Screening', 'Shortlisted', 'Interview Scheduled',
                'Interviewed', 'Selected', 'Rejected', 'On Hold'],
  interviews: [ObjectId] (ref: Interview),
  emails: [{
    type: String,
    subject: String,
    body: String,
    sentAt: Date
  }],

  source: Enum['Direct Upload', 'LinkedIn', 'Indeed', 'Referral', 'Other'],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  department: String,
  location: String,
  employmentType: Enum['Full-time', 'Part-time', 'Contract', 'Internship'],
  description: String,
  responsibilities: [String],

  requiredSkills: [{
    name: String,
    importance: Enum['Required', 'Preferred', 'Nice to have']
  }],
  requiredExperience: {
    min: Number,
    max: Number
  },
  requiredEducation: Enum['High School', 'Associate', 'Bachelor',
                          'Master', 'PhD', 'Any'],

  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },

  status: Enum['Draft', 'Open', 'Closed', 'On Hold'],
  openings: Number,
  totalApplications: Number,
  shortlistedCandidates: [ObjectId] (ref: Candidate),

  postedBy: ObjectId (ref: User),
  postedDate: Date,
  closingDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Interviews Collection
```javascript
{
  _id: ObjectId,
  candidate: ObjectId (ref: Candidate),
  job: ObjectId (ref: Job),

  round: Number,
  type: Enum['Phone Screen', 'Video', 'In-person', 'Technical', 'HR', 'Final'],
  scheduledDate: Date,
  duration: Number (minutes),

  meetingLink: String,
  location: String,
  googleEventId: String,

  interviewers: [{
    name: String,
    email: String,
    role: String
  }],

  status: Enum['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],

  feedback: {
    rating: Number (1-5),
    technicalSkills: Number,
    communication: Number,
    cultureFit: Number,
    comments: String,
    recommendation: Enum['Strong Yes', 'Yes', 'Maybe', 'No', 'Strong No']
  },

  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Architecture

### RESTful API Design Principles

1. **Resource-Based URLs**
   - `/api/candidates` - Collection
   - `/api/candidates/:id` - Individual resource

2. **HTTP Methods**
   - GET - Retrieve data
   - POST - Create new resource
   - PUT - Update entire resource
   - PATCH - Partial update
   - DELETE - Remove resource

3. **Status Codes**
   - 200 OK - Success
   - 201 Created - Resource created
   - 400 Bad Request - Validation error
   - 401 Unauthorized - Not authenticated
   - 403 Forbidden - Not authorized
   - 404 Not Found - Resource not found
   - 500 Internal Server Error - Server error

4. **Response Format**
```json
{
  "status": "success|error",
  "message": "Optional message",
  "data": {
    "resource": {}
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Security Architecture

### Authentication Flow
```
1. User enters credentials
   ↓
2. Backend validates email/password
   ↓
3. Generate JWT token (includes user ID + role)
   ↓
4. Return token to client
   ↓
5. Client stores token in localStorage
   ↓
6. Client includes token in Authorization header
   ↓
7. Backend middleware verifies token
   ↓
8. Grant/Deny access based on role
```

### Security Layers
```
┌─────────────────────────────────────┐
│  Helmet.js - Security Headers       │
├─────────────────────────────────────┤
│  CORS - Cross-Origin Control        │
├─────────────────────────────────────┤
│  JWT - Token Authentication         │
├─────────────────────────────────────┤
│  Bcrypt - Password Hashing          │
├─────────────────────────────────────┤
│  Joi - Input Validation             │
├─────────────────────────────────────┤
│  Multer - File Upload Restrictions  │
├─────────────────────────────────────┤
│  Rate Limiting - API Protection     │
└─────────────────────────────────────┘
```

---

## Deployment Architecture (Future - Sprint 6)

```
┌──────────────────────────────────────────────────────────┐
│                    Production Environment                 │
│                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │  Vercel        │  │  Render/AWS    │  │  AWS       │ │
│  │  (Frontend)    │  │  (Backend)     │  │  (AI)      │ │
│  │  - CDN         │  │  - Node.js     │  │  - Lambda  │ │
│  │  - SSL         │  │  - Auto-scale  │  │  - Docker  │ │
│  └────────────────┘  └────────────────┘  └────────────┘ │
│           │                   │                   │       │
│           └───────────────────┴───────────────────┘       │
│                               │                           │
│                               ▼                           │
│                   ┌────────────────────┐                  │
│                   │  MongoDB Atlas     │                  │
│                   │  (Cloud Database)  │                  │
│                   └────────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
Feature Request
    │
    ├─► Sprint Planning (Agile)
    │
    ├─► Create Feature Branch
    │
    ├─► Development
    │   ├─ Backend: API + Database
    │   ├─ AI Service: NLP/ML Logic
    │   └─ Frontend: UI Components
    │
    ├─► Local Testing
    │   ├─ Unit Tests
    │   ├─ Integration Tests
    │   └─ Manual Testing
    │
    ├─► Code Review (Pull Request)
    │
    ├─► Merge to Main
    │
    ├─► CI/CD Pipeline
    │   ├─ Run Tests
    │   ├─ Build
    │   └─ Deploy
    │
    └─► Sprint Review & Demo
```

---

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- MongoDB aggregation pipelines for analytics
- Caching with Redis (future)
- Pagination for large datasets
- Async operations for AI calls

### Frontend
- Code splitting (React.lazy)
- Image optimization
- Memoization (useMemo, useCallback)
- Virtual scrolling for long lists
- Debouncing search inputs

### AI Service
- Resume parsing cache
- Batch processing
- Model loading optimization
- Vector database for RAG (Sprint 5)

---

## Monitoring & Logging (Future)

```
┌──────────────────────────────────────┐
│  Application Monitoring              │
│  - Sentry (Error tracking)           │
│  - LogRocket (Session replay)        │
│  - New Relic (Performance)           │
└──────────────────────────────────────┘
```

---

This architecture provides a solid foundation for scaling and adding new features throughout the 6-sprint development timeline.
