import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { JwtResponse } from '../types/auth';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginState: (authData: JwtResponse) => void;
  logoutState: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved token and user on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Invalid saved data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const loginState = (authData: JwtResponse) => {
    const userData = { email: authData.email, role: authData.role };
    setUser(userData);
    setToken(authData.accessToken);
    localStorage.setItem('token', authData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loginState,
      logoutState,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
