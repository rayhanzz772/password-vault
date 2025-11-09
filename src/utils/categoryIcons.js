import { 
  Briefcase, 
  Wallet, 
  Users,
  Grip,
  User,
  Gamepad2,
  Heart,
  Lock,
  LayoutGrid, 
  Lightbulb
} from 'lucide-react';

// Get icon component based on category name
export const getCategoryIcon = (categoryName) => {
  const normalizedCategory = categoryName?.toLowerCase() || '';
  
  const iconMap = {
    'work': Briefcase,
    'finance': Wallet,
    'social': Users,
    'medical': Heart,
    'ideas': Lightbulb,
    'personal': User,
    'game': Gamepad2,
    'other': Grip,
    'all': LayoutGrid,
  };
  
  return iconMap[normalizedCategory] || Lock; // Default to Lock if category not found
};

// Get gradient colors based on category
export const getCategoryGradient = (categoryName) => {
  const normalizedCategory = categoryName?.toLowerCase() || '';
  
  const gradientMap = {
    'work': 'from-blue-500 to-blue-600',
    'finance': 'from-green-500 to-emerald-600',
    'social': 'from-purple-500 to-pink-600',
    'game': 'from-orange-500 to-red-600',
    'all': 'from-primary-500 to-purple-600',
  };
  
  return gradientMap[normalizedCategory] || 'from-primary-500 to-purple-600'; // Default gradient
};
