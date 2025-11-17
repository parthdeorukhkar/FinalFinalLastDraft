# -*- coding: utf-8 -*-
# import spacy  # Optional - not installed yet
import PyPDF2
import docx
import re
import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()


class ResumeParser:
    def __init__(self):
        """Initialize the resume parser - Spacy NLP is optional"""
        # For now, we'll use regex-based parsing
        # Spacy can be added later for more advanced NLP
        self.nlp = None
        print("Resume parser initialized (enhanced mode)")

        # Common skill keywords
        self.skill_keywords = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'sql',
            'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker',
            'kubernetes', 'ci/cd', 'git', 'agile', 'scrum', 'machine learning',
            'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
            'scikit-learn', 'pandas', 'numpy', 'html', 'css', 'tailwind',
            'bootstrap', 'rest api', 'graphql', 'microservices', 'redis',
            'elasticsearch', 'kafka', 'jenkins', 'github actions', 'terraform',
            'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
            'flutter', 'react native', 'android', 'ios', 'firebase', 'heroku'
        ]

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""

    def extract_text_from_docx(self, docx_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(docx_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            return ""

    def extract_text(self, file_path: str) -> str:
        """Extract text based on file extension"""
        if file_path.lower().endswith('.pdf'):
            return self.extract_text_from_pdf(file_path)
        elif file_path.lower().endswith(('.docx', '.doc')):
            return self.extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")

    def extract_email(self, text: str) -> str:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else None

    def extract_phone(self, text: str) -> str:
        """Extract phone number from text"""
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        return ''.join(phones[0]) if phones else None

    def extract_skills(self, text: str) -> List[Dict]:
        """Extract skills from resume text"""
        text_lower = text.lower()
        found_skills = []

        for skill in self.skill_keywords:
            if skill in text_lower:
                found_skills.append({
                    "name": skill.title(),
                    "proficiency": self._estimate_proficiency(text_lower, skill)
                })

        # Use NLP to find additional skills (proper nouns, tech terms)
        if self.nlp:
            doc = self.nlp(text)
            for chunk in doc.noun_chunks:
                if len(chunk.text.split()) <= 3 and chunk.text.lower() not in [s["name"].lower() for s in found_skills]:
                    # Check if it looks like a technical term
                    if any(char.isupper() for char in chunk.text) or chunk.text.lower().endswith(('js', 'sql', 'api')):
                        found_skills.append({
                            "name": chunk.text,
                            "proficiency": "Intermediate"
                        })

        return found_skills[:20]  # Limit to top 20 skills

    def _estimate_proficiency(self, text: str, skill: str) -> str:
        """Estimate skill proficiency based on context"""
        # Simple heuristic: check for proficiency indicators
        skill_context = text.lower()

        if f"expert in {skill}" in skill_context or f"advanced {skill}" in skill_context:
            return "Expert"
        elif f"proficient in {skill}" in skill_context or f"experienced {skill}" in skill_context:
            return "Advanced"
        elif f"familiar with {skill}" in skill_context or f"basic {skill}" in skill_context:
            return "Beginner"
        else:
            return "Intermediate"

    def extract_experience(self, text: str) -> List[Dict]:
        """Extract work experience from resume - Enhanced version"""
        experiences = []

        # Look for experience/internship sections with multiple patterns
        # Match section headers case-insensitively, but require next section to be all caps (5+ chars)
        exp_section_patterns = [
            r'(?i)(?:EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT|PROFESSIONAL\s+EXPERIENCE|WORK\s+HISTORY|INTERNSHIP|INTERNSHIPS)(.*?)(?=\n[A-Z][A-Z\s]{5,}(?:\n|$)|$)',
        ]

        exp_section = None
        for pattern in exp_section_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                exp_section = match.group(1)
                break

        if not exp_section:
            return []

        # Try multiple bullet patterns (●, •, -, *, etc.)
        bullet_patterns = [r'●', r'•', r'\*', r'-(?=\s)', r'○']

        for bullet in bullet_patterns:
            # Pattern: bullet Position | Company
            job_entry_pattern = rf'{bullet}\s*([^|\n]+?)(?:\||at)\s*([^\n]+?)(?:\n|$)'
            job_matches = list(re.finditer(job_entry_pattern, exp_section, re.IGNORECASE))

            if job_matches:
                for match in job_matches:
                    position = match.group(1).strip()
                    company = match.group(2).strip()

                    # Find the text after this match until next bullet or end
                    start_pos = match.end()
                    # Look for next bullet or end of section
                    next_bullet = re.search(rf'{bullet}', exp_section[start_pos:])
                    if next_bullet:
                        description_text = exp_section[start_pos:start_pos + next_bullet.start()]
                    else:
                        # Take all remaining text in the section
                        description_text = exp_section[start_pos:]

                    # Clean up the description text
                    # Remove empty lines and join all lines together
                    description_lines = [line.strip() for line in description_text.split('\n') if line.strip()]
                    description = ' '.join(description_lines)

                    experiences.append({
                        "position": position,
                        "company": company,
                        "duration": "",
                        "description": description[:500] if description else ""
                    })

                break  # Found matches, don't try other bullet patterns

        # If no bullet-point format found, try pipe/dash separator
        if not experiences:
            lines = exp_section.split('\n')
            for i, line in enumerate(lines):
                line = line.strip()
                if not line or len(line) < 5:
                    continue

                # Pattern: Position | Company or Position - Company
                separator_pattern = r'^([^|\-–—]+)[\|\-–—](.+)$'
                match = re.match(separator_pattern, line)

                if match:
                    position = match.group(1).strip()
                    company = match.group(2).strip()

                    # Look ahead for description in next few lines
                    description_lines = []
                    for j in range(i+1, min(i+5, len(lines))):
                        next_line = lines[j].strip()
                        if next_line and len(next_line) > 20 and not re.match(separator_pattern, next_line):
                            description_lines.append(next_line)
                        elif re.match(separator_pattern, next_line):
                            break

                    experiences.append({
                        "position": position,
                        "company": company,
                        "duration": "",
                        "description": ' '.join(description_lines[:3])
                    })

        return experiences[:5]

    def extract_education(self, text: str) -> List[Dict]:
        """Extract education from resume - Enhanced version"""
        educations = []

        # Look for education section
        edu_section_patterns = [
            r'(?:EDUCATION|ACADEMIC\s+BACKGROUND|QUALIFICATIONS)(.*?)(?=INTERNSHIP|EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|TECHNICAL\s+SKILLS|$)',
        ]

        edu_section = None
        for pattern in edu_section_patterns:
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                edu_section = match.group(1)
                break

        if not edu_section:
            return []

        # Try multiple bullet patterns
        bullet_patterns = [r'●', r'•', r'\*', r'-(?=\s)', r'○']
        bullet_entries = []

        for bullet in bullet_patterns:
            pattern = rf'{bullet}\s*([^\n]+(?:\n(?!\s*{bullet})[^\n]+)*)'
            matches = re.findall(pattern, edu_section, re.IGNORECASE)
            if matches:
                bullet_entries = matches
                break

        # If no bullets found, try line by line
        if not bullet_entries:
            bullet_entries = [line for line in edu_section.split('\n') if line.strip() and len(line.strip()) > 10]

        for entry in bullet_entries:
            entry = entry.strip()
            if len(entry) < 5:
                continue

            # Extract degree - look for common patterns
            degree_patterns = [
                r'(B\.?E\.?\s+[\w\s&]+)',
                r'(B\.?Tech\.?\s+[\w\s&]+)',
                r'(M\.?E\.?\s+[\w\s&]+)',
                r'(M\.?Tech\.?\s+[\w\s&]+)',
                r'(Bachelor\s+of\s+[\w\s]+)',
                r'(Master\s+of\s+[\w\s]+)',
                r'(B\.?S\.?\s+[\w\s]+)',
                r'(M\.?S\.?\s+[\w\s]+)',
                r'(MBA|Ph\.?D\.?)',
            ]

            degree = None
            for pattern in degree_patterns:
                degree_match = re.search(pattern, entry, re.IGNORECASE)
                if degree_match:
                    degree = degree_match.group(1).strip()
                    # Clean up - stop at parenthesis or number
                    degree = re.sub(r'\s*[\(\d].*$', '', degree).strip()
                    break

            if not degree:
                continue

            # Extract GPA/percentage in parentheses
            gpa_match = re.search(r'\((\d+\.?\d*)\)', entry)
            gpa = float(gpa_match.group(1)) if gpa_match else None

            # Extract year (4-digit number)
            year_match = re.search(r'\b(19|20)\d{2}\b', entry)
            year = int(year_match.group(0)) if year_match else None

            # Extract institution - look for common education keywords
            institution_match = re.search(r'([\w\s,]+(?:University|College|Institute|School|Academy)[\w\s,]*)', entry, re.IGNORECASE)
            if institution_match:
                institution = institution_match.group(1).strip()
                # Clean up
                institution = re.sub(r'^\s*[,.\-–—]\s*', '', institution)
                institution = re.sub(r'\s*\(.*?\)\s*', ' ', institution)  # Remove parentheses
                institution = re.sub(r'\s*\d{4}\s*', ' ', institution)  # Remove years
                institution = re.sub(r'\s+', ' ', institution).strip()
            else:
                institution = ""

            educations.append({
                "degree": degree,
                "institution": institution if institution and len(institution) > 3 else "",
                "field": "",
                "graduationYear": year
            })

        return educations[:3]

    def parse_resume(self, file_path: str) -> Dict:
        """
        Main method to parse resume and extract all information
        """
        print(f"Parsing resume: {file_path}")

        # Extract text
        text = self.extract_text(file_path)

        if not text:
            raise ValueError("Could not extract text from resume")

        # Extract information
        parsed_data = {
            "text": text,
            "skills": self.extract_skills(text),
            "experience": self.extract_experience(text),
            "education": self.extract_education(text),
            "email": self.extract_email(text),
            "phone": self.extract_phone(text)
        }

        print(f"Extracted {len(parsed_data['skills'])} skills")
        print(f"Extracted {len(parsed_data['experience'])} work experiences")
        print(f"Extracted {len(parsed_data['education'])} education entries")

        return parsed_data


# Test the parser
if __name__ == "__main__":
    parser = ResumeParser()
    # Test with a sample resume
    # result = parser.parse_resume("path/to/sample/resume.pdf")
    # print(result)
