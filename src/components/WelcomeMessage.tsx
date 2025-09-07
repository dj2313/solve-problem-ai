import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react';
import { User } from '../types';

interface WelcomeMessageProps {
  user: User | null;
  totalProblems: number;
  onAddProblem: () => void;
  onViewTrending: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  user,
  totalProblems,
  onAddProblem,
  onViewTrending
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 1000) return { level: 'Expert', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (reputation >= 500) return { level: 'Advanced', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (reputation >= 100) return { level: 'Intermediate', color: 'text-green-600', bgColor: 'bg-green-100' };
    return { level: 'Beginner', color: 'text-orange-600', bgColor: 'bg-orange-100' };
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to SolveHub!
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get instant AI-powered solutions to your everyday problems. 
            From cleaning tips to tech troubleshooting, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onAddProblem}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Ask Your First Question
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              View Popular Questions
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const reputationInfo = getReputationLevel(user.reputation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <span className="text-white font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user.username}! 👋
              </h2>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${reputationInfo.bgColor} ${reputationInfo.color}`}>
                  <Award className="h-4 w-4 mr-1" />
                  {reputationInfo.level}
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  {user.reputation} reputation points
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Problems Solved</p>
                  <p className="text-2xl font-bold text-gray-900">{user.problemsSolved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Community</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProblems}</p>
                  <p className="text-xs text-gray-400">total problems</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            Ready to get AI-powered solutions to your problems? 
            Ask anything and get instant, helpful answers!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-6 lg:mt-0 lg:ml-8">
          <button
            onClick={onAddProblem}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Ask a Question
          </button>
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular Questions
          </button>
        </div>
      </div>
    </motion.div>
  );
};