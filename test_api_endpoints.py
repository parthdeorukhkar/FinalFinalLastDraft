import requests
import json

# Test parse-resume endpoint
print("="*80)
print("TESTING /parse-resume ENDPOINT")
print("="*80)

parse_url = "http://localhost:8000/parse-resume"
parse_data = {
    "candidateId": "test123",
    "resumePath": r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"
}

try:
    response = requests.post(parse_url, json=parse_data, timeout=60)
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\nRESPONSE DATA:")
        print(f"- Has 'text' field: {'text' in data}")
        print(f"- Skills count: {len(data.get('skills', []))}")
        print(f"- Experience count: {len(data.get('experience', []))}")
        print(f"- Education count: {len(data.get('education', []))}")

        if data.get('experience'):
            print(f"\nFirst experience entry:")
            print(json.dumps(data['experience'][0], indent=2))

        if data.get('education'):
            print(f"\nFirst education entry:")
            print(json.dumps(data['education'][0], indent=2))

        if data.get('skills'):
            print(f"\nFirst 5 skills:")
            for skill in data['skills'][:5]:
                print(f"  - {skill.get('name', 'N/A')} ({skill.get('proficiency', 'N/A')})")
    else:
        print(f"ERROR: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "="*80)
print("TESTING /match-candidate ENDPOINT")
print("="*80)

match_url = "http://localhost:8000/match-candidate"
match_data = {
    "candidateId": "test123",
    "resumePath": r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf",
    "jobRequirements": {
        "skills": [
            {"name": "Python", "importance": "Required"},
            {"name": "JavaScript", "importance": "Required"},
            {"name": "React", "importance": "Preferred"},
            {"name": "Node.js", "importance": "Preferred"}
        ],
        "experience": {"min": 1, "max": 3},
        "education": "Bachelor"
    }
}

try:
    response = requests.post(match_url, json=match_data, timeout=60)
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\nRESPONSE DATA:")
        print(f"- Match Score: {data.get('matchScore', 'N/A')}")
        print(f"- Has Summary: {'summary' in data}")
        print(f"- Strengths count: {len(data.get('strengths', []))}")
        print(f"- Weaknesses count: {len(data.get('weaknesses', []))}")
        print(f"- Recommended Roles count: {len(data.get('recommendedRoles', []))}")

        print(f"\nSummary: {data.get('summary', 'N/A')[:200]}...")

        if data.get('strengths'):
            print(f"\nStrengths:")
            for strength in data['strengths'][:3]:
                print(f"  - {strength}")

        if data.get('weaknesses'):
            print(f"\nWeaknesses:")
            for weakness in data['weaknesses'][:3]:
                print(f"  - {weakness}")

        if data.get('recommendedRoles'):
            print(f"\nRecommended Roles:")
            for role in data['recommendedRoles'][:2]:
                print(f"  - {role.get('role', 'N/A')} ({role.get('matchPercentage', 0)}%)")
    else:
        print(f"ERROR: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")