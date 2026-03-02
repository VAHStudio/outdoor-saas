/**
 * API 配置
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 基础请求函数
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

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

export { API_BASE_URL, request };
export default request;
