
'use client';

import React, { createContext, useState, useContext, ReactNode, FC } from 'react';

type UserType = 'passenger' | 'rider' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);

  const login = (type: UserType) => {
    setIsAuthenticated(true);
    setUserType(type);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('userTrips');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
