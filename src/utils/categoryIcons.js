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
  Lightbulb,
} from "lucide-react";

// Get icon component based on category name
export const getCategoryIcon = (categoryName) => {
  const normalizedCategory = categoryName?.toLowerCase() || "";

  const iconMap = {
    work: Briefcase,
    finance: Wallet,
    social: Users,
    medical: Heart,
    ideas: Lightbulb,
    personal: User,
    game: Gamepad2,
    other: Grip,
    all: LayoutGrid,
  };

  return iconMap[normalizedCategory] || Lock; // Default to Lock if category not found
};

// Get gradient colors based on category
export const getCategoryGradient = (category) => {
  // Allow passing a category object (e.g. { name, gradient }) or a string
  if (!category) return "from-primary-500 to-purple-600";

  if (typeof category === "object") {
    if (category.gradient) return category.gradient;
    if (category.color) return category.color; // assume it's a valid Tailwind class string or gradient
    category = category.name || category.label || "";
  }

  const normalizedCategory = category?.toLowerCase() || "";

  const gradientMap = {
    work: "from-blue-500 to-blue-600",
    finance: "from-green-500 to-emerald-600",
    social: "from-purple-500 to-pink-600",
    game: "from-orange-500 to-red-600",
    medical: "from-rose-400 to-rose-600",
    health: "from-rose-400 to-rose-600",
    personal: "from-indigo-400 to-indigo-600",
    other: "from-slate-400 to-slate-600",
    ideas: "from-primary-500 to-purple-600",
  };

  return gradientMap[normalizedCategory] || "from-primary-500 to-purple-600"; // Default gradient
};
