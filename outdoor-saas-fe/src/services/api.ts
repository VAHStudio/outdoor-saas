/**
 * API 配置
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 获取存储的 Token
 */
const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * 基础请求函数
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  // 获取当前 token
  const token = getToken();

  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  // 如果有 token，添加到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // 处理 401 未授权错误
  if (response.status === 401) {
    // Token 过期或无效，清除本地存储并跳转到登录页
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || '请求失败');
  }

  return data.data;
}

/**
 * 上传文件请求（不设置 Content-Type，让浏览器自动设置）
 */
async function uploadRequest<T>(url: string, formData: FormData): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    window.location.href = '/login';
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '上传失败' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error(data.message || '上传失败');
  }

  return data.data;
}

export { API_BASE_URL, request, uploadRequest, getToken };
export default request;
