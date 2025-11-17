#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import json

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.resume_parser import ResumeParser

# Use one of the actual resume files
resume_path = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

if __name__ == "__main__":
    print("Testing Resume Parser")
    print("Resume file:", resume_path)
    print()

    parser = ResumeParser()

    try:
        result = parser.parse_resume(resume_path)

        print("WORK EXPERIENCE:")
        print(json.dumps(result['experience'], indent=2, ensure_ascii=False))

        print("\nEDUCATION:")
        print(json.dumps(result['education'], indent=2, ensure_ascii=False))

        print("\nSKILLS (first 10):")
        print(json.dumps(result['skills'][:10], indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
