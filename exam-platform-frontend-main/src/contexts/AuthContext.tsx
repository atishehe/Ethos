import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface User {
  userId: string;
  name: string;
  collegeName: string;
  score?: number;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string, collegeName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
  validateStoredAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore user on refresh from localStorage with validation
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          
          // Validate stored token with backend
          const isValid = await validateStoredAuth();
          
          if (isValid) {
            setUser(parsedUser);
            console.log('Restored authenticated session');
          } else {
            // Clear invalid stored data
            localStorage.removeItem('authUser');
            localStorage.removeItem('token');
            console.log('Stored session expired, cleared');
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth", error);
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const allowedColleges = ["IIT Guwahati"];

  const validateStoredAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Validate token with backend
      const response = await axios.get(`${API_BASE_URL}/api/users/validate`);
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  const login = async (userId: string, password: string, collegeName: string): Promise<boolean> => {
    // Check if collegeName is in the allowed colleges list
    if (!allowedColleges.includes(collegeName)) {
      toast({
        title: "Access Denied",
        description: `Sorry,Please contact the event organizer for access.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Show immediate feedback
      toast({
        title: "Authenticating...",
        description: "Verifying your credentials",
      });

      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username: userId,
        password,
        collegeName,
      });

      if (response.data.token) {
        const { token, username } = response.data;

        const loggedInUser: User = {
          userId: username,
          name: username,
          collegeName,
        };

        setUser(loggedInUser);
        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(loggedInUser));
        
        // Set token in axios headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast({
          title: "Login Successful",
          description: `Welcome back, ${username} from ${collegeName}!`,
        });

        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid user ID or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isInitializing,
      validateStoredAuth
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
