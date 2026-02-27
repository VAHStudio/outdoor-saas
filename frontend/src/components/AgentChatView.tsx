/**
 * Agent Chat View - 增强版 AI 对话界面，支持智能创建方案
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MoreVertical,
  Mic,
  Send,
  Plus,
  Bot,
  CheckCircle,
  MapPin,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react';
import { 
  sendAgentMessage, 
  AgentChatResponse, 
  AgentResponseType,
  Action 
} from '../services/agentService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  type: string;
  content: string;
  data?: any;
  actions?: Action[];
  timestamp: Date;
}

interface AgentChatViewProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

// 根据agent类型获取欢迎消息
const getWelcomeMessage = (agentType: string): string => {
  const messages: Record<string, string> = {
    '销售AI助理': '您好！我是销售AI助理。我可以帮您创建广告方案、管理客户、分析投放效果等。\n\n例如您可以对我说：\n• "帮我建个可口可乐的3月份广告方案"\n• "查询南京有哪些可用社区"',
    '媒介AI助理': '您好！我是媒介AI助理。我可以帮您管理点位资源、查询库存、优化资源配置等。\n\n例如您可以对我说：\n• "查询玄武区有哪些空闲点位"\n• "帮我安排10个道闸广告位"',
    '工程AI助理': '您好！我是工程AI助理。我可以帮您管理工程任务、安排维护、验收设备等。\n\n例如您可以对我说：\n• "安排明天去检修设备"\n• "查询最近的维护计划"',
    '财务AI助理': '您好！我是财务AI助理。我可以帮您管理预算、处理发票、分析成本等。\n\n例如您可以对我说：\n• "查询本月预算使用情况"\n• "帮我审批几张发票"',
  };
  return messages[agentType] || messages['销售AI助理'];
};

export const AgentChatView = ({ onBack, onNavigate }: AgentChatViewProps) => {
  const [selectedAgent, setSelectedAgent] = useState('销售AI助理');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('intent');
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 组件挂载时初始化
  useEffect(() => {
    if (isInitialized) return;
    
    const storedAgent = localStorage.getItem('selectedAgent') || '销售AI助理';
    const initialQuestion = localStorage.getItem('userQuestion');
    
    setSelectedAgent(storedAgent);
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        type: AgentResponseType.TEXT,
        content: getWelcomeMessage(storedAgent),
        timestamp: new Date(),
      },
    ]);
    
    setIsInitialized(true);
    
    // 如果有初始问题，自动发送
    if (initialQuestion) {
      // 立即清除localStorage
      localStorage.removeItem('userQuestion');
      localStorage.removeItem('selectedAgent');
      
      // 延迟发送
      setTimeout(() => {
        const textToSend = initialQuestion;
        if (!textToSend.trim()) return;
        
        const userMessage: Message = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'user',
          type: 'text',
          content: textToSend,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        
        sendAgentMessage({
          message: textToSend,
          sessionId: '',
        }).then(response => {
          if (response.sessionId) {
            setSessionId(response.sessionId);
          }
          if (response.step) {
            setCurrentStep(response.step);
          }

          const aiMessage: Message = {
            id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: 'ai',
            type: response.type,
            content: response.message,
            data: response.data,
            actions: response.actions,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
        }).catch(error => {
          console.error('发送消息失败:', error);
          const errorMessage: Message = {
            id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: 'ai',
            type: AgentResponseType.ERROR,
            content: '抱歉，我遇到了一些问题。请稍后重试。',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }).finally(() => {
          setIsLoading(false);
        });
      }, 500);
    }
  }, [isInitialized]);

  // 发送消息
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      type: 'text',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendAgentMessage({
        message: textToSend,
        sessionId: sessionId || undefined,
      });

      // 更新会话ID
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      // 更新当前步骤
      if (response.step) {
        setCurrentStep(response.step);
      }

      // 添加 AI 响应
      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'ai',
        type: response.type,
        content: response.message,
        data: response.data,
        actions: response.actions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'ai',
        type: AgentResponseType.ERROR,
        content: '抱歉，我遇到了一些问题。请稍后重试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按钮点击
  const handleActionClick = async (action: Action) => {
    if (isLoading) return;

    // 添加用户选择的消息
    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      type: 'text',
      content: `选择了: ${action.label}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendAgentMessage({
        message: '',
        sessionId: sessionId,
        selectedValue: action.value,
      });

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      if (response.step) {
        setCurrentStep(response.step);
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'ai',
        type: response.type,
        content: response.message,
        data: response.data,
        actions: response.actions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 如果方案创建成功，可以自动跳转到详情页
      if (response.type === AgentResponseType.PLAN_CREATED && action?.value === '/campaign-detail') {
        setTimeout(() => {
          onNavigate?.('campaign-detail');
        }, 1500);
      }
    } catch (error) {
      console.error('处理操作失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染消息内容
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case AgentResponseType.CITY_SELECTION:
        return (
          <div className="space-y-3">
            <p className="whitespace-pre-line">{message.content}</p>
            {message.data?.cities && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {message.data.cities.map((city: string) => (
                  <button
                    key={city}
                    onClick={() => handleActionClick({ label: city, value: city, type: 'primary' })}
                    className="flex items-center justify-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                  >
                    <MapPin size={16} />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case AgentResponseType.DATE_SELECTION:
        return (
          <div className="space-y-3">
            <p className="whitespace-pre-line">{message.content}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {message.actions?.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    action.type === 'primary'
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Calendar size={16} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        );

      case AgentResponseType.POINT_SELECTION:
        return (
          <div className="space-y-3">
            <p className="whitespace-pre-line">{message.content}</p>
            
            {/* 点位分布统计 */}
            {message.data?.selectionResult?.communityStats && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mt-3">
                <h4 className="text-sm font-semibold mb-2">点位分布</h4>
                <div className="space-y-1">
                  {message.data.selectionResult.communityStats.map((stat: any) => (
                    <div key={stat.communityId} className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Building2 size={14} className="text-slate-400" />
                        {stat.communityName}
                      </span>
                      <span className="font-medium">{stat.selectedCount}个</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 可用数量提示 */}
            {message.data?.totalAvailable !== undefined && (
              <div className="text-xs text-slate-500 mt-2">
                可用点位: {message.data.totalAvailable}个
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {message.actions?.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    action.type === 'primary'
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : action.type === 'danger'
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {action.value === 'confirm' && <CheckCircle size={16} />}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        );

      case AgentResponseType.PLAN_CREATED:
        return (
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="whitespace-pre-line text-green-800 dark:text-green-200">{message.content}</p>
            </div>
            
            {message.actions && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.actions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => handleActionClick(action)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      action.type === 'primary'
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <p className="whitespace-pre-line">{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f6f8] dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-surface-darker border-b border-slate-200 dark:border-slate-800 shrink-0 z-10">
        <button 
          onClick={onBack} 
          className="flex items-center justify-center size-10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold leading-tight">AI 销售助手</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-500">在线</span>
          </div>
        </div>
        <button className="flex items-center justify-center size-10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-end gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'ai' && (
                <div className="size-9 rounded-full overflow-hidden bg-primary/20 shrink-0 flex items-center justify-center border border-primary/30 text-primary">
                  <Bot size={20} />
                </div>
              )}
              
              <div className={`flex flex-col gap-1 max-w-[85%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-tl-sm border border-slate-200 dark:border-transparent'
                }`}>
                  {renderMessageContent(message)}
                </div>
                <span className="text-[10px] text-slate-400">
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="size-9 rounded-full overflow-hidden bg-slate-300 shrink-0">
                  <img 
                    src="https://picsum.photos/seed/user/100/100" 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400"
          >
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">AI 思考中...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="p-4 bg-white dark:bg-surface-darker border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <button className="flex items-center justify-center size-12 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <Plus size={24} />
          </button>
          <div className="flex-1 bg-slate-100 dark:bg-surface-dark rounded-[24px] flex items-center min-h-[48px] focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="请输入消息..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-base outline-none disabled:opacity-50"
            />
            <button className="p-2 mr-2 text-slate-400 hover:text-primary transition-colors">
              <Mic size={20} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex items-center justify-center size-12 rounded-full bg-primary text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* 快捷提示 */}
        <div className="max-w-4xl mx-auto mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {['帮我建个方案', '查询空闲点位', '查看已创建方案'].map((hint) => (
            <button
              key={hint}
              onClick={() => setInputMessage(hint)}
              className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
