import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Heart, Share, ExternalLink } from 'lucide-react';
import { Event } from '../types/Event';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatTime } from '../utils/dateUtils';
import { getCategoryColor, getCategoryIcon } from '../utils/categoryUtils';

interface EventModalProps {
  event: Event;
  isFavorite: boolean;
  onToggleFavorite: (eventId: string) => void;
  onClose: () => void;
  onRegister: (eventId: string) => void;
  onShowAuth: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  isFavorite, 
  onToggleFavorite, 
  onClose, 
  onRegister, 
  onShowAuth 
}) => {
  const { user, isAuthenticated } = useAuth();
  const categoryColor = getCategoryColor(event.category);
  const CategoryIcon = getCategoryIcon(event.category);

  const isRegistered = user?.registeredEvents.includes(event.id) || false;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }
    onRegister(event.id);
  };
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header Image */}
          <div className="relative h-64 sm:h-80">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>

            {/* Category Badge */}
            <div className={`absolute top-4 left-4 ${categoryColor.bg} ${categoryColor.text} px-4 py-2 rounded-full font-medium backdrop-blur-sm border border-white/20`}>
              <div className="flex items-center space-x-2">
                <CategoryIcon className="h-5 w-5" />
                <span>{event.category}</span>
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.title}</h1>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm border border-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h2>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                        <p className="text-gray-600">Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">{formatTime(event.date)}</p>
                        <p className="text-gray-600">Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">{event.location}</p>
                        <p className="text-gray-600">Location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">{event.attendees} people</p>
                        <p className="text-gray-600">Attending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="text-center mb-4">
                    <p className="text-lg opacity-90">Ticket Price</p>
                    <p className="text-4xl font-bold">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </p>
                  </div>
                  <button 
                    onClick={handleRegisterClick}
                    disabled={isRegistered}
                    className={`w-full font-semibold py-3 rounded-xl transition-colors duration-200 ${
                      isRegistered
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-white text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    {isRegistered ? 'Already Registered' : 'Register Now'}
                  </button>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onToggleFavorite(event.id)}
                    disabled={!isAuthenticated}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isFavorite
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : `bg-gray-100 text-gray-700 hover:bg-gray-200 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{!isAuthenticated ? 'Sign in to Save' : (isFavorite ? 'Saved' : 'Save')}</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors duration-200">
                    <Share className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Additional Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">External Event</p>
                      <p className="text-sm text-amber-700">This event is hosted externally. You'll be redirected to register.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;