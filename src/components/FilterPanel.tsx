import React from 'react';
import { X, Filter, Calendar, TrendingUp } from 'lucide-react';
import { EventCategory } from '../types/Event';
import { getCategoryColor, getCategoryIcon } from '../utils/categoryUtils';

interface FilterPanelProps {
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
  sortBy: 'date' | 'popularity';
  onSortChange: (sort: 'date' | 'popularity') => void;
  onClose: () => void;
}

const categories: (EventCategory | 'all')[] = [
  'all', 'academic', 'social', 'sports', 'clubs', 'career'
];

const categoryLabels: Record<EventCategory | 'all', string> = {
  all: 'All Events',
  academic: 'Academic',
  social: 'Social',
  sports: 'Sports',
  clubs: 'Clubs',
  career: 'Career'
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClose
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryColor = category !== 'all' ? getCategoryColor(category as EventCategory) : null;
            const CategoryIcon = category !== 'all' ? getCategoryIcon(category as EventCategory) : Filter;
            
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? category === 'all' 
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : `${categoryColor?.bg} ${categoryColor?.text} border ${categoryColor?.border || 'border-transparent'}`
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <CategoryIcon className="h-5 w-5" />
                <span className="font-medium">{categoryLabels[category]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSortChange('date')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
              sortBy === 'date'
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Date</span>
          </button>
          
          <button
            onClick={() => onSortChange('popularity')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
              sortBy === 'popularity'
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Popularity</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;