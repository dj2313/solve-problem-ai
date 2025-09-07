# Solve Problem AI

An AI-powered solution generator that provides practical answers to everyday problems using Google's Gemini API.

## Features

- Generate step-by-step solutions for common problems
- Multiple categories supported:
  - Tech & Technology
  - Cleaning & Maintenance
  - Cooking & Food
  - Home Improvement
  - Automotive
- Fallback responses when AI is unavailable
- Smart category matching

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Gemini API key in `src/utils/geminiService.ts`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file with:
```
GEMINI_API_KEY=your_api_key_here
```

## Technologies

- TypeScript
- Google Gemini API
- React (if using)
- Node.js

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT