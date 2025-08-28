import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/User';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  addCreatedEvent: (eventId: string) => void;
  sendRegistrationEmail: (eventTitle: string, eventDate: string, eventLocation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
        });
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        registeredEvents: [],
        createdEvents: [],
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would use Google OAuth SDK
      // For demo purposes, we'll create a mock Google user
      const mockGoogleUser = {
        id: 'google_' + Date.now().toString(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        registeredEvents: [],
        createdEvents: [],
      };
      
      setAuthState({
        user: mockGoogleUser,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('currentUser');
  };

  const registerForEvent = (eventId: string) => {
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        registeredEvents: [...authState.user.registeredEvents, eventId],
      };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === authState.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], registeredEvents: updatedUser.registeredEvents };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const unregisterFromEvent = (eventId: string) => {
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        registeredEvents: authState.user.registeredEvents.filter(id => id !== eventId),
      };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === authState.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], registeredEvents: updatedUser.registeredEvents };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const addCreatedEvent = (eventId: string) => {
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        createdEvents: [...authState.user.createdEvents, eventId],
      };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === authState.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], createdEvents: updatedUser.createdEvents };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const sendRegistrationEmail = async (eventTitle: string, eventDate: string, eventLocation: string): Promise<void> => {
    try {
      if (!authState.user) return;
      
      const emailData = {
        userEmail: authState.user.email,
        userName: authState.user.name,
        eventTitle,
        eventDate,
        eventLocation,
      };

      console.log('Sending registration email with data:', emailData);
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      const result = await response.json();
      console.log('Email API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw the error to avoid breaking the registration flow
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    logout,
    registerForEvent,
    unregisterFromEvent,
    addCreatedEvent,
    sendRegistrationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};