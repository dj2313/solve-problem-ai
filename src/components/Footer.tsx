import React from 'react';
import { Search, Heart, Github, Twitter, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-500' },
    { name: 'Email', icon: Mail, href: 'mailto:support@solvehub.com', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Simple Info Section */}
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg shadow-sm">
              <Search className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">SolveHub</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Get instant AI-powered solutions to your everyday problems. Simple, fast, and reliable.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-600 mb-4 md:mb-0">
              <span>© {currentYear} SolveHub. Made with</span>
              <span>for problem solvers.</span>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>🤖 AI-Powered</span>
              <span>•</span>
              <span>⚡ Instant Answers</span>
              <span>•</span>
              <span>🔒 Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};