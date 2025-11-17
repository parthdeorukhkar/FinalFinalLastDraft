# 🚀 START HERE - HR Automation System Quick Start

## ✅ System Status: RUNNING

All services are currently running and ready to use!

---

## 🌐 Access Your Application

### **Main Application URL**
👉 **http://localhost:3000**

Open this in your browser to access the HR Automation System.

---

## 🔐 Login Credentials

A test admin user has been created for you:

```
Email: admin@hr.com
Password: password123
```

---

## 📊 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Running |
| **Backend API** | http://localhost:5000 | ✅ Running |
| **AI Service** | http://localhost:8000 | ✅ Running |
| **MongoDB** | mongodb://localhost:27017 | ✅ Connected |

---

## 🎯 Quick Start Guide

### Step 1: Open the Application
1. Open your browser
2. Go to **http://localhost:3000**
3. You should see the login page

### Step 2: Login
1. Enter email: `admin@hr.com`
2. Enter password: `password123`
3. Click "Login"
4. You'll be redirected to the dashboard

### Step 3: Explore the Dashboard
- View statistics and metrics
- Navigate to Candidates, Jobs, Analytics
- Use the sidebar to switch between pages

---

## 🐛 Troubleshooting

### "Nothing happens after clicking login"

**Check the browser console:**
1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Look for any error messages
4. Take a screenshot and share if you see errors

**Common Issues:**

1. **CORS Error**
   - The backend might not be running
   - Check: http://localhost:5000/health
   - Restart backend if needed

2. **Network Error**
   - Backend not accessible
   - Check firewall settings
   - Restart all services

3. **Invalid Credentials**
   - Make sure you're using: `admin@hr.com` / `password123`
   - Check for typos

### Services Not Running

If any service stopped, restart them:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

**AI Service:**
```bash
cd ai-service/src
python api.py
```

---

## 🔍 Check Service Health

### Backend Health Check
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"success","message":"HR Automation API is running",...}`

### AI Service Health Check
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","service":"ai-service",...}`

### Frontend Check
Open: http://localhost:3000
Expected: Login page loads

---

## 📝 What to Do After Login

Once you successfully login, you can:

1. **View Dashboard**
   - See system statistics
   - Quick actions for common tasks

2. **Manage Candidates**
   - Upload resumes
   - View candidate list
   - See AI analysis (coming in Sprint 2)

3. **Manage Jobs**
   - Create job postings
   - Define requirements
   - View applicants

4. **View Analytics**
   - Recruitment metrics
   - Performance data (coming in Sprint 4)

---

## 🆘 Still Having Issues?

### Check Browser Console
1. Open browser Developer Tools (F12)
2. Look at Console tab for errors
3. Look at Network tab to see API calls

### Check Backend Logs
The backend is running in the background. To see logs:
- Look for process ID in RUNNING_SERVICES.md
- Or restart in a visible terminal window

### Verify All Services
Run these health checks:
```bash
# Backend
curl http://localhost:5000/health

# AI Service
curl http://localhost:8000/health

# MongoDB
# Should show "Connected" in backend logs
```

---

## 🎨 What You Should See

### Login Page
- Clean white login form
- Email and password fields
- Blue "Login" button
- Demo credentials shown at bottom

### After Login - Dashboard
- Sidebar on the left with navigation
- Main content area showing:
  - Statistics cards (Total Candidates, Active Jobs, etc.)
  - Recent candidates table
  - Quick action buttons

### Navigation Menu
- Dashboard
- Candidates
- Jobs
- Analytics
- Settings
- Logout button at bottom

---

## 💡 Testing the System

### Create Another User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Manager",
    "email": "manager@hr.com",
    "password": "manager123",
    "role": "HR Manager",
    "department": "Human Resources"
  }'
```

### Test Login via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hr.com","password":"password123"}'
```

---

## 📚 Next Steps

After you successfully login and see the dashboard:

1. **Explore the UI** - Navigate through all pages
2. **Read** [AGILE_SPRINT_PLAN.md](AGILE_SPRINT_PLAN.md) - Understand the development roadmap
3. **Start Sprint 2** - Build candidate management features
4. **Review Code** - Understand the architecture

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Node.js**: https://nodejs.org/docs
- **MongoDB**: https://www.mongodb.com/docs
- **FastAPI**: https://fastapi.tiangolo.com

---

## 📞 Quick Commands

### Stop All Services
Press `Ctrl+C` in each terminal running the services

### Restart Everything
1. Stop all services
2. Run each service command again:
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd ai-service/src && python api.py

   # Terminal 3
   cd frontend && npm start
   ```

---

## ✨ You're All Set!

**Open http://localhost:3000 and start exploring!**

If you see the login page and can successfully login with `admin@hr.com` / `password123`, then everything is working perfectly! 🎉

---

## 🔐 Created User Details

```json
{
  "name": "Admin User",
  "email": "admin@hr.com",
  "password": "password123",
  "role": "Admin",
  "department": "IT"
}
```

This user has full admin access to all features.

---

**Happy Coding!** 🚀
