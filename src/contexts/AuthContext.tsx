
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, UserRole, AuthContextType } from './auth/types';
import { authService } from './auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for stored user on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded stored user:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    console.log('AuthContext.login called with:', email);
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      console.log('AuthContext.login successful, user:', user);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Logged in successfully!');
      
      // Redirect based on user role
      if (user.role === 'business') {
        console.log('Redirecting business user to /business/home');
        navigate('/business/home');
      } else {
        console.log('Redirecting runner user to /user-home');
        navigate('/user-home');
      }
    } catch (error) {
      console.error('AuthContext.login error:', error);
      if (error instanceof Error && error.message.includes('verify your email')) {
        toast.error(error.message);
        navigate('/verify-email', { state: { email } });
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and other details
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    businessDetails?: {
      businessName: string;
      businessLocation: string;
      businessPhone?: string;
      latitude?: number;
      longitude?: number;
    }
  ) => {
    console.log('AuthContext.signup called with:', { name, email, role, businessDetails });
    setIsLoading(true);
    try {
      console.log('Calling authService.signup...');
      const result = await authService.signup(name, email, password, role, businessDetails);
      console.log('AuthContext.signup successful, result:', result);
      
      if (result.requiresVerification) {
        console.log('Email verification required, redirecting...');
        toast.success('Account created! Please check your email to verify your account.');
        navigate('/verify-email', { state: { email: result.email } });
      }
      
      console.log('=== SIGNUP FORM SUBMISSION COMPLETED ===');
    } catch (error) {
      console.error('AuthContext.signup error:', error);
      if (error instanceof Error) {
        toast.error(`Registration failed: ${error.message}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user state (for profile updates)
  const handleSetUser = (updatedUser: User) => {
    console.log('AuthContext.setUser called with:', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Logout
  const logout = () => {
    console.log('AuthContext.logout called');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('xanoAuthToken');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    setUser: handleSetUser
  };

  console.log('AuthProvider rendering with context value:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    isLoading
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth called outside of AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-export types for easy access
export type { User, UserRole, AuthContextType };
