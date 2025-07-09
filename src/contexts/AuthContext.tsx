import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/pickup';

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string, userType: 'customer' | 'partner') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app start
    const checkStoredAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error checking stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (phone: string, otp: string, userType: 'customer' | 'partner'): Promise<boolean> => {
    // Mock OTP validation - accept 123456 as valid OTP
    if (otp === '123456') {
      const user: User = {
        id: `${userType}_${Date.now()}`,
        phone,
        name: userType === 'customer' ? 'Customer User' : 'Partner User',
        type: userType,
      };

      setAuthState({
        user,
        isAuthenticated: true,
      });

      // Store auth data
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};