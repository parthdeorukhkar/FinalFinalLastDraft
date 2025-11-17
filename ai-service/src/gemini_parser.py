"""
Gemini AI-powered Resume Parser
Uses Google's Gemini AI to extract structured information from resumes
"""

import os
import json
from typing import Dict, List
import google.generativeai as genai
from PyPDF2 import PdfReader
from pathlib import Path


class GeminiResumeParser:
    def __init__(self):
        """Initialize Gemini AI parser"""
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        # Configure Gemini
        genai.configure(api_key=api_key)

        # Use the fast and efficient Gemini Flash model
        self.model = genai.GenerativeModel('gemini-flash-latest')

        print(f"Gemini resume parser initialized with model: gemini-flash-latest")

    def extract_text(self, file_path: str) -> str:
        """Extract text from PDF resume"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error extracting text from PDF: {e}")

    def parse_resume(self, file_path: str) -> Dict:
        """
        Parse resume using Gemini AI to extract structured information

        Args:
            file_path: Path to the resume PDF file

        Returns:
            Dictionary containing parsed resume data
        """
        print(f"Parsing resume with Gemini: {file_path}")

        # Extract text from PDF
        resume_text = self.extract_text(file_path)

        if not resume_text:
            raise ValueError("Could not extract text from resume")

        # Create structured prompt for Gemini
        prompt = f"""
You are an expert HR resume parser. Analyze the following resume text and extract structured information in JSON format.

IMPORTANT: Return ONLY valid JSON with no markdown formatting, no code blocks, no explanations.

Extract the following information:
1. Personal Information (name, email, phone)
2. Skills (technical skills, soft skills, tools, technologies)
3. Work Experience (position, company, duration, detailed description)
4. Education (degree, institution, field of study, graduation year, GPA if available)
5. Certifications (name, issuing organization)
6. Projects (name, description, technologies used)

Return the data in this EXACT JSON structure:
{{
  "personalInfo": {{
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number"
  }},
  "skills": [
    {{"name": "skill name", "proficiency": "Beginner/Intermediate/Advanced/Expert"}}
  ],
  "experience": [
    {{
      "position": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date or Present",
      "description": "Detailed description of responsibilities and achievements"
    }}
  ],
  "education": [
    {{
      "degree": "Degree Name",
      "institution": "Institution Name",
      "field": "Field of Study",
      "graduationYear": 2024,
      "gpa": 8.5
    }}
  ],
  "certifications": [
    {{"name": "Certification Name", "issuer": "Issuing Organization"}}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }}
  ]
}}

Resume Text:
{resume_text}

Return ONLY the JSON object, no other text.
"""

        try:
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Clean up response - remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]  # Remove ```json
            if response_text.startswith('```'):
                response_text = response_text[3:]  # Remove ```
            if response_text.endswith('```'):
                response_text = response_text[:-3]  # Remove trailing ```
            response_text = response_text.strip()

            # Extract JSON from response (in case there's extra text)
            # Find the first { and last }
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}')

            if start_idx != -1 and end_idx != -1:
                response_text = response_text[start_idx:end_idx+1]

            # Parse JSON response
            parsed_data = json.loads(response_text)

            # Ensure skills have the correct format
            if 'skills' in parsed_data:
                formatted_skills = []
                for skill in parsed_data['skills']:
                    if isinstance(skill, str):
                        formatted_skills.append({
                            "name": skill,
                            "proficiency": "Intermediate"
                        })
                    elif isinstance(skill, dict) and 'name' in skill:
                        formatted_skills.append(skill)
                parsed_data['skills'] = formatted_skills

            # Ensure all required fields exist
            if 'personalInfo' not in parsed_data:
                parsed_data['personalInfo'] = {"name": "", "email": "", "phone": ""}
            if 'skills' not in parsed_data:
                parsed_data['skills'] = []
            if 'experience' not in parsed_data:
                parsed_data['experience'] = []
            if 'education' not in parsed_data:
                parsed_data['education'] = []
            if 'certifications' not in parsed_data:
                parsed_data['certifications'] = []
            if 'projects' not in parsed_data:
                parsed_data['projects'] = []

            # Add the raw text to the response (needed by API)
            parsed_data['text'] = resume_text

            print(f"Successfully parsed resume with Gemini")
            print(f"Extracted {len(parsed_data['skills'])} skills, {len(parsed_data['experience'])} work experiences, {len(parsed_data['education'])} education entries")

            return parsed_data

        except json.JSONDecodeError as e:
            print(f"Error parsing Gemini response as JSON: {e}")
            print(f"Raw response: {response_text[:500]}")
            raise ValueError(f"Failed to parse Gemini response: {e}")
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            raise ValueError(f"Error parsing resume with Gemini: {e}")


if __name__ == "__main__":
    # Test the parser
    parser = GeminiResumeParser()
    test_file = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

    if os.path.exists(test_file):
        result = parser.parse_resume(test_file)
        print("\n" + "="*80)
        print("PARSING RESULTS:")
        print("="*80)
        print(json.dumps(result, indent=2))
    else:
        print(f"Test file not found: {test_file}")
