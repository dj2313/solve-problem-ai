import { GoogleGenerativeAI } from '@google/generative-ai';

// Update API key with your new key
const API_KEY = 'AIzaSyD-Q7OrYQwYWcjbbmSxHpKqrmI646Tvma8';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    try {
      if (!API_KEY) {
        throw new Error('API key is not configured');
      }

      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Test the connection on initialization
      this.testConnection().then(isConnected => {
        if (isConnected) {
          console.log('✅ Gemini API initialized successfully');
        } else {
          console.error('❌ Failed to initialize Gemini API');
        }
      });

    } catch (error) {
      console.error('Error initializing Gemini service:', error);
    }
  }

  async generateAnswer(question: string, category: string): Promise<string> {
    console.log('Generating answer for:', { question, category, hasModel: !!this.model });
    
    if (!this.model) {
      console.log('No model available, using fallback');
      return this.getFallbackAnswer(question, category);
    }

    try {
      const prompt = `You are a helpful AI assistant that provides practical solutions to everyday problems. 
      
Question: ${question}
Category: ${category}

Please provide a clear, step-by-step solution that is:
1. Practical and actionable
2. Safe and appropriate
3. Easy to understand
4. Specific to the problem asked

If you need more information to provide a complete answer, mention what additional details would be helpful.

Format your response in a friendly, helpful tone as if you're talking to a friend who needs assistance.`;

      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API:', text ? 'Success' : 'Empty response');
      return text || this.getFallbackAnswer(question, category);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Check if it's an API key issue
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message.includes('API_KEY')) {
        return `I'm having trouble connecting to the AI service. This might be due to an API key issue. 

Here's what I can suggest for your question about "${question}":

${this.getFallbackAnswer(question, category)}`;
      }
      
      // Check if it's a quota/billing issue
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && ((error as any).message.includes('quota') || (error as any).message.includes('billing'))) {
        return `The AI service is temporarily unavailable due to quota limits. 

Here's a helpful response for your question about "${question}":

${this.getFallbackAnswer(question, category)}`;
      }
      
      return this.getFallbackAnswer(question, category);
    }
  }

  private getFallbackAnswer(question: string, category: string): string {
    // Try to match category by name as well as ID
    const categoryKey = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    const fallbackAnswers: { [key: string]: string } = {
      'tech': `I'd be happy to help with your tech issue! Here are some general troubleshooting steps:
      
1. **Restart your device** - This solves many common issues
2. **Check for updates** - Make sure your software is up to date
3. **Clear cache/cookies** - If it's a browser or app issue
4. **Check connections** - Ensure all cables and network connections are secure

For more specific help, please provide:
- What device/software you're using
- When the problem started
- Any error messages you're seeing
- What you were doing when it happened

Feel free to ask follow-up questions for more targeted assistance!`,

      'technology': `I'd be happy to help with your tech issue! Here are some general troubleshooting steps:

1. **Restart your device** - This solves many common issues
2. **Check for updates** - Make sure your software is up to date
3. **Clear cache/cookies** - If it's a browser or app issue
4. **Check connections** - Ensure all cables and network connections are secure

For more specific help, please provide:
- What device/software you're using
- When the problem started
- Any error messages you're seeing
- What you were doing when it happened

Feel free to ask follow-up questions for more targeted assistance!`,

      'cleaning': `Here's a comprehensive approach to tackle your cleaning challenge:

1. **Assess the situation** - Identify what type of stain/mess you're dealing with
2. **Gather supplies** - Common items: white vinegar, baking soda, dish soap, microfiber cloths
3. **Test first** - Always test cleaning solutions on a small, hidden area
4. **Work from outside in** - For stains, start from the edges and work toward the center
5. **Blot, don't rub** - This prevents spreading the stain

**Common solutions:**
- Grease: Dish soap + warm water
- Protein stains: Cold water + enzyme cleaner
- General stains: White vinegar + baking soda paste

Would you like specific advice for your particular cleaning challenge?`,

      'cooking': `Let me help you with your cooking question! Here's a general approach:

1. **Preparation is key** - Read the entire recipe first and prep all ingredients
2. **Temperature matters** - Use a thermometer for meats and baking
3. **Timing** - Set timers and don't rush the process
4. **Taste as you go** - Adjust seasoning throughout cooking
5. **Practice makes perfect** - Don't be discouraged if it's not perfect the first time

**Basic cooking tips:**
- Salt enhances flavors
- Let meat rest after cooking
- Don't overcrowd pans
- Fresh herbs at the end, dried herbs early

What specific dish or technique would you like help with?`,

      'home': `Here's a systematic approach to your home maintenance issue:

1. **Safety first** - Turn off power/water if needed and wear protective gear
2. **Identify the problem** - Look for obvious signs of damage or wear
3. **Gather tools** - Basic toolkit: screwdriver, wrench, pliers, level
4. **Research** - Check manufacturer instructions or reliable DIY resources
5. **Know your limits** - Some jobs require professional help

**When to call a professional:**
- Electrical work beyond simple switches
- Major plumbing issues
- Structural problems
- Gas-related repairs

**Common DIY fixes:**
- Leaky faucets: Usually just need new washers
- Squeaky hinges: A drop of oil
- Loose screws: Tighten or use larger screws

What specific maintenance issue are you facing?`,

      'automotive': `Here's how to approach your car maintenance concern:

1. **Safety first** - Park on level ground, engage parking brake
2. **Consult your manual** - Check your owner's manual for specifications
3. **Regular maintenance** - Follow the recommended service schedule
4. **Warning signs** - Don't ignore unusual sounds, smells, or dashboard lights
5. **Professional help** - Some repairs require specialized tools and knowledge

**Basic maintenance you can do:**
- Check fluid levels (oil, coolant, brake fluid)
- Inspect tires for wear and proper pressure
- Replace air filter and cabin filter
- Check lights and signals

**When to see a mechanic:**
- Engine problems
- Brake issues
- Transmission problems
- Electrical issues

What specific car issue are you experiencing?`
    };

    // Try different category matching approaches
    const possibleKeys = [
      category, // exact match first
      categoryKey,
      category.toLowerCase(),
      'tech',
      'cleaning', 
      'cooking',
      'home',
      'automotive'
    ];

    for (const key of possibleKeys) {
      if (fallbackAnswers[key]) {
        return fallbackAnswers[key];
      }
    }

    // Default fallback with question-specific guidance
    return `Thank you for your question: "${question}"

I'd be happy to help! Here's a systematic approach to tackle your problem:

**Step 1: Gather Information**
- What exactly is happening?
- When did this problem start?
- What have you already tried?

**Step 2: Basic Troubleshooting**
- Check the obvious things first (power, connections, settings)
- Look for error messages or warning signs
- Try the simplest solution first

**Step 3: Research & Resources**
- Search for similar problems online
- Check official documentation or manuals
- Look for video tutorials if applicable

**Step 4: Safety First**
- If it involves electricity, water, or chemicals, be extra careful
- When in doubt, consult a professional
- Don't attempt repairs beyond your skill level

**Step 5: Document & Learn**
- Keep track of what works and what doesn't
- Share your solution to help others

Would you like to provide more specific details about your situation? The more information you share, the better I can assist you!

💡 **Tip:** You can also post this question to our community for personalized advice from other users who may have faced similar challenges.`;
  }

  isConfigured(): boolean {
    return this.model !== null;
  }

  async testConnection(): Promise<boolean> {
    if (!this.model) {
      console.log('No model available for testing');
      return false;
    }

    try {
      const result = await this.model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      console.log('Test connection successful:', text);
      return true;
    } catch (error) {
      console.error('Test connection failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();