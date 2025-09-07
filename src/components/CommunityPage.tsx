import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, MessageCircle, TrendingUp, Star, Calendar, ArrowLeft } from 'lucide-react';

interface CommunityPageProps {
  onBack: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const topContributors = [
    { id: 1, name: 'Alex Chen', avatar: null, reputation: 2450, solutions: 89, badge: 'Expert' },
    { id: 2, name: 'Sarah Johnson', avatar: null, reputation: 1890, solutions: 67, badge: 'Advanced' },
    { id: 3, name: 'Mike Rodriguez', avatar: null, reputation: 1650, solutions: 54, badge: 'Advanced' },
    { id: 4, name: 'Emma Wilson', avatar: null, reputation: 1420, solutions: 48, badge: 'Intermediate' },
    { id: 5, name: 'David Kim', avatar: null, reputation: 1200, solutions: 42, badge: 'Intermediate' },
  ];

  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: Users, color: 'blue' },
    { label: 'Problems Solved', value: '12,456', icon: Award, color: 'green' },
    { label: 'Total Discussions', value: '8,923', icon: MessageCircle, color: 'purple' },
    { label: 'This Month', value: '+342', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivity = [
    { user: 'Alex Chen', action: 'solved a problem in', category: 'Tech Support', time: '2 hours ago' },
    { user: 'Sarah Johnson', action: 'asked a question in', category: 'Home & Garden', time: '4 hours ago' },
    { user: 'Mike Rodriguez', action: 'provided a solution in', category: 'Cooking', time: '6 hours ago' },
    { user: 'Emma Wilson', action: 'started a discussion in', category: 'DIY Projects', time: '8 hours ago' },
    { user: 'David Kim', action: 'helped someone with', category: 'Car Maintenance', time: '12 hours ago' },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
              <Users className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the amazing people who make SolveHub a thriving community of problem solvers and solution providers.
          </p>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {communityStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <Award className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Top Contributors</h2>
          </div>
          
          <div className="space-y-4">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
                      {contributor.avatar ? (
                        <img
                          src={contributor.avatar}
                          alt={contributor.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {contributor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{contributor.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(contributor.badge)}`}>
                        {contributor.badge}
                      </span>
                      <span className="text-sm text-gray-500">{contributor.solutions} solutions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 mr-1" />
                    <span className="font-medium">{contributor.reputation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <MessageCircle className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.category}</span>
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Community Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Be Respectful</h4>
            <p className="text-sm text-gray-600">
              Treat all community members with kindness and respect. We're all here to help each other.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Stay On Topic</h4>
            <p className="text-sm text-gray-600">
              Keep discussions relevant and helpful. Focus on solving problems and sharing knowledge.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Share Quality Content</h4>
            <p className="text-sm text-gray-600">
              Provide detailed, helpful solutions. Quality contributions make our community stronger.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};