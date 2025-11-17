#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.resume_parser import ResumeParser

# Path to your resume
resume_path = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\uploads\resumes\1762251691974-540930259.pdf"

if __name__ == "__main__":
    print("="*80)
    print("TESTING RESUME PARSER")
    print("="*80)

    parser = ResumeParser()

    try:
        result = parser.parse_resume(resume_path)

        print("\n" + "="*80)
        print("EXTRACTION RESULTS:")
        print("="*80)

        print("\n### WORK EXPERIENCE ###")
        for i, exp in enumerate(result['experience'], 1):
            print(f"\n{i}. Position: {exp.get('position', 'N/A')}")
            print(f"   Company: {exp.get('company', 'N/A')}")
            print(f"   Duration: {exp.get('duration', 'N/A')}")
            print(f"   Description: {exp.get('description', 'N/A')[:100]}...")

        print("\n### EDUCATION ###")
        for i, edu in enumerate(result['education'], 1):
            print(f"\n{i}. Degree: {edu.get('degree', 'N/A')}")
            print(f"   Institution: {edu.get('institution', 'N/A')}")
            print(f"   Field: {edu.get('field', 'N/A')}")
            print(f"   Year: {edu.get('graduationYear', 'N/A')}")

        print("\n### SKILLS ###")
        skills = [s['name'] for s in result['skills'][:10]]
        print(f"Found {len(result['skills'])} skills: {', '.join(skills)}...")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
