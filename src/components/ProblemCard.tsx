import React from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Clock, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Problem } from '../types';
import { answerService } from '../utils/storage';

interface ProblemCardProps {
  problem: Problem;
  onClick: (problemId: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onClick }) => {
  const answers = answerService.getByProblemId(problem.id);
  const hasAcceptedAnswer = answers.some(answer => answer.isAccepted);
  
  const getStatusIcon = () => {
    switch (problem.status) {
      case 'solved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (problem.status) {
      case 'solved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div
      onClick={() => onClick(problem.id)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}
          >
            {problem.status}
          </span>
          {hasAcceptedAnswer && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              Solved
            </span>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {formatDate(problem.createdAt)}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {problem.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {problem.description}
      </p>

      {/* Image */}
      {problem.image && (
        <div className="mb-4">
          <img
            src={problem.image}
            alt="Problem illustration"
            className="w-full h-36 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            #{tag}
          </span>
        ))}
        {problem.tags.length > 3 && (
          <span className="text-xs text-gray-500">
            +{problem.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1" />
            {problem.votes}
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            {answers.length}
          </div>
          
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {problem.views}
          </div>
        </div>
        
        {/* Author */}
        <div className="text-xs text-gray-500 font-medium">
          by {problem.authorName}
        </div>
      </div>
    </div>
  );
};
