#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import re

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.resume_parser import ResumeParser

resume_path = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

if __name__ == "__main__":
    parser = ResumeParser()
    text = parser.extract_text(resume_path)

    print("Full text length:", len(text))
    print("\nSearching for section headers...")

    # Find all section headers
    headers = re.findall(r'\n([A-Z][A-Z\s]+)\s*\n', text)
    print(f"Found headers: {headers}")

    # Test old pattern
    exp_section_pattern_old = r'(?:INTERNSHIP)(.*?)(?=EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|TECHNICAL\s+SKILLS|$)'
    match_old = re.search(exp_section_pattern_old, text, re.DOTALL | re.IGNORECASE)
    print(f"\nOld pattern (case insensitive, no \\n): {len(match_old.group(1)) if match_old else 0} chars")

    # Test new pattern
    exp_section_pattern_new = r'(?:INTERNSHIP)(.*?)(?=\nPROJECTS)'
    match_new = re.search(exp_section_pattern_new, text, re.DOTALL | re.IGNORECASE)
    print(f"New pattern (with \\nPROJECTS): {len(match_new.group(1)) if match_new else 0} chars")

    if match_new:
        print("\nExtracted section with new pattern:")
        print(match_new.group(1))
