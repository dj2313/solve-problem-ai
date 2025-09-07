import React, { useState, useEffect, useContext } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { ProblemCard } from './components/ProblemCard';
import { ProblemDetail } from './components/ProblemDetail';
import { AddProblem } from './components/AddProblem';


import { Footer } from './components/Footer';
import { CategoriesView } from './components/CategoriesView';
import { problemService, categoryService } from './utils/storage';
import { initializeMockData } from './utils/mockData';
import { Problem, Category } from './types';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

type View = 'home' | 'categories' | 'category' | 'problem' | 'add-problem';

function AppContent() {
  const { user } = useContext(AuthContext)!;
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
    loadData();
  }, []);

  const loadData = () => {
    setProblems(problemService.getAll());
    setCategories(categoryService.getAll());
  };

  // Filtering
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      searchQuery === '' ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === '' || problem.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('category');
    setSearchQuery('');
  };

  const handleProblemClick = (problemId: string) => {
    setSelectedProblem(problemId);
    setCurrentView('problem');
  };

  const handleAddProblem = () => setCurrentView('add-problem');

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory('');
    setSelectedProblem('');
    setSearchQuery('');
    loadData();
  };

  const handleBackToCategory = () => {
    setCurrentView('category');
    setSelectedProblem('');
  };

  const handleProblemAdded = () => {
    loadData();
    setCurrentView('home');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setCurrentView('category');
      setSelectedCategory('');
    } else if (currentView === 'category' && selectedCategory === '') {
      setCurrentView('home');
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Header
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onAddProblem={handleAddProblem}
            onProfileClick={() => {}}
            onHomeClick={handleBackToHome}
            onCategoriesClick={() => setCurrentView('categories')}
            onCommunityClick={() => {}} // Placeholder for future
            onTrendingClick={() => {}} // Placeholder for future
            currentView={currentView}
          />

          <main className="relative z-0 flex-1">
            {/* Home */}
            {currentView === 'home' && (
              <div className="relative overflow-hidden min-h-screen">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
                  <div className="absolute inset-0">
                    {/* Floating Orbs */}
                    <motion.div
                      className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
                      animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                      animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 0.9, 1],
                      }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400/25 to-blue-400/25 rounded-full blur-3xl"
                      animate={{
                        x: [0, 60, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  {/* Hero Section */}
                  <div className="text-center mb-20">
                    <div className="max-w-4xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            Simple
                          </motion.span>{" "}
                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                          >
                            Solutions
                          </motion.span>
                          <br />
                          <motion.span
                            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                          >
                            for Everything
                          </motion.span>
                        </h1>
                      </motion.div>

                      <motion.p
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        Get instant AI-powered answers or connect with our community of problem solvers. 
                        From tech issues to home repairs, we've got you covered.
                      </motion.p>

                      {/* Main CTA Button */}
                      <motion.div
                        className="flex justify-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                      >
                        <motion.button
                          onClick={handleAddProblem}
                          className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="relative z-10 flex items-center">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Get Instant AI Help
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.button>
                      </motion.div>

                      {/* Feature Cards */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      >
                        <motion.div
                          className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                          onClick={handleAddProblem}
                          whileHover={{ y: -10, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">Ask AI Assistant</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Get instant, intelligent answers powered by advanced AI technology.</p>
                          </div>
                        </motion.div>

                        <motion.div
                          className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                          onClick={() => setCurrentView('categories')}
                          whileHover={{ y: -10, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 transition-colors">Browse Topics</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Explore organized categories from tech support to home improvement.</p>
                          </div>
                        </motion.div>

                        <motion.div
                          className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                          whileHover={{ y: -10, scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors">Join Community</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Connect with experts and share knowledge with fellow problem solvers.</p>
                          </div>
                        </motion.div>
                      </motion.div>

                      {/* Quick Stats */}
                      <motion.div
                        className="flex flex-wrap justify-center items-center gap-12 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                      >
                        <motion.div
                          className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mr-3"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{problems.length}+ Problems Solved</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">AI-Powered Answers</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-3"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">24/7 Available</span>
                        </motion.div>
                      </motion.div>

                      {/* Popular Questions */}
                      <motion.div
                        className="max-w-6xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                      >
                        <motion.h2
                          className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.8, duration: 0.6 }}
                        >
                          Popular Questions
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            {
                              question: "How to remove stains from white clothes?",
                              category: "Home & Cleaning",
                              icon: "🧺",
                              gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                              question: "My laptop is running slow, what should I do?",
                              category: "Tech Support",
                              icon: "💻",
                              gradient: "from-purple-500 to-indigo-500"
                            },
                            {
                              question: "How to fix a leaky faucet?",
                              category: "Home Maintenance",
                              icon: "🔧",
                              gradient: "from-green-500 to-teal-500"
                            },
                            {
                              question: "Best way to cook pasta perfectly?",
                              category: "Cooking",
                              icon: "🍝",
                              gradient: "from-orange-500 to-red-500"
                            },
                            {
                              question: "How to improve WiFi signal strength?",
                              category: "Tech Support",
                              icon: "📶",
                              gradient: "from-pink-500 to-rose-500"
                            },
                            {
                              question: "How to remove scratches from car paint?",
                              category: "Car Maintenance",
                              icon: "🚗",
                              gradient: "from-yellow-500 to-amber-500"
                            }
                          ].map((item, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 30, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ 
                                delay: 2.0 + index * 0.1, 
                                duration: 0.5,
                                type: "spring",
                                stiffness: 100
                              }}
                              onClick={() => {
                                handleSearchChange(item.question);
                                handleAddProblem();
                              }}
                              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 text-left overflow-hidden"
                              whileHover={{ y: -5, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                              <div className="relative z-10">
                                <div className="flex items-start space-x-4">
                                  <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl">{item.icon}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 mb-2">
                                      {item.question}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.category}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories View */}
            {currentView === 'categories' && (
              <CategoriesView
                categories={categories}
                onCategoryClick={handleCategoryClick}
                onBack={handleBackToHome}
              />
            )}



            {/* Category */}
            {currentView === 'category' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                  <button
                    onClick={handleBackToHome}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                  >
                    ← Back to home
                  </button>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {currentCategory?.name || 'Search Results'}
                      </h1>
                      {currentCategory && (
                        <p className="text-gray-600 mt-1">
                          {currentCategory.description}
                        </p>
                      )}
                      {searchQuery && (
                        <p className="text-gray-600 mt-1">
                          Search results for:{" "}
                          <span className="font-medium">"{searchQuery}"</span>
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {filteredProblems.length} problem
                      {filteredProblems.length !== 1 ? 's' : ''} found
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProblems.map((problem) => (
                    <ProblemCard
                      key={problem.id}
                      problem={problem}
                      onClick={handleProblemClick}
                    />
                  ))}
                </div>

                {filteredProblems.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery
                      ? `No problems found matching "${searchQuery}"`
                      : currentCategory
                      ? `No problems found in ${currentCategory.name}`
                      : 'No problems found'}
                  </div>
                )}
              </div>
            )}

            {/* Problem Detail */}
            {currentView === 'problem' && (
              <ProblemDetail
                problemId={selectedProblem}
                onBack={selectedCategory ? handleBackToCategory : handleBackToHome}
              />
            )}

            {/* Add Problem */}
            {currentView === 'add-problem' && (
              <AddProblem onBack={handleBackToHome} onProblemAdded={handleProblemAdded} />
            )}          </main>

          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
