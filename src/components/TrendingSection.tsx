import React from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';
import { Problem } from '../types';
import { ProblemCard } from './ProblemCard';

interface TrendingSectionProps {
  problems: Problem[];
  onProblemClick: (problemId: string) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ 
  problems, 
  onProblemClick 
}) => {
  // Sort problems by a combination of votes, views, and recency
  const trendingProblems = [...problems]
    .sort((a, b) => {
      const scoreA = a.votes * 2 + a.views * 0.1 + (a.status === 'solved' ? 5 : 0);
      const scoreB = b.votes * 2 + b.views * 0.1 + (b.status === 'solved' ? 5 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 6);

  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const mostAnsweredProblems = [...problems]
    .filter(p => p.votes > 0)
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Trending Problems */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">Trending Problems</h2>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            Hot
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trendingProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onClick={onProblemClick}
            />
          ))}
        </div>

        {trendingProblems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No trending problems yet. Be the first to ask!</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Problems */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recently Asked</h3>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {recentProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => onProblemClick(problem.id)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {problem.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {problem.authorName}</span>
                  <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            
            {recentProblems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No recent problems</p>
              </div>
            )}
          </div>
        </section>

        {/* Most Popular */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Most Popular</h3>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {mostAnsweredProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => onProblemClick(problem.id)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  {problem.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{problem.votes} votes • {problem.views} views</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    problem.status === 'solved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {problem.status}
                  </span>
                </div>
              </div>
            ))}
            
            {mostAnsweredProblems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No popular problems yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};