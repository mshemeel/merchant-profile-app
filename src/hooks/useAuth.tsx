import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyData } from '../utils/dummyData';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const authDataString = await AsyncStorage.getItem('authData');
        if (authDataString) {
          const authData = JSON.parse(authDataString);
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        // Add a small delay to ensure splash screen has time to fade out properly
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API request
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Check credentials against dummy data
        const user = dummyData.users.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          // Save user data to AsyncStorage
          const userData = { ...user, password: undefined }; // Don't store password
          await AsyncStorage.setItem('authData', JSON.stringify({ user: userData }));
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Add a slight delay before hiding the loading indicator
          // This ensures the navigation changes have time to take effect
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
          
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('authData');
      setUser(null);
      setIsAuthenticated(false);
      
      // Add a small delay to show loading when logging out
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error logging out:', error);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 