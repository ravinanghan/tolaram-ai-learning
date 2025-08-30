import React, { createContext, useContext, ReactNode } from 'react';
import type { User, AuthContextType } from '@/types/global';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import type { LoginData, RegisterData } from '@/firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Enhanced AuthContextType for Firebase
interface FirebaseAuthContextType extends AuthContextType {
  register: (data: RegisterData) => Promise<void>;
  error: string | null;
  clearError: () => void;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const firebaseAuth = useFirebaseAuth();

  // Wrapper for login to maintain compatibility with existing code
  const login = async (data?: LoginData): Promise<void> => {
    // If no data provided, use demo credentials for backward compatibility
    const loginData = data || {
      email: 'demo@tolaram.com',
      password: 'demo123'
    };
    
    return firebaseAuth.login(loginData);
  };

  const value: FirebaseAuthContextType = {
    user: firebaseAuth.user,
    login,
    logout: firebaseAuth.logout,
    isAuthenticated: firebaseAuth.isAuthenticated,
    isLoading: firebaseAuth.isLoading,
    register: firebaseAuth.register,
    error: firebaseAuth.error,
    clearError: firebaseAuth.clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};