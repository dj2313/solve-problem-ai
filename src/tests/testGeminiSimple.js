// Simple test for Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyD-Q7OrYQwYWcjbbmSxHpKqrmI646Tvma8';

async function testGemini() {
  try {
    console.log('🔄 Testing Gemini API connection...');
    
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Test simple connection
    console.log('📡 Sending test request...');
    const result = await model.generateContent('Say hello and confirm you are working');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Connection successful!');
    console.log('🤖 Response:', text);

    // Test with a cleaning question
    console.log('\n🧽 Testing with cleaning question...');
    const cleaningResult = await model.generateContent(`
      You are a helpful AI assistant. Please provide a practical solution for this problem:
      
      Question: How to clean a coffee stain from a white shirt?
      Category: cleaning
      
      Please provide step-by-step instructions.
    `);
    
    const cleaningResponse = await cleaningResult.response;
    const cleaningText = cleaningResponse.text();
    
    console.log('🧽 Cleaning advice:', cleaningText);
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.message && error.message.includes('API_KEY')) {
      console.error('🔑 API Key issue detected');
    }
    
    if (error.message && (error.message.includes('quota') || error.message.includes('billing'))) {
      console.error('💳 Quota or billing issue detected');
    }
    
    return false;
  }
}

testGemini();