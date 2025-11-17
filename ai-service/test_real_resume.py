#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.resume_parser import ResumeParser

# Use one of the actual resume files
resume_path = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

if __name__ == "__main__":
    print("="*80)
    print("TESTING RESUME PARSER WITH REAL FILE")
    print("="*80)
    print(f"Resume file: {resume_path}")
    print()

    parser = ResumeParser()

    try:
        # First, let's see the raw extracted text
        text = parser.extract_text(resume_path)

        # Save raw text to file to inspect it
        with open('extracted_text.txt', 'w', encoding='utf-8') as f:
            f.write(text)
        print("\n✅ Raw extracted text saved to extracted_text.txt")

        print("\n" + "="*80)
        print("RAW EXTRACTED TEXT (first 1000 chars with Unicode escapes):")
        print("="*80)
        print(repr(text[:1000]))
        print("\n... (truncated)")

        # Now parse it
        result = parser.parse_resume(resume_path)

        print("\n" + "="*80)
        print("EXTRACTION RESULTS:")
        print("="*80)

        print("\n### WORK EXPERIENCE ###")
        if result['experience']:
            for i, exp in enumerate(result['experience'], 1):
                print(f"\n{i}. Position: {exp.get('position', 'N/A')}")
                print(f"   Company: {exp.get('company', 'N/A')}")
                print(f"   Duration: {exp.get('duration', 'N/A')}")
                print(f"   Description: {exp.get('description', 'N/A')[:200]}...")
        else:
            print("No work experience extracted!")

        print("\n### EDUCATION ###")
        if result['education']:
            for i, edu in enumerate(result['education'], 1):
                print(f"\n{i}. Degree: {edu.get('degree', 'N/A')}")
                print(f"   Institution: {edu.get('institution', 'N/A')}")
                print(f"   Field: {edu.get('field', 'N/A')}")
                print(f"   Year: {edu.get('graduationYear', 'N/A')}")
        else:
            print("No education extracted!")

        print("\n### SKILLS ###")
        if result['skills']:
            skills = [s['name'] for s in result['skills'][:10]]
            print(f"Found {len(result['skills'])} skills: {', '.join(skills)}...")
        else:
            print("No skills extracted!")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
