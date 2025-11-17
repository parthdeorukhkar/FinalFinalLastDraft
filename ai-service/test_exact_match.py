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

    # Look for INTERNSHIP section
    match = re.search(r'INTERNSHIP(.*?)PROJECTS', text, re.DOTALL | re.IGNORECASE)

    if match:
        exp_section = match.group(1)
        print(f"Match found: {len(exp_section)} characters")

        # Save to file
        with open('exact_match.txt', 'w', encoding='utf-8') as f:
            f.write(exp_section)

        print("Saved to exact_match.txt")
        print(f"\nFirst 200 chars: {repr(exp_section[:200])}")
        print(f"\nLast 100 chars: {repr(exp_section[-100:])}")
