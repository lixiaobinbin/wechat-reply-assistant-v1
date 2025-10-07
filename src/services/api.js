import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求失败:', error);
    if (error.response) {
      // 服务器返回错误状态码
      throw new Error(error.response.data?.detail || '服务器错误');
    } else if (error.request) {
      // 请求发送失败
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      throw new Error('请求配置错误');
    }
  }
);

/**
 * 分析聊天内容并生成回复建议
 * @param {Object} data - 分析请求数据
 * @param {Array} data.chat_history - 聊天历史
 * @param {string} data.reply_style - 回复风格
 * @param {string} data.context_info - 额外上下文信息
 * @returns {Promise<Object>} 分析结果
 */
export const analyzeChat = async (data) => {
  return await api.post('/analyze', data);
};

/**
 * 获取所有可用的回复风格
 * @returns {Promise<Object>} 回复风格列表
 */
export const getReplyStyles = async () => {
  return await api.get('/styles');
};

export default api;

