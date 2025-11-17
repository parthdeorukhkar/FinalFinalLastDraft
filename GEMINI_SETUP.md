# Google Gemini API Setup Guide

This guide will help you set up Google Gemini AI for resume parsing.

## Why Gemini?

We've integrated Google Gemini AI to replace the regex-based resume parser because:
- ✅ **More Accurate**: AI understands context and variations in resume formats
- ✅ **Better Extraction**: Correctly extracts work experience descriptions, education details, and skills
- ✅ **Handles Multiple Formats**: Works with different resume layouts and structures
- ✅ **No Gibberish Output**: Intelligently parses resume content instead of pattern matching

## Step 1: Get Your Free Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Sign in with your Google Account**
   - Use any Gmail account

3. **Create API Key**
   - Click on "Get API Key" or "Create API Key"
   - Click "Create API key in new project" (recommended)
   - Copy the generated API key

   **Note**: Gemini API has a generous free tier:
   - 15 requests per minute
   - 1 million tokens per day
   - More than enough for resume parsing!

## Step 2: Add API Key to Your Project

1. **Open the `.env` file** in the `ai-service` directory:
   ```
   ai-service/.env
   ```

2. **Replace the placeholder** with your actual API key:
   ```env
   # Google Gemini API Key (Required for AI-powered resume parsing)
   GEMINI_API_KEY=AIzaSy... (paste your actual key here)
   ```

3. **Save the file**

## Step 3: Restart the AI Service

1. **Stop the AI service** if it's running (Ctrl+C in the terminal)

2. **Start it again**:
   ```bash
   cd ai-service
   python -m uvicorn src.api:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Look for the success message**:
   ```
   ✅ Using Gemini AI-powered resume parser
   ```

   If you see this, Gemini is active! If you see a warning about regex parser, check your API key.

## Step 4: Test the Parser

1. **Upload a new candidate** or click "Analyze" on an existing candidate
2. The resume will now be parsed using Gemini AI
3. You should see:
   - ✅ Complete work experience descriptions (not just fragments)
   - ✅ Full education details
   - ✅ All skills correctly extracted
   - ✅ Professional AI-generated summary
   - ✅ Job role recommendations

## Troubleshooting

### Issue: "Using regex-based resume parser" warning

**Solution**:
- Check that your API key is correctly set in `.env`
- Make sure there are no extra spaces around the key
- Ensure the key starts with `AIzaSy...`

### Issue: "GEMINI_API_KEY environment variable not set"

**Solution**:
- Make sure you saved the `.env` file
- Restart the AI service
- Check that the file is in the correct location: `ai-service/.env`

### Issue: API quota exceeded

**Solution**:
- The free tier allows 15 requests per minute
- Wait a minute and try again
- For production use, consider upgrading to a paid plan

## Security Note

⚠️ **Never commit your API key to Git!**

The `.env` file is already in `.gitignore`, so your key should be safe. But always double-check before committing code.

## What Happens Without Gemini?

If you don't configure the Gemini API key, the system will automatically fall back to the regex-based parser. It will work, but with reduced accuracy compared to the AI-powered parser.

## Support

If you have any issues:
1. Check the console output for error messages
2. Verify your API key is valid
3. Ensure you have internet connection (Gemini requires API calls)

---

**Ready to go!** Once you've set up your API key, the AI-powered resume parsing will automatically activate! 🚀
