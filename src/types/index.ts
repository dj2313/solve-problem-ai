export type View = 'home' | 'category' | 'problem' | 'add-problem' | 'profile' | 'trending' | 'community' | 'signin' | 'signup' | 'settings' | 'help';

export interface NavigationState {
  currentView: View;
  selectedCategory: string | null;
  selectedProblem: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinDate: string | Date;
  problemsSolved: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'solved' | 'closed';
  views: number;
  votes: number;
  image?: string;
}

export interface Answer {
  id: string;
  problemId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  votes: number;
  isAccepted: boolean;
  isAI: boolean;
  helpfulRating: number;
  steps?: string[];
}

export interface Comment {
  id: string;
  answerId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  votes: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  problemCount: number;
}

export interface UserVote {
  id: string;
  userId: string;
  targetId: string; // problemId or answerId
  type: 'problem' | 'answer';
  value: 1 | -1;
}

export interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
}