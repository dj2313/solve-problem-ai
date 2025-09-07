import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Sparkles, Bot } from 'lucide-react';
import { problemService, categoryService, userService } from '../utils/storage';
import { geminiService } from '../utils/geminiService';
import { Category } from '../types';

interface AddProblemProps {
  onBack: () => void;
  onProblemAdded: () => void;
}

export const AddProblem: React.FC<AddProblemProps> = ({ onBack, onProblemAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [showAiAnswer, setShowAiAnswer] = useState(false);
  
  const categories = categoryService.getAll();
  const currentUser = userService.getCurrentUser();

  // Test Gemini connection on component mount
  React.useEffect(() => {
    console.log('Gemini service configured:', geminiService.isConfigured());
    if (geminiService.isConfigured()) {
      geminiService.testConnection().then(success => {
        console.log('Gemini connection test:', success ? 'PASSED' : 'FAILED');
      });
    }
  }, []);

  const handleGenerateAiAnswer = async () => {
    if (!title.trim() || !description.trim() || !category) {
      alert('Please fill in the title, description, and category before getting AI assistance.');
      return;
    }

    console.log('Starting AI answer generation...', { title, description, category });
    setIsGeneratingAnswer(true);
    setShowAiAnswer(true);
    
    try {
      const selectedCategory = categories.find(cat => cat.id === category);
      const categoryName = selectedCategory?.name || category;
      
      console.log('Selected category:', { selectedCategory, categoryName });
      
      const fullQuestion = `${title.trim()}\n\n${description.trim()}`;
      console.log('Full question:', fullQuestion);
      
      const answer = await geminiService.generateAnswer(fullQuestion, category); // Use category ID instead of name
      console.log('Received answer:', answer);
      setAiAnswer(answer);
    } catch (error) {
      console.error('Error generating AI answer:', error);
      setAiAnswer('Sorry, I encountered an error while generating an answer. Please try again or consider posting your question to get help from the community.');
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      problemService.create({
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tagArray,
        authorId: currentUser.id,
        authorName: currentUser.username,
        status: 'open',
        image: imageUrl || undefined
      });

      categoryService.updateProblemCounts();
      onProblemAdded();
    } catch (error) {
      console.error('Error creating problem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedImages = [
    'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/209151/pexels-photo-209151.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to problems
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ask a Question</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Get instant AI-powered solutions or share with the community for personalized help
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Problem Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe your problem in one clear sentence"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {title.length}/200 characters
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Problem Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about your problem. Include what you've already tried, when it happens, and any error messages."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {description.length}/2000 characters
              </div>
            </div>

            {/* AI Assistant Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGenerateAiAnswer}
                disabled={isGeneratingAnswer || !title.trim() || !description.trim() || !category}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGeneratingAnswer ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Answer...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Assistant Help
                  </>
                )}
              </button>
            </div>

            {/* AI Answer Display */}
            {showAiAnswer && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg mr-3">
                    <Bot className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Assistant Response</h3>
                </div>
                
                {isGeneratingAnswer ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                    <span className="text-gray-600">Analyzing your question and generating a helpful response...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {aiAnswer}
                    </div>
                  </div>
                )}
                
                {!isGeneratingAnswer && aiAnswer && (
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        💡 This answer was generated by AI. For more personalized help, consider posting to the community.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAiAnswer(false)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Hide Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add relevant tags separated by commas (e.g., cleaning, stain removal, emergency)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Separate tags with commas. Max 10 tags.
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Image Preview */}
              {imageUrl && (
                <div className="mt-3 relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full max-w-md h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Suggested Images */}
              {!imageUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Or choose from suggested images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {suggestedImages.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setImageUrl(url)}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                      >
                        <img
                          src={url}
                          alt={`Suggested ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Tips for getting better answers:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about your problem and include relevant details</li>
                <li>• Mention what you've already tried to solve it</li>
                <li>• Try the AI Assistant first for instant help</li>
                <li>• Use clear, descriptive tags to help others find your question</li>
                <li>• Add images if they help explain the problem</li>
                <li>• Post to community if you need more personalized assistance</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim() || !category}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Post to Community
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};