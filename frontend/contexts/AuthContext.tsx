import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

interface AuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsSignedIn(true);
    }
    
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in - in production this would call your auth service
    const mockUser = {
      id: 'user_123',
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    };
    
    const mockToken = 'clerk_mock_token_' + Date.now();
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsSignedIn(true);
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    // Mock sign up - in production this would call your auth service
    const mockUser = {
      id: 'user_' + Date.now(),
      firstName,
      lastName,
      email,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    };
    
    const mockToken = 'clerk_mock_token_' + Date.now();
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsSignedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsSignedIn(false);
  };

  const getToken = async () => {
    return localStorage.getItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{
      isSignedIn,
      isLoaded,
      user,
      signIn,
      signUp,
      signOut,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
