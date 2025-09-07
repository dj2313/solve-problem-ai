import { geminiService } from '../utils/geminiService';

async function testGeminiService() {
  try {
    // Test connection
    const isConnected = await geminiService.testConnection();
    console.log('Connection test:', isConnected ? 'SUCCESS' : 'FAILED');

    // Test generating an answer
    const answer = await geminiService.generateAnswer(
      'How to clean a coffee stain?',
      'cleaning'
    );
    console.log('Test answer:', answer);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testGeminiService();