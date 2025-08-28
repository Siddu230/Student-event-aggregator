import { Book, Users, Trophy, Star, Briefcase } from 'lucide-react';
import { EventCategory } from '../types/Event';

export const getCategoryColor = (category: EventCategory) => {
  const colors = {
    academic: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    social: {
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      border: 'border-pink-200'
    },
    sports: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    clubs: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200'
    },
    career: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200'
    }
  };
  
  return colors[category];
};

export const getCategoryIcon = (category: EventCategory) => {
  const icons = {
    academic: Book,
    social: Users,
    sports: Trophy,
    clubs: Star,
    career: Briefcase
  };
  
  return icons[category];
};