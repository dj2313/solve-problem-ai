import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Bell, Menu, X, Sun, Moon, Home, Grid3X3, TrendingUp, Users } from 'lucide-react';
import { userService } from '../utils/storage';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProblem: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onCategoriesClick: () => void;
  onTrendingClick: () => void;
  onCommunityClick: () => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery: propSearchQuery,
  onSearchChange,
  onAddProblem,
  onProfileClick,
  onHomeClick,
  onCategoriesClick,
  onTrendingClick,
  onCommunityClick,
  currentView,
}) => {
  const [searchQuery, setSearchQuery] = useState(propSearchQuery || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);
  const currentUser = userService.getCurrentUser();

  // Update local search query when prop changes
  React.useEffect(() => {
    setSearchQuery(propSearchQuery || '');
  }, [propSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 4)]);
      onSearchChange(searchQuery);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: onHomeClick },
    { id: 'categories', label: 'Categories', icon: Grid3X3, onClick: onCategoriesClick },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={onHomeClick}>
              <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors duration-200">
                <Search className="h-6 w-6" />
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  SolveHub
                </h1>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-1 mx-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || 
                  (item.id === 'home' && currentView === 'home') ||
                  (item.id === 'categories' && (currentView === 'category' || currentView === 'add-problem')) ||
                  (item.id === 'trending' && currentView === 'trending');
                
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-lg">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                  placeholder="Search problems, solutions..."
                  className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg z-10">
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-500 px-3 py-2">Recent searches</p>
                      {searchHistory.map((query, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(query);
                            onSearchChange(query);
                            setShowSearchHistory(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 rounded-lg transition-colors flex items-center"
                        >
                          <Search className="h-4 w-4 text-gray-400 mr-2" />
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onAddProblem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-1 border border-gray-200 backdrop-blur-md">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <button
                onClick={onProfileClick}
                className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group ${
                  currentView === 'profile' ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                }`}
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.username}
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                  />
                ) : (
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <span className="text-sm font-medium text-gray-700 block">
                    {currentUser?.username || 'Guest'}
                  </span>
                  {currentUser && (
                    <span className="text-xs text-gray-500">{currentUser.reputation} pts</span>
                  )}
                </div>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search problems..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-gray-200 pt-3 mt-3">
              <button
                onClick={() => {
                  onAddProblem();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-3" />
                Ask Question
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mt-2"
              >
                {isDarkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
