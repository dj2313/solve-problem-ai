import { Category, Problem, Answer, User } from '../types';
import { storage, categoryService, problemService, answerService, userService } from './storage';

const STORAGE_KEYS = {
  CATEGORIES: 'problemSolver_categories',
  PROBLEMS: 'problemSolver_problems',
  ANSWERS: 'problemSolver_answers',
  USERS: 'problemSolver_users',
};

const mockCategories: Category[] = [
  {
    id: 'cleaning',
    name: 'Cleaning & Maintenance',
    description: 'Home cleaning tips, stain removal, and maintenance solutions',
    icon: 'Sparkles',
    color: 'bg-blue-500',
    problemCount: 0
  },
  {
    id: 'cooking',
    name: 'Cooking & Kitchen',
    description: 'Recipe fixes, cooking techniques, and kitchen problems',
    icon: 'ChefHat',
    color: 'bg-orange-500',
    problemCount: 0
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Computer issues, software problems, and tech troubleshooting',
    icon: 'Laptop',
    color: 'bg-purple-500',
    problemCount: 0
  },
  {
    id: 'home',
    name: 'Home Improvement',
    description: 'DIY projects, repairs, and home maintenance solutions',
    icon: 'Home',
    color: 'bg-green-500',
    problemCount: 0
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car maintenance, troubleshooting, and repair solutions',
    icon: 'Car',
    color: 'bg-red-500',
    problemCount: 0
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Health tips, wellness advice, and lifestyle solutions',
    icon: 'Heart',
    color: 'bg-pink-500',
    problemCount: 0
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'ProblemSolver',
    email: 'solver@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-01-15',
    reputation: 1250,
    problemsSolved: 45
  },
  {
    id: '2',
    username: 'TechGuru',
    email: 'tech@example.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-02-20',
    reputation: 890,
    problemsSolved: 32
  },
  {
    id: '3',
    username: 'HomeMaster',
    email: 'home@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinDate: '2024-01-10',
    reputation: 2100,
    problemsSolved: 78
  }
];

const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'How to remove coffee stains from white shirts',
    description: 'I spilled coffee on my favorite white dress shirt this morning. The stain is pretty fresh but it\'s already setting in. What\'s the best way to remove it without damaging the fabric?',
    category: 'cleaning',
    tags: ['stains', 'laundry', 'coffee', 'white clothes'],
    authorId: '2',
    authorName: 'TechGuru',
    createdAt: '2024-12-15T08:30:00Z',
    updatedAt: '2024-12-15T08:30:00Z',
    status: 'solved',
    views: 234,
    votes: 15,
    image: 'https://images.pexels.com/photos/6069108/pexels-photo-6069108.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    title: 'My laptop keeps overheating during video calls',
    description: 'Recently my laptop has been getting very hot during Zoom meetings. The fan runs constantly and sometimes the screen freezes. It\'s a 2-year-old MacBook Pro. What could be causing this?',
    category: 'tech',
    tags: ['laptop', 'overheating', 'video calls', 'macbook'],
    authorId: '1',
    authorName: 'ProblemSolver',
    createdAt: '2024-12-14T14:22:00Z',
    updatedAt: '2024-12-14T14:22:00Z',
    status: 'open',
    views: 189,
    votes: 8
  },
  {
    id: '3',
    title: 'Kitchen sink drain is clogged - DIY solutions?',
    description: 'My kitchen sink is draining very slowly. I think it might be grease buildup from washing dishes. Are there any effective DIY methods to clear it before calling a plumber?',
    category: 'home',
    tags: ['plumbing', 'sink', 'clog', 'diy'],
    authorId: '3',
    authorName: 'HomeMaster',
    createdAt: '2024-12-13T19:45:00Z',
    updatedAt: '2024-12-13T19:45:00Z',
    status: 'open',
    views: 156,
    votes: 12
  },
  {
    id: '4',
    title: 'Best way to meal prep chicken for the week',
    description: 'I want to start meal prepping to save time during the week. What\'s the best way to cook and store chicken so it stays fresh and tasty for 4-5 days?',
    category: 'cooking',
    tags: ['meal prep', 'chicken', 'food storage', 'weekly planning'],
    authorId: '2',
    authorName: 'TechGuru',
    createdAt: '2024-12-12T11:15:00Z',
    updatedAt: '2024-12-12T11:15:00Z',
    status: 'solved',
    views: 312,
    votes: 22
  },
  {
    id: '5',
    title: 'Car makes grinding noise when braking',
    description: 'My car has started making a grinding sound when I brake, especially when coming to a complete stop. It\'s more noticeable in the morning. Is this something urgent?',
    category: 'automotive',
    tags: ['brakes', 'grinding noise', 'car maintenance', 'safety'],
    authorId: '1',
    authorName: 'ProblemSolver',
    createdAt: '2024-12-11T16:30:00Z',
    updatedAt: '2024-12-11T16:30:00Z',
    status: 'open',
    views: 178,
    votes: 6
  }
];

const mockAnswers: Answer[] = [
  {
    id: '1',
    problemId: '1',
    content: 'For fresh coffee stains on white shirts, act quickly! Here\'s what works best:',
    authorId: '3',
    authorName: 'HomeMaster',
    createdAt: '2024-12-15T09:15:00Z',
    votes: 18,
    isAccepted: true,
    isAI: false,
    helpfulRating: 95,
    steps: [
      'Blot (don\'t rub) the stain immediately with a clean cloth',
      'Rinse the back of the stain with cold water',
      'Apply liquid laundry detergent directly to the stain',
      'Let it sit for 5 minutes, then rinse with cold water',
      'If stain persists, mix equal parts white vinegar and water',
      'Soak the stained area for 30 minutes',
      'Wash in the hottest water safe for the fabric',
      'Air dry and check - heat from dryer can set remaining stains'
    ]
  },
  {
    id: '2',
    problemId: '1',
    content: 'I\'ve found that a paste made from baking soda and cold water works really well too. Apply it to the stain, let it sit for an hour, then wash as normal. The key is treating it while it\'s still wet!',
    authorId: '1',
    authorName: 'ProblemSolver',
    createdAt: '2024-12-15T10:30:00Z',
    votes: 9,
    isAccepted: false,
    isAI: false,
    helpfulRating: 87
  },
  {
    id: '3',
    problemId: '2',
    content: 'Laptop overheating during video calls is usually due to high CPU usage and dust buildup. Here\'s a systematic approach to fix it:',
    authorId: 'ai',
    authorName: 'AI Assistant',
    createdAt: '2024-12-14T14:45:00Z',
    votes: 12,
    isAccepted: false,
    isAI: true,
    helpfulRating: 92,
    steps: [
      'Check Activity Monitor for high CPU usage processes',
      'Close unnecessary applications and browser tabs',
      'Clean your laptop vents with compressed air',
      'Use a laptop cooling pad for better airflow',
      'Reset SMC (System Management Controller) on MacBook',
      'Update macOS and check for software updates',
      'Consider professional cleaning if problem persists'
    ]
  },
  {
    id: '4',
    problemId: '4',
    content: 'Great question! I meal prep chicken every Sunday. Here\'s my proven method:',
    authorId: '3',
    authorName: 'HomeMaster',
    createdAt: '2024-12-12T12:00:00Z',
    votes: 25,
    isAccepted: true,
    isAI: false,
    helpfulRating: 96,
    steps: [
      'Buy boneless, skinless chicken breasts or thighs',
      'Season with salt, pepper, and your favorite herbs',
      'Bake at 375°F for 20-25 minutes (internal temp 165°F)',
      'Let cool completely before storing',
      'Slice or shred based on planned meals',
      'Store in airtight containers in refrigerator',
      'Use within 4-5 days for best quality',
      'Reheat gently to avoid drying out'
    ]
  }
];

export const initializeMockData = (): void => {
  // Initialize categories
  if (!storage.get(STORAGE_KEYS.CATEGORIES)) {
    storage.set(STORAGE_KEYS.CATEGORIES, mockCategories);
  }

  // Initialize users
  if (!storage.get(STORAGE_KEYS.USERS)) {
    storage.set(STORAGE_KEYS.USERS, mockUsers);
  }

  // Initialize problems
  if (!storage.get(STORAGE_KEYS.PROBLEMS)) {
    storage.set(STORAGE_KEYS.PROBLEMS, mockProblems);
  }

  // Initialize answers
  if (!storage.get(STORAGE_KEYS.ANSWERS)) {
    storage.set(STORAGE_KEYS.ANSWERS, mockAnswers);
  }

  // Update category problem counts
  categoryService.updateProblemCounts();

  // Set a default current user if none exists
  if (!userService.getCurrentUser()) {
    userService.setCurrentUser(mockUsers[0]);
  }
};