import { Answer } from '../types';

// Mock AI service - in production, this would connect to OpenAI, Google AI, etc.
export class AIService {
  private static instance: AIService;
  private responses: Map<string, string> = new Map();

  private constructor() {
    this.initializeResponses();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private initializeResponses(): void {
    // Pre-defined AI responses for demo purposes
    this.responses.set('coffee stain', 
      'For coffee stains on fabric, immediate action is crucial. Cold water is your best friend - never use hot water as it can set the stain permanently.'
    );
    
    this.responses.set('laptop overheating', 
      'Laptop overheating during video calls indicates high CPU usage combined with poor ventilation. This is a common issue that can usually be resolved with proper maintenance.'
    );
    
    this.responses.set('sink clog', 
      'Kitchen sink clogs are often caused by grease and food particles. Try natural solutions first before resorting to harsh chemicals or calling a professional.'
    );
    
    this.responses.set('meal prep chicken', 
      'Proper chicken meal prep requires attention to cooking temperature, cooling methods, and storage techniques to maintain both safety and quality throughout the week.'
    );
    
    this.responses.set('brake noise', 
      'Grinding brake noise is a serious safety concern that typically indicates worn brake pads or damaged rotors. This should be addressed immediately by a qualified mechanic.'
    );
  }

  private findBestResponse(problemText: string): string {
    const text = problemText.toLowerCase();
    
    for (const [key, response] of this.responses) {
      if (text.includes(key.replace(' ', '')) || key.split(' ').every(word => text.includes(word))) {
        return response;
      }
    }
    
    return 'I understand you\'re facing a challenge. While I don\'t have a specific solution for this particular problem, I recommend breaking it down into smaller parts and researching each component. The community here has great experience that might help!';
  }

  private generateSteps(problemText: string): string[] {
    const text = problemText.toLowerCase();
    
    if (text.includes('coffee') && text.includes('stain')) {
      return [
        'Blot the stain immediately with a clean, dry cloth',
        'Rinse the back of the fabric with cold water',
        'Apply a mixture of liquid detergent and cold water',
        'Let sit for 5-10 minutes, then rinse thoroughly',
        'Wash in cold water according to fabric care instructions',
        'Air dry and inspect before using heat'
      ];
    }
    
    if (text.includes('laptop') && text.includes('overheating')) {
      return [
        'Close unnecessary applications and browser tabs',
        'Check Activity Monitor for high CPU usage processes',
        'Ensure laptop vents are not blocked by dust or debris',
        'Use compressed air to clean vents and fans',
        'Consider using a laptop cooling pad',
        'Update your operating system and drivers',
        'Monitor temperatures using built-in diagnostics'
      ];
    }
    
    if (text.includes('sink') && (text.includes('clog') || text.includes('drain'))) {
      return [
        'Remove any visible debris from the drain opening',
        'Pour boiling water down the drain to dissolve grease',
        'Create a baking soda and vinegar solution (1:1 ratio)',
        'Pour the mixture down the drain and wait 15 minutes',
        'Flush with hot water to clear the reaction',
        'Use a plunger specifically designed for sinks if needed',
        'Consider enzyme cleaners for organic buildup'
      ];
    }
    
    return [
      'Assess the situation and gather relevant information',
      'Research similar problems and proven solutions',
      'Start with the simplest, safest approach first',
      'Document your steps and results for future reference',
      'Seek professional help if the problem persists',
      'Share your experience to help others with similar issues'
    ];
  }

  async generateAnswer(problemTitle: string, problemDescription: string): Promise<Omit<Answer, 'id' | 'problemId' | 'authorId' | 'authorName' | 'createdAt' | 'votes' | 'isAccepted' | 'helpfulRating'>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fullText = `${problemTitle} ${problemDescription}`;
    const content = this.findBestResponse(fullText);
    const steps = this.generateSteps(fullText);
    
    return {
      content,
      isAI: true,
      steps
    };
  }

  async rateAnswer(answerId: string, rating: number): Promise<void> {
    // In a real implementation, this would send feedback to improve AI responses
    console.log(`AI Answer ${answerId} rated: ${rating}/100`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}