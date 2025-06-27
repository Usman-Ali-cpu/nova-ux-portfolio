
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'runner' | 'business';
  profileImageUrl?: string;
  runnerDetails?: RunnerDetails;
  businessDetails?: BusinessDetails;
  is_active?: boolean;
}

export interface RunnerDetails {
  pace?: number;
  experience?: string;
  goals?: string;
}

export interface BusinessDetails {
  businessName?: string;
  businessLocation?: string;
  businessPhone?: string;
  description?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
}
