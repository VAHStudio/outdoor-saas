import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';
import type { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, realName?: string, email?: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从 localStorage 加载用户信息
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * 用户登录
   */
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 用户注册
   */
  const register = async (
    username: string,
    password: string,
    realName?: string,
    email?: string,
    phone?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        username,
        password,
        realName,
        email,
        phone,
      });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 用户登出
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * 刷新用户信息
   */
  const refreshUser = async () => {
    try {
      const refreshedUser = await authService.fetchCurrentUser();
      setUser(refreshedUser);
    } catch (error) {
      console.error('刷新用户信息失败:', error);
      // 如果获取失败，可能是 token 过期，执行登出
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 使用认证上下文的 Hook
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
