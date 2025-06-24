
// Define types for our authentication
export type UserRole = 'runner' | 'business';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean; // New field for email verification status
  businessDetails?: {
    businessName: string;
    businessLocation: string;
    businessPhone?: string;
  };
  // Removed unreadMessages as we no longer have messaging functionality
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    businessDetails?: {
      businessName: string;
      businessLocation: string;
      businessPhone?: string;
    }
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}
