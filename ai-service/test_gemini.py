"""
Quick test script for Gemini parser
Run this after adding your API key to .env
"""

import os
import sys
import io
from dotenv import load_dotenv

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Load environment variables
load_dotenv()

print("="*80)
print("GEMINI API KEY TEST")
print("="*80)

api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ GEMINI_API_KEY not found in environment")
    print("\nTo fix:")
    print("1. Get API key from: https://aistudio.google.com/app/apikey")
    print("2. Edit ai-service/.env file")
    print("3. Replace 'your_gemini_api_key_here' with your actual key")
elif api_key == 'your_gemini_api_key_here':
    print("❌ GEMINI_API_KEY is still the placeholder value")
    print("\nTo fix:")
    print("1. Get API key from: https://aistudio.google.com/app/apikey")
    print("2. Edit ai-service/.env file")
    print("3. Replace 'your_gemini_api_key_here' with your actual key")
else:
    print(f"✅ GEMINI_API_KEY found: {api_key[:20]}...")
    print("\nNow testing Gemini parser...")

    try:
        from src.gemini_parser import GeminiResumeParser

        parser = GeminiResumeParser()
        print("✅ Gemini parser initialized successfully!")

        # Test with a real resume
        test_file = r"C:\Users\parth\Desktop\FinalYearFinalProjectLastDraft\backend\uploads\resumes\1762426725863-933096751.pdf"

        if os.path.exists(test_file):
            print(f"\n📄 Testing with resume: {os.path.basename(test_file)}")
            print("⏳ Parsing... (this may take a few seconds)")

            result = parser.parse_resume(test_file)

            print("\n" + "="*80)
            print("✅ PARSING SUCCESSFUL!")
            print("="*80)

            print(f"\n👤 Personal Info:")
            print(f"   Name: {result.get('personalInfo', {}).get('name', 'N/A')}")
            print(f"   Email: {result.get('personalInfo', {}).get('email', 'N/A')}")

            print(f"\n💼 Work Experience: {len(result.get('experience', []))} entries")
            for i, exp in enumerate(result.get('experience', [])[:2], 1):
                print(f"\n   {i}. {exp.get('position', 'N/A')} at {exp.get('company', 'N/A')}")
                desc = exp.get('description', '')
                print(f"      Description: {desc[:100]}..." if len(desc) > 100 else f"      Description: {desc}")

            print(f"\n🎓 Education: {len(result.get('education', []))} entries")
            for i, edu in enumerate(result.get('education', [])[:2], 1):
                print(f"   {i}. {edu.get('degree', 'N/A')} - {edu.get('institution', 'N/A')}")

            print(f"\n💻 Skills: {len(result.get('skills', []))} found")
            skills = [s.get('name', '') for s in result.get('skills', [])[:10]]
            print(f"   {', '.join(skills)}")

            print("\n" + "="*80)
            print("✅ Gemini parser is working perfectly!")
            print("="*80)
            print("\nNext steps:")
            print("1. Start the AI service: cd ai-service && python -m uvicorn src.api:app --reload --host 0.0.0.0 --port 8000")
            print("2. In your app, click 'Analyze' on any candidate")
            print("3. You'll see complete, accurate resume data!")

        else:
            print(f"❌ Test resume not found: {test_file}")
            print("But Gemini parser is initialized and ready to use!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nThis might be because:")
        print("1. Invalid API key")
        print("2. No internet connection")
        print("3. API quota exceeded (unlikely with free tier)")

print("\n" + "="*80)
