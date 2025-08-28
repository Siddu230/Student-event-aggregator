export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  registeredEvents: string[];
  createdEvents: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}