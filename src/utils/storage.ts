import { User, Problem, Answer, Comment, Category, UserVote } from '../types';

const STORAGE_KEYS = {
  USERS: 'problemSolver_users',
  CURRENT_USER: 'problemSolver_currentUser',
  PROBLEMS: 'problemSolver_problems',
  ANSWERS: 'problemSolver_answers',
  COMMENTS: 'problemSolver_comments',
  CATEGORIES: 'problemSolver_categories',
  USER_VOTES: 'problemSolver_userVotes',
};

// Storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

// User management
export const userService = {
  getCurrentUser: (): User | null => storage.get<User>(STORAGE_KEYS.CURRENT_USER),
  
  setCurrentUser: (user: User): void => {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    storage.set(STORAGE_KEYS.USERS, users);
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },

  getUserById: (id: string): User | null => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS) || [];
    return users.find(u => u.id === id) || null;
  }
};

// Problem management
export const problemService = {
  getAll: (): Problem[] => storage.get<Problem[]>(STORAGE_KEYS.PROBLEMS) || [],
  
  getById: (id: string): Problem | null => {
    const problems = problemService.getAll();
    return problems.find(p => p.id === id) || null;
  },

  create: (problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'views'>): Problem => {
    const problems = problemService.getAll();
    const newProblem: Problem = {
      ...problem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0,
      views: 0
    };
    problems.unshift(newProblem);
    storage.set(STORAGE_KEYS.PROBLEMS, problems);
    return newProblem;
  },

  update: (id: string, updates: Partial<Problem>): void => {
    const problems = problemService.getAll();
    const index = problems.findIndex(p => p.id === id);
    if (index >= 0) {
      problems[index] = { ...problems[index], ...updates, updatedAt: new Date().toISOString() };
      storage.set(STORAGE_KEYS.PROBLEMS, problems);
    }
  },

  incrementViews: (id: string): void => {
    const problem = problemService.getById(id);
    if (problem) {
      problemService.update(id, { views: problem.views + 1 });
    }
  }
};

// Answer management
export const answerService = {
  getAll: (): Answer[] => storage.get<Answer[]>(STORAGE_KEYS.ANSWERS) || [],
  
  getByProblemId: (problemId: string): Answer[] => {
    const answers = answerService.getAll();
    return answers.filter(a => a.problemId === problemId);
  },

  create: (answer: Omit<Answer, 'id' | 'createdAt' | 'votes' | 'isAccepted' | 'helpfulRating'>): Answer => {
    const answers = answerService.getAll();
    const newAnswer: Answer = {
      ...answer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      votes: 0,
      isAccepted: false,
      helpfulRating: 0
    };
    answers.unshift(newAnswer);
    storage.set(STORAGE_KEYS.ANSWERS, answers);
    return newAnswer;
  },

  update: (id: string, updates: Partial<Answer>): void => {
    const answers = answerService.getAll();
    const index = answers.findIndex(a => a.id === id);
    if (index >= 0) {
      answers[index] = { ...answers[index], ...updates };
      storage.set(STORAGE_KEYS.ANSWERS, answers);
    }
  }
};

// Category management
export const categoryService = {
  getAll: (): Category[] => storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || [],
  
  updateProblemCounts: (): void => {
    const categories = categoryService.getAll();
    const problems = problemService.getAll();
    
    categories.forEach(category => {
      category.problemCount = problems.filter(p => p.category === category.id).length;
    });
    
    storage.set(STORAGE_KEYS.CATEGORIES, categories);
  }
};

// Vote management
export const voteService = {
  getAll: (): UserVote[] => storage.get<UserVote[]>(STORAGE_KEYS.USER_VOTES) || [],
  
  getUserVote: (userId: string, targetId: string, type: 'problem' | 'answer'): UserVote | null => {
    const votes = voteService.getAll();
    return votes.find(v => v.userId === userId && v.targetId === targetId && v.type === type) || null;
  },

  vote: (userId: string, targetId: string, type: 'problem' | 'answer', value: 1 | -1): void => {
    const votes = voteService.getAll();
    const existingVote = voteService.getUserVote(userId, targetId, type);
    
    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote if clicking the same button
        const index = votes.findIndex(v => v.id === existingVote.id);
        votes.splice(index, 1);
        value = 0 as any;
      } else {
        // Update vote
        existingVote.value = value;
      }
    } else {
      // Create new vote
      votes.push({
        id: Date.now().toString(),
        userId,
        targetId,
        type,
        value
      });
    }
    
    storage.set(STORAGE_KEYS.USER_VOTES, votes);
    
    // Update vote count
    if (type === 'problem') {
      const problem = problemService.getById(targetId);
      if (problem) {
        const newVotes = votes.filter(v => v.targetId === targetId && v.type === 'problem')
          .reduce((sum, v) => sum + v.value, 0);
        problemService.update(targetId, { votes: newVotes });
      }
    } else {
      const answers = answerService.getAll();
      const answer = answers.find(a => a.id === targetId);
      if (answer) {
        const newVotes = votes.filter(v => v.targetId === targetId && v.type === 'answer')
          .reduce((sum, v) => sum + v.value, 0);
        answerService.update(targetId, { votes: newVotes });
      }
    }
  }
};