# HR Automation Data Flow - Complete Guide

## 📊 What Data is Extracted and When

### **Step 1: Upload Candidate (Automatic Parsing)**

When you upload a candidate, the system automatically calls `/parse-resume` endpoint.

**Data Extracted:**
- ✅ **Skills** (with proficiency levels)
  ```json
  [
    {"name": "Python", "proficiency": "Advanced"},
    {"name": "JavaScript", "proficiency": "Intermediate"}
  ]
  ```

- ✅ **Work Experience** (position, company, duration, full description)
  ```json
  [
    {
      "position": "Python Programmer",
      "company": "Codtech IT Solutions",
      "duration": "",
      "description": "Developed and optimized scripts for data processing..."
    }
  ]
  ```

- ✅ **Education** (degree, institution, field, graduation year)
  ```json
  [
    {
      "degree": "B.E Electronics & Telecommunication",
      "institution": "Thakur College of Engineering and Technology, Mumbai",
      "field": "",
      "graduationYear": 2026
    }
  ]
  ```

**These are saved to the database immediately after upload.**

---

### **Step 2: Click "Analyze" Button (AI Matching)**

When you click the "Analyze" button, the system calls `/match-candidate` endpoint.

**Additional Data Generated:**
- ✅ **Match Score** (0-100%)
  ```json
  73.33
  ```

- ✅ **AI Summary** (Professional, context-aware analysis)
  ```json
  "This candidate represents a strong fit for the position (Overall Score: 78%). The candidate possesses excellent technical competencies, demonstrates relevant practical experience, and shows appropriate educational background. This candidate shows strong alignment with the position requirements and demonstrates good potential for success in the role."
  ```

- ✅ **Strengths** (Array of candidate strengths)
  ```json
  [
    "Strong proficiency in Python, JavaScript, SQL",
    "Relevant experience in full-stack development",
    "Good understanding of databases"
  ]
  ```

- ✅ **Weaknesses** / **Areas to Improve** (Array of gaps)
  ```json
  [
    "Limited experience with cloud platforms (AWS, Azure)",
    "Could benefit from more DevOps experience"
  ]
  ```

- ✅ **Recommended Job Roles** (Based on skills and experience)
  ```json
  [
    {
      "role": "Full Stack Developer",
      "matchPercentage": 78,
      "description": "Designs and develops both client and server-side applications",
      "matchedSkills": ["javascript", "react", "node.js", "mongodb"],
      "reason": "Strong match based on full-stack development skills and experience with modern frameworks"
    },
    {
      "role": "Backend Developer",
      "matchPercentage": 65,
      "description": "Builds server-side logic and databases",
      "matchedSkills": ["python", "sql", "postgresql"],
      "reason": "Good foundation in backend technologies and database management"
    }
  ]
  ```

---

## 🎯 Complete Candidate Profile

After both steps, each candidate has:

1. **Basic Info**: Name, Email, Phone
2. **Skills**: List of technical and soft skills with proficiency
3. **Work Experience**: Complete work history with descriptions
4. **Education**: Academic background with degrees and institutions
5. **Match Score**: Percentage match with the job
6. **AI Summary**: Professional analysis of the candidate
7. **Strengths**: What makes them a good fit
8. **Weaknesses/Areas to Improve**: Skills gaps or areas for growth
9. **Recommended Job Roles**: Alternative roles they'd be good at

---

## 🔄 **How to Get All Data:**

### **For a NEW Candidate:**
1. Upload candidate resume
2. Assign to a job (REQUIRED for analysis!)
3. Click "Analyze" button
4. ✅ Complete profile with all 9 data points!

### **For an EXISTING Candidate:**
- If they already have skills/experience/education: Click "Analyze" to get AI matching data
- If they're missing data: Delete and re-upload (Gemini AI will parse it correctly)

---

## 🚀 **Powered by Google Gemini AI:**

All resume parsing now uses **Gemini AI** which:
- ✅ Accurately extracts work experience with full descriptions
- ✅ Correctly identifies education details
- ✅ Finds all relevant skills
- ✅ Understands context and variations in resume formats
- ✅ No more gibberish output!

---

## 💡 **Troubleshooting:**

**Q: Why don't I see work experience/education?**
A: The candidate was uploaded with old parser. Delete and re-upload to use Gemini.

**Q: Why is recommended roles showing but not AI summary?**
A: Click the "Analyze" button. Job recommendations come from parse, AI summary comes from analyze.

**Q: How do I re-analyze a candidate?**
A: Just click the "Analyze" button again. It will re-parse and update all data.

---

**Ready to test? Upload a new candidate and click Analyze!** 🎉
