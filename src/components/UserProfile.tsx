import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Trophy, 
  MessageSquare, 
  CheckCircle,
  Settings,
  Mail,
  Camera
} from 'lucide-react';
import { userService, problemService, answerService } from '../utils/storage';
import { User as UserType } from '../types';

interface UserStats {
  problemsSolved: number;
  solutionsPosted: number;
  reputation: number;
  rank: number;
}

interface UserActivity {
  date: Date;
  type: 'problem' | 'solution' | 'comment';
  description: string;
}

interface UserProfileProps {
  user?: {
    id: string;
    username: string;
    avatar: string;
    joinDate: Date;
    stats: UserStats;
    recentActivity: UserActivity[];
  };
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'answers' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  const currentUser = userService.getCurrentUser();
  const userProblems = problemService.getAll().filter(p => p.authorId === currentUser?.id);
  const userAnswers = answerService.getAll().filter(a => a.authorId === currentUser?.id && !a.isAI);

  const handleEditProfile = () => {
    if (currentUser) {
      setEditData({
        username: currentUser.username,
        email: currentUser.email,
        avatar: currentUser.avatar ?? ''
      });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      const updatedUser: UserType = {
        ...currentUser,
        username: editData.username,
        email: editData.email,
        avatar: editData.avatar
      };
      userService.setCurrentUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ username: '', email: '', avatar: '' });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Found</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const reputationLevel = currentUser.reputation >= 1000 ? 'Expert' : 
                         currentUser.reputation >= 500 ? 'Advanced' :
                         currentUser.reputation >= 100 ? 'Intermediate' : 'Beginner';

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

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {currentUser.avatar ? (
                  <img
                    src={isEditing ? editData.avatar || currentUser.avatar : currentUser.avatar}
                    alt={currentUser.username}
                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                )}
                
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                )}
              </div>
              
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="block text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="url"
                      value={editData.avatar}
                      onChange={(e) => setEditData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="Avatar URL"
                      className="block text-sm text-gray-500 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{currentUser.username}</h1>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {currentUser.email}
                    </div>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {formatDate(
                        typeof currentUser.joinDate === 'string'
                          ? currentUser.joinDate
                          : currentUser.joinDate.toISOString()
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reputation</p>
                <p className="text-2xl font-bold text-gray-900">{currentUser.reputation}</p>
                <p className="text-xs text-blue-600">{reputationLevel}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Problems Asked</p>
                <p className="text-2xl font-bold text-gray-900">{userProblems.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Answers Given</p>
                <p className="text-2xl font-bold text-gray-900">{userAnswers.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solutions</p>
                <p className="text-2xl font-bold text-gray-900">{currentUser.problemsSolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'problems', name: `Problems (${userProblems.length})` },
                { id: 'answers', name: `Answers (${userAnswers.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {userProblems.slice(0, 3).map((problem) => (
                      <div key={problem.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{problem.title}</p>
                          <p className="text-sm text-gray-500">{formatDate(problem.createdAt)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.status === 'solved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {problem.status}
                        </span>
                      </div>
                    ))}
                    
                    {userProblems.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No problems asked yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'problems' && (
              <div className="space-y-4">
                {userProblems.map((problem) => (
                  <div key={problem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{problem.title}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{problem.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(problem.createdAt)}</span>
                          <span>{problem.votes} votes</span>
                          <span>{problem.views} views</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.status === 'solved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {problem.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                {userProblems.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">You haven't asked any problems yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'answers' && (
              <div className="space-y-4">
                {userAnswers.map((answer) => {
                  const problem = problemService.getById(answer.problemId);
                  return (
                    <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="mb-2">
                        <p className="text-sm text-gray-500">
                          Answered: <span className="font-medium text-gray-900">{problem?.title}</span>
                        </p>
                      </div>
                      <p className="text-gray-700 mb-3">{answer.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(answer.createdAt)}</span>
                        <div className="flex items-center space-x-3">
                          <span>{answer.votes} votes</span>
                          {answer.isAccepted && (
                            <span className="text-green-600 font-medium">✓ Accepted</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {userAnswers.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">You haven't provided any answers yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};