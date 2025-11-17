import sys
sys.path.insert(0, r'c:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\ai-service')

from src.gemini_parser import GeminiResumeParser
from src.matching_engine import MatchingEngine

# Test file
test_file = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

# Parse resume
parser = GeminiResumeParser()
print("Parsing resume...")
parsed_data = parser.parse_resume(test_file)

print(f"\nParsed data types:")
print(f"  skills type: {type(parsed_data['skills'])}")
if parsed_data['skills']:
    print(f"  first skill type: {type(parsed_data['skills'][0])}")
    print(f"  first skill: {parsed_data['skills'][0]}")

print(f"  experience type: {type(parsed_data['experience'])}")
if parsed_data['experience']:
    print(f"  first experience type: {type(parsed_data['experience'][0])}")

print(f"  education type: {type(parsed_data['education'])}")
if parsed_data['education']:
    print(f"  first education type: {type(parsed_data['education'][0])}")
    print(f"  first education: {parsed_data['education'][0]}")

# Test job requirements
job_requirements = {
    "skills": [
        {"name": "Python", "importance": "Required"},
        {"name": "JavaScript", "importance": "Required"},
        {"name": "React", "importance": "Preferred"}
    ],
    "experience": {"min": 1, "max": 3},
    "education": "Bachelor"
}

# Try to match
print("\n\nTrying to match candidate...")
matching_engine = MatchingEngine()
try:
    result = matching_engine.calculate_match(parsed_data, job_requirements)
    print("SUCCESS!")
    print(f"Match score: {result['score']}")
    print(f"Summary: {result['summary']}")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
