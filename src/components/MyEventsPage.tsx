import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Event } from '../types/Event';
import { sampleEvents } from '../data/sampleEvents';
import { formatDate, formatTime } from '../utils/dateUtils';
import { getCategoryColor, getCategoryIcon } from '../utils/categoryUtils';

interface MyEventsPageProps {
  onClose: () => void;
}

const MyEventsPage: React.FC<MyEventsPageProps> = ({ onClose }) => {
  const { user, unregisterFromEvent } = useAuth();
  const [activeTab, setActiveTab] = useState<'registered' | 'created'>('registered');
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      // Get registered events
      const registered = sampleEvents.filter(event => 
        user.registeredEvents.includes(event.id)
      );
      setRegisteredEvents(registered);

      // Get created events from localStorage
      const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
      const created = userEvents.filter((event: Event) => 
        user.createdEvents.includes(event.id)
      );
      setCreatedEvents(created);
    }
  }, [user]);

  const handleUnregister = (eventId: string) => {
    unregisterFromEvent(eventId);
    setRegisteredEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const EventCard: React.FC<{ event: Event; showActions: boolean }> = ({ event, showActions }) => {
    const categoryColor = getCategoryColor(event.category);
    const CategoryIcon = getCategoryIcon(event.category);

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className={`absolute top-3 left-3 ${categoryColor.bg} ${categoryColor.text} px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20`}>
            <div className="flex items-center space-x-1">
              <CategoryIcon className="h-4 w-4" />
              <span>{event.category}</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900">{formatDate(event.date)}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

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

          {showActions && (
            <div className="flex justify-end space-x-2">
              {activeTab === 'registered' ? (
                <button
                  onClick={() => handleUnregister(event.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Unregister</span>
                </button>
              ) : (
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
              <p className="text-gray-600">Manage your registered and created events</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/80 backdrop-blur-sm border border-white/20 text-gray-700 rounded-xl hover:bg-white transition-colors duration-200"
            >
              Back to Events
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 inline-flex">
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'registered'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Registered Events ({registeredEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'created'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Created Events ({createdEvents.length})
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === 'registered' ? (
            registeredEvents.length > 0 ? (
              registeredEvents.map((event) => (
                <EventCard key={event.id} event={event} showActions={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No registered events</h3>
                <p className="text-gray-600">You haven't registered for any events yet</p>
              </div>
            )
          ) : (
            createdEvents.length > 0 ? (
              createdEvents.map((event) => (
                <EventCard key={event.id} event={event} showActions={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No created events</h3>
                <p className="text-gray-600">You haven't created any events yet</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;