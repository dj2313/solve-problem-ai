import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Clock, 
  MessageSquare,
  CheckCircle,
  User,
  Bot,
  Star,
  Loader
} from 'lucide-react';
import { Problem, Answer } from '../types';
import { 
  problemService, 
  answerService, 
  userService, 
  voteService 
} from '../utils/storage';
import { AIService } from '../utils/aiService';

interface ProblemDetailProps {
  problemId: string;
  onBack: () => void;
}

export const ProblemDetail: React.FC<ProblemDetailProps> = ({ 
  problemId, 
  onBack 
}) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<Answer | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [hasRequestedAI, setHasRequestedAI] = useState(false);
  
  const currentUser = userService.getCurrentUser();
  const aiService = AIService.getInstance();

  useEffect(() => {
    const problemData = problemService.getById(problemId);
    if (problemData) {
      setProblem(problemData);
      problemService.incrementViews(problemId);
      
      // Load answers
      const problemAnswers = answerService.getByProblemId(problemId);
      setAnswers(problemAnswers.filter(a => !a.isAI));
      
      // Check if AI answer exists
      const existingAIAnswer = problemAnswers.find(a => a.isAI);
      if (existingAIAnswer) {
        setAiAnswer(existingAIAnswer);
        setHasRequestedAI(true);
      }
    }
  }, [problemId]);

  const handleVote = (targetId: string, type: 'problem' | 'answer', value: 1 | -1) => {
    if (!currentUser) return;
    
    voteService.vote(currentUser.id, targetId, type, value);
    
    if (type === 'problem') {
      const updatedProblem = problemService.getById(problemId);
      if (updatedProblem) {
        setProblem(updatedProblem);
      }
    } else {
      const updatedAnswers = answerService.getByProblemId(problemId);
      setAnswers(updatedAnswers.filter(a => !a.isAI));
      const updatedAIAnswer = updatedAnswers.find(a => a.isAI);
      if (updatedAIAnswer) {
        setAiAnswer(updatedAIAnswer);
      }
    }
  };

  const getUserVote = (targetId: string, type: 'problem' | 'answer') => {
    if (!currentUser) return null;
    return voteService.getUserVote(currentUser.id, targetId, type);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answer = answerService.create({
        problemId,
        content: newAnswer,
        authorId: currentUser.id,
        authorName: currentUser.username,
        isAI: false
      });

      setAnswers(prev => [answer, ...prev]);
      setNewAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAIAnswer = async () => {
    if (!problem || isGeneratingAI || hasRequestedAI) return;

    setIsGeneratingAI(true);
    setHasRequestedAI(true);
    
    try {
      const aiResponse = await aiService.generateAnswer(problem.title, problem.description);
      const answer = answerService.create({
        ...aiResponse,
        problemId,
        authorId: 'ai',
        authorName: 'AI Assistant'
      });

      setAiAnswer(answer);
    } catch (error) {
      console.error('Error generating AI answer:', error);
      setHasRequestedAI(false);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading problem details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to problems
          </button>
        </div>

        {/* Problem Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Problem Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                problem.status === 'solved' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {problem.status === 'solved' ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : null}
                {problem.status}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {problem.views}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDate(problem.createdAt)}
              </div>
            </div>
          </div>

          {/* Problem Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {problem.title}
          </h1>

          {/* Problem Description */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Problem Image */}
          {problem.image && (
            <div className="mb-6">
              <img
                src={problem.image}
                alt="Problem illustration"
                className="w-full max-w-2xl rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Problem Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote(problem.id, 'problem', 1)}
                  className={`p-2 rounded-lg transition-colors ${
                    getUserVote(problem.id, 'problem')?.value === 1
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <span className="font-medium text-gray-900">{problem.votes}</span>
                <button
                  onClick={() => handleVote(problem.id, 'problem', -1)}
                  className={`p-2 rounded-lg transition-colors ${
                    getUserVote(problem.id, 'problem')?.value === -1
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Asked by <span className="font-medium">{problem.authorName}</span>
            </div>
          </div>
        </div>

        {/* AI Answer Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-600" />
              AI Assistant
            </h2>
            
            {!hasRequestedAI && (
              <button
                onClick={handleGenerateAIAnswer}
                disabled={isGeneratingAI}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get AI Answer'
                )}
              </button>
            )}
          </div>

          {isGeneratingAI && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">AI is analyzing your problem...</p>
              </div>
            </div>
          )}

          {aiAnswer && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-800 mb-4">{aiAnswer.content}</p>
              
              {aiAnswer.steps && aiAnswer.steps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    {aiAnswer.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleVote(aiAnswer.id, 'answer', 1)}
                    className={`p-1 rounded transition-colors ${
                      getUserVote(aiAnswer.id, 'answer')?.value === 1
                        ? 'bg-green-200 text-green-600'
                        : 'text-gray-500 hover:bg-blue-100'
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <span className="text-sm text-gray-600">{aiAnswer.votes}</span>
                  <button
                    onClick={() => handleVote(aiAnswer.id, 'answer', -1)}
                    className={`p-1 rounded transition-colors ${
                      getUserVote(aiAnswer.id, 'answer')?.value === -1
                        ? 'bg-red-200 text-red-600'
                        : 'text-gray-500 hover:bg-blue-100'
                    }`}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Star className="h-3 w-3 mr-1" />
                  AI Response
                </div>
              </div>
            </div>
          )}

          {!hasRequestedAI && !isGeneratingAI && (
            <div className="text-center py-6 text-gray-500">
              <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Click "Get AI Answer" to receive an instant AI-powered solution</p>
            </div>
          )}
        </div>

        {/* Answers Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Community Answers ({answers.length})
          </h2>

          {answers.map((answer) => (
            <div key={answer.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 mb-6 last:mb-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{answer.authorName}</span>
                      {answer.isAccepted && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(answer.createdAt)}</span>
                  </div>
                  
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700">{answer.content}</p>
                  </div>

                  {answer.steps && answer.steps.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Steps to solve:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        {answer.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(answer.id, 'answer', 1)}
                        className={`p-1 rounded transition-colors ${
                          getUserVote(answer.id, 'answer')?.value === 1
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <span className="text-sm text-gray-600">{answer.votes}</span>
                      <button
                        onClick={() => handleVote(answer.id, 'answer', -1)}
                        className={`p-1 rounded transition-colors ${
                          getUserVote(answer.id, 'answer')?.value === -1
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {answers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No community answers yet. Be the first to help!</p>
            </div>
          )}
        </div>

        {/* Add Answer Form */}
        {currentUser && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
            
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-4">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Share your knowledge and help solve this problem..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newAnswer.trim() || isSubmitting}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Post Answer'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};