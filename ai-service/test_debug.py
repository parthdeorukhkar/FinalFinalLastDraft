#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os
import re

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.resume_parser import ResumeParser

# Use one of the actual resume files
resume_path = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

if __name__ == "__main__":
    parser = ResumeParser()
    text = parser.extract_text(resume_path)

    # Extract experience section manually
    exp_section_pattern = r'(?:EXPERIENCE|WORK\s+EXPERIENCE|EMPLOYMENT|PROFESSIONAL\s+EXPERIENCE|WORK\s+HISTORY|INTERNSHIP|INTERNSHIPS)(.*?)(?=EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|TECHNICAL\s+SKILLS|$)'
    match = re.search(exp_section_pattern, text, re.DOTALL | re.IGNORECASE)

    if match:
        exp_section = match.group(1)

        # Save to file
        with open('exp_section.txt', 'w', encoding='utf-8') as f:
            f.write(exp_section)

        print(f"Experience section length: {len(exp_section)} characters")
        print(f"Saved to exp_section.txt")

        # Find the bullet point entry
        bullet = r'●'
        job_entry_pattern = rf'{bullet}\s*([^|\n]+?)(?:\||at)\s*([^\n]+?)(?:\n|$)'
        job_matches = list(re.finditer(job_entry_pattern, exp_section, re.IGNORECASE))

        print(f"\nFound {len(job_matches)} job entries")

        if job_matches:
            match = job_matches[0]
            position = match.group(1).strip()
            company = match.group(2).strip()

            print(f"Position: {position}")
            print(f"Company: {company}")
            print(f"Match end position: {match.end()}")

            start_pos = match.end()
            next_bullet = re.search(rf'{bullet}', exp_section[start_pos:])

            if next_bullet:
                description_text = exp_section[start_pos:start_pos + next_bullet.start()]
                print(f"\nNext bullet found at position {next_bullet.start()}")
            else:
                description_text = exp_section[start_pos:]
                print(f"\nNo next bullet found, taking all remaining text")

            print(f"Description text length: {len(description_text)}")

            # Save description to file
            with open('description_text.txt', 'w', encoding='utf-8') as f:
                f.write(description_text)

            print("Description text saved to description_text.txt")

            # Process description
            description_lines = [line.strip() for line in description_text.split('\n') if line.strip()]
            description = ' '.join(description_lines)

            print(f"\nFinal description length: {len(description)}")
            print(f"Final description (first 200 chars): {description[:200]}")
