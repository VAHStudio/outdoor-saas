/**
 * 认证服务
 * 处理登录、登出、Token 管理等
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_info';

export interface User {
  id: number;
  username: string;
  realName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  realName?: string;
  email?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

/**
 * 用户登录
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(data.message || '登录失败');
  }

  // 保存到 localStorage
  localStorage.setItem(TOKEN_KEY, data.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));

  return data.data;
};

/**
 * 用户注册
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(data.message || '注册失败');
  }

  // 保存到 localStorage
  localStorage.setItem(TOKEN_KEY, data.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));

  return data.data;
};

/**
 * 用户登出
 */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
};

/**
 * 获取当前 Token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 获取用户角色
 */
export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * 检查是否有指定角色
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * 获取当前登录用户信息（从服务器）
 */
export const fetchCurrentUser = async (): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(data.message || '获取用户信息失败');
  }

  // 更新本地存储
  localStorage.setItem(USER_KEY, JSON.stringify(data.data));

  return data.data;
};

/**
 * 更新本地存储的用户信息
 */
export const updateUserInfo = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export default {
  login,
  register,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  hasRole,
  fetchCurrentUser,
  updateUserInfo,
};
