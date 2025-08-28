// To deploy this project to Netlify:
// 1. Push your code to a GitHub repository.
// 2. Go to https://app.netlify.com and click "Add new site" > "Import an existing project".
// 3. Connect your GitHub repository and select this project.
// 4. Set the build command to: npm run build
// 5. Set the publish directory to: build
// 6. Click "Deploy site".
// Your React app will be live on Netlify.

// To run this project:
// 1. Install dependencies: npm install
// 2. Start the development server: npm start
// The app will be available at http://localhost:3000

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, MapPin, Clock, Users, Star, Filter, X } from 'lucide-react';
import Header from './components/Header';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import FilterPanel from './components/FilterPanel';
import AuthModal from './components/AuthModal';
import CreateEventModal from './components/CreateEventModal';
import MyEventsPage from './components/MyEventsPage';
import SuccessModal from './components/SuccessModal';
import { useAuth } from './contexts/AuthContext';
import { Event, EventCategory } from './types/Event';
import { sampleEvents } from './data/sampleEvents';

function App() {
  const { user, isAuthenticated, registerForEvent, sendRegistrationEmail } = useAuth();
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });
  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteEvents', JSON.stringify(favorites));
  }, [favorites]);

  // Load user events
  useEffect(() => {
    const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
    setEvents([...sampleEvents, ...userEvents]);
  }, []);

  const toggleFavorite = (eventId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleRegisterForEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      // Send email notification
      sendRegistrationEmail(event.title, event.date, event.location);
    }
    
    registerForEvent(eventId);
    setSuccessModal({
      isOpen: true,
      title: 'Registration Successful!',
      message: 'You have successfully registered for this event. A confirmation email has been sent to the administrator.',
    });
  };

  const handleEventCreated = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent]);
    setSuccessModal({
      isOpen: true,
      title: 'Event Created!',
      message: 'Your event has been successfully created and is now live for other students to discover.',
    });
  };

  const handleCreateEventClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowCreateEventModal(true);
  };

  const handleMyEventsClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowMyEvents(true);
  };

  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return b.attendees - a.attendees;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCategory, sortBy]);

  if (showMyEvents) {
    return <MyEventsPage onClose={() => setShowMyEvents(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onShowAuth={() => setShowAuthModal(true)}
        onShowMyEvents={handleMyEventsClick}
        onShowCreateEvent={handleCreateEventClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredEvents.length}</p>
                  <p className="text-gray-600">Events Found</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-emerald-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredEvents.reduce((sum, event) => sum + event.attendees, 0)}
                  </p>
                  <p className="text-gray-600">Total Attendees</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                  <p className="text-gray-600">Favorites</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterPanel
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isFavorite={favorites.includes(event.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isFavorite={favorites.includes(selectedEvent.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegisterForEvent}
          onShowAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onEventCreated={handleEventCreated}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
}

export default App;