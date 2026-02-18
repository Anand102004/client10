import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Mock Auth Context for Demo Purposes
type UserRole = 'admin' | 'student' | null;

interface AuthContextType {
  role: UserRole;
  login: (role: 'admin' | 'student') => void;
  logout: () => void;
  user: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  
  useEffect(() => {
    const storedRole = localStorage.getItem('study_hall_role') as UserRole;
    if (storedRole) setRole(storedRole);
  }, []);

  const login = (newRole: 'admin' | 'student') => {
    setRole(newRole);
    localStorage.setItem('study_hall_role', newRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('study_hall_role');
    window.location.href = '/login';
  };

  const user = role === 'admin' 
    ? { name: 'Admin User', email: 'admin@studyhall.com' }
    : role === 'student'
    ? { name: 'Alex Johnson', email: 'alex.j@example.com' }
    : null;

  return (
    <AuthContext.Provider value={{ role, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
