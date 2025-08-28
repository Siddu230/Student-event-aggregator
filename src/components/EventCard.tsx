import React from 'react';
import { Calendar, Clock, MapPin, Users, Star, Heart } from 'lucide-react';
import { Event } from '../types/Event';
import { formatDate, formatTime } from '../utils/dateUtils';
import { getCategoryColor, getCategoryIcon } from '../utils/categoryUtils';

interface EventCardProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: (eventId: string) => void;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isFavorite, onToggleFavorite, onClick }) => {
  const categoryColor = getCategoryColor(event.category);
  const CategoryIcon = getCategoryIcon(event.category);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(event.id);
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 ${categoryColor.bg} ${categoryColor.text} px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20`}>
          <div className="flex items-center space-x-1">
            <CategoryIcon className="h-4 w-4" />
            <span>{event.category}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">{formatDate(event.date)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatTime(event.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">{event.attendees} attending</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {event.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{event.tags.length - 2} more</span>
            )}
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.price === 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;