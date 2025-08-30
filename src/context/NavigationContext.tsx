import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  navigate: (path: string) => void;
  currentPath: string;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  navigate: (path: string) => void;
  currentPath: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  navigate, 
  currentPath 
}) => {
  return (
    <NavigationContext.Provider value={{ navigate, currentPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;