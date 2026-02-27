/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  MessageSquare, 
  TrendingUp, 
  CheckSquare, 
  User, 
  Plus, 
  Search, 
  Bell, 
  Mic, 
  Send, 
  ArrowLeft, 
  MoreVertical,
  Map as MapIcon,
  Calendar,
  DollarSign,
  Users,
  Settings,
  FileText,
  HardHat,
  ChevronRight,
  Camera,
  Lock,
  Share2,
  Filter,
  ArrowRight,
  Bot,
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { ViewType } from './types';
import { AgentChatView } from './components/AgentChatView';
import { VoiceInputModal } from './components/VoiceInputModal';

// AI领域判断函数
const classifyQuestionDomain = async (question: string): Promise<'sales' | 'media' | 'engineering' | 'finance'> => {
  // 这里应该调用后端API进行AI判断
  // 临时使用简单的关键词匹配
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('方案') || lowerQuestion.includes('客户') || lowerQuestion.includes('销售') || lowerQuestion.includes('投放') || lowerQuestion.includes('广告') || lowerQuestion.includes('合同')) {
    return 'sales';
  } else if (lowerQuestion.includes('点位') || lowerQuestion.includes('媒介') || lowerQuestion.includes('库存') || lowerQuestion.includes('资源') || lowerQuestion.includes('位置') || lowerQuestion.includes('社区')) {
    return 'media';
  } else if (lowerQuestion.includes('维护') || lowerQuestion.includes('工程') || lowerQuestion.includes('验收') || lowerQuestion.includes('安装') || lowerQuestion.includes('设备') || lowerQuestion.includes('维修')) {
    return 'engineering';
  } else if (lowerQuestion.includes('预算') || lowerQuestion.includes('财务') || lowerQuestion.includes('发票') || lowerQuestion.includes('付款') || lowerQuestion.includes('报销') || lowerQuestion.includes('成本')) {
    return 'finance';
  }
  
  // 默认返回销售
  return 'sales';
};

// 投小智输入组件
const AgentsInputSection = ({ onNavigate }: { onNavigate: (view: ViewType, agentType?: string) => void }) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVoiceResult = (text: string) => {
    setInputText(text);
    setIsVoiceModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // AI判断领域
      const domain = await classifyQuestionDomain(inputText);
      
      // 根据领域跳转到对应agent
      const agentMap: Record<string, string> = {
        'sales': '销售AI助理',
        'media': '媒介AI助理',
        'engineering': '工程AI助理',
        'finance': '财务AI助理'
      };
      
      const selectedAgent = agentMap[domain];
      
      // 确保localStorage设置完成后再导航
      localStorage.setItem('userQuestion', inputText);
      localStorage.setItem('selectedAgent', selectedAgent);
      
      // 验证存储成功
      const storedQuestion = localStorage.getItem('userQuestion');
      const storedAgent = localStorage.getItem('selectedAgent');
      
      if (storedQuestion === inputText && storedAgent === selectedAgent) {
        // 存储成功，清空输入框并导航
        setInputText('');
        onNavigate('chat');
      } else {
        console.error('localStorage存储失败');
      }
    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">投小智-永达传媒AI员工</h2>
      <div className="relative flex items-center w-full">
        <div className="flex-1 relative flex items-center h-14 rounded-l-2xl bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg border border-r-0 border-primary/20 focus-within:border-primary/40 transition-all">
          <div className="absolute left-4 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Bot className="text-primary" size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="向AI智能体提出您的需求或问题..."
            className="w-full h-full bg-transparent pl-14 pr-4 text-sm text-white placeholder-slate-400 outline-none border-none focus:ring-0"
          />
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="absolute right-3 p-1 hover:bg-slate-600 rounded-full transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="h-14 px-4 bg-slate-700 border border-primary/20 border-l-0 hover:bg-slate-600 transition-colors flex items-center justify-center"
        >
          <Mic className="text-primary" size={20} />
        </button>
        <button
          onClick={handleSubmit}
          disabled={!inputText.trim() || isAnalyzing}
          className="h-14 w-14 bg-primary text-white rounded-r-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2 ml-1">输入问题后AI将自动匹配最合适的智能体为您服务</p>
      
      {/* 语音输入弹窗 */}
      <VoiceInputModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onResult={handleVoiceResult}
      />
    </div>
  );
};

// 智能问候语生成函数
const generateGreeting = () => {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  
  // 员工信息（实际项目中应从后端API获取）
  const employeeBirthday = { month: 3, date: 15 }; // 示例：3月15日
  const isBirthday = month === employeeBirthday.month && date === employeeBirthday.date;
  
  // 时间段问候语
  const timeGreetings = {
    morning: ['晨光熹微，惠风和畅', '旭日东升，万象更新', '清晨破晓，朝气蓬勃'],
    noon: ['午时将至，日正当中', '正午时分，阳光和煦'],
    afternoon: ['午后时光，宁静致远', '日影西斜，工作顺利'],
    evening: ['暮色四合，华灯初上', '夕阳西下，倦鸟归林', '夜幕降临，星河璀璨']
  };
  
  // 特殊节日问候
  const festivalGreetings: Record<string, string> = {
    '1-1': '新年伊始，万象更新',
    '2-14': '花开并蒂，情意绵绵',
    '3-8': '春风如你，熠熠芳华',
    '5-1': '劳动光荣，耕耘有获',
    '5-4': '青春正茂，风华正茂',
    '6-1': '童心未泯，初心不改',
    '7-1': '同心向党，砥砺奋进',
    '8-1': '军魂永驻，国泰民安',
    '9-10': '桃李不言，下自成蹊',
    '10-1': '盛世华诞，举国同庆',
    '10-24': '程序员节，码到成功',
    '11-11': '良人相伴，岁月静好',
    '12-25': '平安喜乐，温暖如初'
  };
  
  // 生日祝福语
  const birthdayGreetings = [
    '生辰吉乐，福寿康宁',
    '年年今日，岁岁今朝',
    '生辰喜庆，福如东海',
    '岁岁平安，年年如意'
  ];
  
  // 随机祝福语
  const blessings = [
    '愿今日诸事顺遂，心想事成',
    '愿前程似锦，步步高升',
    '愿身体康泰，阖家欢乐',
    '愿财源广进，事业腾达',
    '愿所求皆如愿，所行皆坦途',
    '愿春风得意马蹄疾，一日看尽长安花',
    '愿福慧双增，吉祥如意',
    '愿岁月静好，现世安稳',
    '愿乘风破浪，直挂云帆济沧海',
    '愿厚德载物，自强不息',
    '愿天道酬勤，功不唐捐',
    '愿明德惟馨，止于至善'
  ];
  
  // 判断节日
  const festivalKey = `${month}-${date}`;
  const festivalGreeting = festivalGreetings[festivalKey];
  
  // 生成问候语
  let greeting: string;
  if (isBirthday) {
    // 生日优先
    greeting = birthdayGreetings[Math.floor(Math.random() * birthdayGreetings.length)];
  } else if (festivalGreeting) {
    greeting = festivalGreeting;
  } else if (hour >= 5 && hour < 11) {
    greeting = timeGreetings.morning[Math.floor(Math.random() * timeGreetings.morning.length)];
  } else if (hour >= 11 && hour < 14) {
    greeting = timeGreetings.noon[Math.floor(Math.random() * timeGreetings.noon.length)];
  } else if (hour >= 14 && hour < 18) {
    greeting = timeGreetings.afternoon[Math.floor(Math.random() * timeGreetings.afternoon.length)];
  } else {
    greeting = timeGreetings.evening[Math.floor(Math.random() * timeGreetings.evening.length)];
  }
  
  // 随机选择祝福语
  const blessing = blessings[Math.floor(Math.random() * blessings.length)];
  
  return `${greeting}，${blessing}。`;
};

// --- Components ---

const BillboardIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M3 5.5L21 8.5V16.5L3 13.5V5.5Z" />
    <path d="M7 14V20H8.5V14.2L7 14Z" />
    <path d="M16 15.5V20H17.5V15.7L16 15.5Z" />
    <path d="M2 20.5C2 20.2 6 20 12 20C18 20 22 20.2 22 20.5C22 20.8 18 21 12 21C6 21 2 20.8 2 20.5Z" />
  </svg>
);

// --- Views ---

const WorkbenchView = ({ onNavigate }: { onNavigate: (view: ViewType) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#f8f9fc] dark:bg-background-dark">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutGrid className="text-primary" size={24} />
          <h1 className="text-xl font-bold tracking-tight">工作台</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Bell className="text-slate-400" size={20} />
          <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white dark:border-slate-700 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索应用、任务或报表..." 
              className="w-full pl-10 pr-12 py-3 rounded-xl border-none bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-primary outline-none"
            />
            <Mic className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">常用应用</h2>
            <button className="text-xs font-medium text-primary">编辑</button>
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {[
              { icon: <FileText />, label: '方案管理', view: 'campaign-list' },
              { icon: <HardHat />, label: '工程任务', view: 'tasks' },
              { icon: <Receipt />, label: '合同管理' },
              { icon: <Users />, label: '客户管理' },
              { icon: <MapIcon />, label: '媒体点位' },
              { icon: <TrendingUp />, label: '财务报表' },
              { icon: <Plus />, label: '营销工具', view: 'chat' },
              { icon: <Settings />, label: '设置' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.view && onNavigate(item.view as ViewType)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-slate-500">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-blue-600 p-4 shadow-lg text-white">
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base mb-1">待办事项提醒</h3>
                <p className="text-blue-100 text-sm">您有 3 个工程验收任务需要在今日完成。</p>
              </div>
              <button className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                查看详情
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">最近访问</h2>
            <button className="text-xs text-slate-400 flex items-center">全部 <ChevronRight size={14} /></button>
          </div>
          <div className="space-y-3">
            {[
              { title: '市中心LED大屏广告投放方案_V3', status: '审批中', time: '10分钟前', color: 'orange' },
              { title: '世纪大道候车亭维修工单 #20231024', status: '进行中', time: '2小时前', color: 'blue' },
              { title: '华盛地产年度投放合同续约', status: '草稿', time: '昨天', color: 'gray' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      item.color === 'orange' ? 'bg-orange-100 text-orange-600' : 
                      item.color === 'blue' ? 'bg-blue-100 text-primary' : 'bg-slate-100 text-slate-500'
                    }`}>{item.status}</span>
                    <span className="text-xs text-slate-400">更新于 {item.time}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const ChatView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#f6f6f8] dark:bg-background-dark">
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-surface-darker border-b border-slate-200 dark:border-slate-800 shrink-0 z-10">
        <button onClick={onBack} className="flex items-center justify-center size-10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
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
        <button className="flex items-center justify-center size-10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
          <MoreVertical size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        <div className="flex justify-center py-2">
          <span className="text-xs font-medium text-slate-400 bg-slate-200 dark:bg-surface-dark px-3 py-1 rounded-full">今天 10:23</span>
        </div>

        {/* User Message */}
        <div className="flex items-end gap-3 justify-end">
          <div className="flex flex-col gap-1 items-end max-w-[85%]">
            <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
              <p className="text-base">请帮可口可乐设计一个预算20万的2月份南京电梯框架广告投放方案</p>
            </div>
          </div>
          <div className="size-9 rounded-full overflow-hidden bg-slate-300 shrink-0">
            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* AI Message */}
        <div className="flex items-end gap-3 justify-start">
          <div className="size-9 rounded-full overflow-hidden bg-primary/20 shrink-0 flex items-center justify-center border border-primary/30 text-primary">
            <Bot size={20} />
          </div>
          <div className="flex flex-col gap-2 items-start max-w-[90%] md:max-w-[70%]">
            <div className="bg-white dark:bg-surface-dark text-slate-900 dark:text-white px-5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200 dark:border-transparent">
              <p className="text-base">我已经根据您的需求生成了初步方案，以下是方案要点：</p>
            </div>
            
            <div className="w-full bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="relative h-48 w-full">
                <img src="https://picsum.photos/seed/ad/800/600" alt="Campaign" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded">推荐方案</span>
                  <span className="bg-slate-800/80 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2 py-1 rounded">版本 4 / 5</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold leading-tight">可口可乐2月南京投放方案</h3>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <Calendar size={14} /> 2024年2月 投放排期
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-surface-darker/50">
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 text-primary shrink-0">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider text-slate-400 font-semibold">预算</p>
                      <p className="text-sm font-semibold">20万</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-surface-darker/50">
                    <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 shrink-0">
                      <MapIcon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider text-slate-400 font-semibold">地区</p>
                      <p className="text-sm font-semibold">南京</p>
                    </div>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors group">
                  <span>查看完整方案</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-white dark:bg-surface-darker border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          <button className="flex items-center justify-center size-12 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10">
            <Plus size={24} />
          </button>
          <div className="flex-1 bg-slate-100 dark:bg-surface-dark rounded-[24px] flex items-center min-h-[48px] focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <input 
              type="text" 
              placeholder="请输入消息..." 
              className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-base"
            />
            <button className="p-2 mr-2 text-slate-400">
              <Mic size={20} />
            </button>
          </div>
          <button className="flex items-center justify-center size-12 rounded-full bg-primary text-white shadow-md">
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

const CampaignListView = ({ onBack, onSelect }: { onBack: () => void, onSelect: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">方案管理</h2>
        <button className="size-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Plus size={24} className="text-primary" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 no-scrollbar">
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索方案名称..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-surface-dark shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {['全部', '进行中', '审批中', '草稿', '已结案'].map((tab, i) => (
            <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark text-slate-500 border border-slate-100 dark:border-slate-800'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {[
            { title: '南京地区季度战略投放方案', status: '草稿', time: '2小时前', budget: '¥1.2M', reach: '4.5M+', image: 'https://picsum.photos/seed/n1/400/200' },
            { title: '市中心LED大屏广告投放方案_V3', status: '审批中', time: '10分钟前', budget: '¥800k', reach: '2.1M+', image: 'https://picsum.photos/seed/n2/400/200' },
            { title: '可口可乐2月南京投放方案', status: '进行中', time: '1天前', budget: '¥200k', reach: '800k+', image: 'https://picsum.photos/seed/n3/400/200' },
            { title: '华盛地产年度投放合同续约', status: '草稿', time: '昨天', budget: '¥2.5M', reach: '10M+', image: 'https://picsum.photos/seed/n4/400/200' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={onSelect}
              className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="h-32 w-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                    item.status === '审批中' ? 'bg-orange-500 text-white' : 
                    item.status === '进行中' ? 'bg-primary text-white' : 'bg-slate-500 text-white'
                  }`}>{item.status}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-2 line-clamp-1">{item.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">预算</p>
                      <p className="text-sm font-bold text-primary">{item.budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">预计触达</p>
                      <p className="text-sm font-bold">{item.reach}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const CampaignDetailView = ({ onBack }: { onBack: () => void }) => {
  const [mode, setMode] = useState<'list' | 'map'>('list');

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">南京投放方案详情</h2>
        <button className="size-12 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Share2 size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <div className="px-4 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded tracking-wider uppercase">草稿</span>
            <span className="text-slate-400 text-xs font-medium">更新于 2小时前</span>
          </div>
          <h2 className="text-[28px] font-bold leading-tight">南京地区季度战略投放方案</h2>
          <p className="text-slate-400 text-sm mt-1">Q3 户外媒体触达计划 • 南京核心商圈及社区</p>
        </div>

        <div className="px-4 pt-4">
          <h3 className="text-sm font-bold mb-3">总体信息</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <DollarSign size={20} />, label: '预算', value: '¥1.2M' },
              { icon: <TrendingUp size={20} />, label: '预计触达', value: '4.5M+' },
              { icon: <Calendar size={20} />, label: '周期', value: '30天' },
            ].map((item, i) => (
              <div key={i} className="flex min-w-[100px] flex-1 flex-col gap-2 rounded-xl p-4 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{item.icon}</span>
                  <p className="text-slate-400 text-xs font-medium">{item.label}</p>
                </div>
                <p className="text-xl font-bold leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold mb-3">点位选择</h3>
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
            <button 
              onClick={() => setMode('list')}
              className={`flex-1 h-full flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all ${mode === 'list' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500'}`}
            >
              <LayoutGrid size={18} /> 列表模式
            </button>
            <button 
              onClick={() => setMode('map')}
              className={`flex-1 h-full flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all ${mode === 'map' ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500'}`}
            >
              <MapIcon size={18} /> 地图模式
            </button>
          </div>
        </div>

        {mode === 'list' ? (
          <div className="mt-6">
            <div className="flex items-center justify-between px-4 pb-2">
              <h2 className="text-lg font-bold">南京优质社区 (5)</h2>
              <button className="text-primary text-sm font-medium flex items-center gap-1">
                筛选 <Filter size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-4 px-4 pb-4">
              {[
                { title: '御园名邸广场', area: '鼓楼区', price: '15.0万', tags: ['LED大屏', '社区主入口', '首选推荐'], image: 'https://picsum.photos/seed/nanjing1/800/600' },
                { title: '仙林中心 A座', area: '栖霞区', price: '12.0万', tags: ['电梯海报', '商住两用'], image: 'https://picsum.photos/seed/nanjing2/800/600' },
                { title: '河西中央公园景观位', area: '建邺区', price: '18.0万', tags: ['户外看板', '交通主干道'], image: 'https://picsum.photos/seed/nanjing3/800/600' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col rounded-xl bg-white dark:bg-surface-dark overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="relative h-48 w-full bg-slate-200">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <TrendingUp size={14} className="text-green-600" /> 高人流量
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                          <MapIcon size={16} /> 南京市 {item.area}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-primary font-bold text-lg">¥{item.price}</span>
                        <span className="text-slate-400 text-xs">/ 月</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map((tag, j) => (
                        <span key={j} className={`px-2 py-1 rounded text-xs font-medium ${tag === '首选推荐' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 h-[500px] relative mx-4 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src="https://picsum.photos/seed/map/1200/800" alt="Map" className="w-full h-full object-cover opacity-50 grayscale" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl p-3 border border-slate-200 dark:border-slate-800 min-w-[180px] mb-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold">万科翡翠公园</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">精选</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">江宁区 · 电梯框架</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">12 个点位</span>
                    <span className="text-[10px] text-slate-400 font-medium">查看详情 &gt;</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                  <MapIcon size={16} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-16 left-0 right-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark p-4 z-50 shadow-lg">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors min-w-[64px]">
            <FileText size={24} />
            <span className="text-xs font-medium">报价清单</span>
          </button>
          <button className="flex-1 bg-primary hover:bg-blue-600 text-white h-12 rounded-lg font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all">
            <Lock size={20} /> 申请锁位
          </button>
        </div>
      </div>
    </div>
  );
};

const TasksView = ({ onNavigate }: { onNavigate: (view: ViewType) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] dark:bg-background-dark">
      <header className="bg-surface-dark text-white pt-4 pb-4 px-4 shadow-md z-20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="输入编号 or 名称搜索" 
              className="w-full bg-slate-700 text-white rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none placeholder-slate-400 border-none"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <section className="bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 mb-2">
          <div className="grid grid-cols-5 divide-x divide-slate-100 dark:divide-slate-700">
            <div className="bg-primary text-white p-3 flex flex-col items-center justify-center">
              <span className="text-xs opacity-90 mb-1">总数</span>
              <span className="text-xl font-bold">300</span>
            </div>
            <div className="p-3 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-1">已执行</span>
              <span className="text-xl font-bold text-primary">180</span>
            </div>
            <div className="p-3 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-1">未执行</span>
              <span className="text-xl font-bold text-red-500">120</span>
            </div>
            <div className="p-3 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-1">无法执行</span>
              <span className="text-xl font-bold text-slate-400">10</span>
            </div>
            <div className="p-3 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 mb-1">线路明细</span>
              <span className="text-sm font-bold text-primary flex items-center">展开</span>
            </div>
          </div>
        </section>

        <div className="px-2 space-y-3">
          {[
            { title: '阅城国际花园', area: '南京市栖霞区', count: '30/50', items: [
              { label: '框架', type: '上', text: '苏宁易购/618活动通知/商城广告', deadline: '2023-06-18 截止', qty: '×20' },
              { label: '框架', type: '上', text: '南京埃德媒/投户外平台推广活动', deadline: '2023-06-20 截止', qty: '×30' },
            ]},
            { title: '万石国际贸易中心', area: '南京市栖霞区', count: '30/50', items: [
              { label: '框架', type: '上', text: '苏宁易购/618活动通知/商城广告', deadline: '2023-06-18 截止', qty: '×20' },
            ]},
          ].map((section, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden" onClick={() => onNavigate('task-detail')}>
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">({section.area})</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-500">{section.count.split('/')[0]}</span>
                  <span className="text-xl font-bold text-primary">/{section.count.split('/')[1]}</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {section.items.map((item, j) => (
                  <div key={j} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                      <span className="inline-block px-1 py-0.5 text-xs text-primary border border-primary rounded bg-blue-50 dark:bg-blue-900/20">{item.label}</span>
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded shadow-sm">{item.type}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.deadline}</p>
                    </div>
                    <span className="text-sm text-slate-400">{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const TaskDetailView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] dark:bg-background-dark">
      <header className="sticky top-0 w-full z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="h-6 w-full"></div>
        <div className="flex items-center justify-between px-4 h-12">
          <button onClick={onBack} className="flex items-center text-primary">
            <ArrowLeft size={24} />
            <span className="text-base font-medium -ml-1">返回</span>
          </button>
          <h1 className="text-lg font-bold">任务详情</h1>
          <button className="text-primary text-sm font-medium">无法执行</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-4 px-4 space-y-4 pb-32 no-scrollbar">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold leading-tight">【阅城国际花园】13楼2单元2号梯3号位10004</h2>
            <span className="bg-red-50 dark:bg-red-900/30 text-red-500 text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ml-2">待拍照</span>
          </div>
          <div className="space-y-1 text-sm text-slate-500 mt-3">
            <div className="flex">
              <span className="w-16">类型：</span>
              <span className="text-slate-900 dark:text-white font-medium">社区框架</span>
            </div>
            <div className="flex">
              <span className="w-16">规格：</span>
              <span className="text-slate-900 dark:text-white font-medium">框架 1.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">任务要求</h3>
          </div>
          <div className="p-4 text-sm">画面要保证平整、完整。</div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">设计画面</h3>
            <span className="text-xs text-slate-400">(点击图片放大查看)</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                <img src="https://picsum.photos/seed/design1/400/300" alt="Design" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-slate-400 text-center">商城广告</p>
            </div>
            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700">
                <img src="https://picsum.photos/seed/design2/400/300" alt="Design" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-slate-400 text-center">商城广告</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">拍摄画面</h3>
          </div>
          <div className="p-4">
            <div className="aspect-[4/3] w-full max-w-[50%] rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center cursor-pointer">
              <div className="bg-primary p-3 rounded-full shadow-lg text-white">
                <Camera size={24} />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">待拍照</p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700 p-4 shadow-lg z-50">
        <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold text-lg h-12 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
          <Camera size={24} />
          <span>拍摄照片</span>
        </button>
      </div>
    </div>
  );
};

const InsightsView = ({ onNavigate }: { onNavigate: (view: ViewType) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#101622] text-white">
      <header className="pt-12 pb-2 px-6 flex items-center justify-between sticky top-0 z-10 bg-[#101622]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex flex-col">
          <h2 className="text-xs font-semibold tracking-wider text-primary uppercase mb-1">资讯中心</h2>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            AI 主动业务资讯
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </h1>
        </div>
        <button className="p-2 rounded-full bg-slate-800 text-white border border-white/5">
          <Bell size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32 no-scrollbar">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['全部智能体', '媒介专员', '财务总监', '销售主管'].map((label, i) => (
            <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-white/5 ${i === 0 ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300'}`}>
              {label}
            </button>
          ))}
        </div>

        {[
          { icon: <MapIcon className="text-emerald-400" />, title: '媒介专员：点位占有率报告', time: '2分钟前', area: '市中心区域', text: '市中心区域的点位占有率本周下降了 5%。我已为您准备了一份第三季度的促销组合方案，以提高上刊率。', image: 'https://picsum.photos/seed/insight1/800/400' },
          { icon: <Receipt className="text-amber-400" />, title: '财务总监：待处理发票提醒', time: '15分钟前', area: '应付账款', text: '霓虹户外用品公司 的待处理发票超出了月度预算阈值 ¥15,000。在继续处理前需要您的审批。', badge: '需要处理' },
          { icon: <TrendingUp className="text-purple-400" />, title: '销售主管：投放表现分析', time: '1小时前', area: '品牌投放表现', text: '某知名快消品牌的“夏日狂欢”系列活动曝光量超过预期 12%。我建议向客户提议追加预算。' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/10">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-slate-400 text-xs">{item.time} • {item.area}</p>
                </div>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/20 uppercase tracking-wide">{item.badge}</span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed mb-4">{item.text}</p>
            {item.image && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 border border-white/10">
                <img src={item.image} alt="Insight" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate('campaign-detail')}
                className="flex-1 bg-slate-700/50 hover:bg-primary/20 text-primary border border-primary/20 py-2.5 rounded-lg text-xs font-medium transition-all"
              >
                查看详情
              </button>
              <button className="px-3 bg-slate-700/50 hover:bg-white/10 text-white border border-white/10 rounded-lg flex items-center justify-center">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

const AgentsView = ({ onNavigate }: { onNavigate: (view: ViewType) => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#101622] text-white">
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-[#101622]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: 'url(https://picsum.photos/seed/alex/100/100)' }}></div>
          <div>
            <h2 className="text-sm font-medium text-slate-400">{generateGreeting()}</h2>
            <h1 className="text-lg font-bold">魏前胜</h1>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400">
          <Bell size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-32 no-scrollbar">
        <AgentsInputSection onNavigate={onNavigate} />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">AI 主动业务资讯</h3>
            <button className="text-xs font-semibold text-primary">查看全部</button>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden" onClick={() => onNavigate('chat')}>
            <div className="flex items-start gap-3 relative z-10">
              <div className="size-10 rounded-full bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: 'url(https://picsum.photos/seed/sarah/100/100)' }}></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI 销售方案对话</span>
                  <span className="text-xs text-slate-500">2分钟前</span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">
                  南京广告投放方案详情已更新。市中心区域的互动率提升了15%。是否需要为您安排方案评审？
                </p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('campaign-detail');
                    }}
                    className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg"
                  >
                    查看详情
                  </button>
                  <button className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700">忽略</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">永达传媒AI团队</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: '销售AI助理', desc: '正在分析本月南京户外广告投放趋势。', img: 'https://picsum.photos/seed/agent1/100/100', status: 'online' },
              { name: '媒介AI助理', desc: '正在优化11月份的广告位库存分配。', img: 'https://picsum.photos/seed/agent2/100/100', status: 'online' },
              { name: '工程AI助理', desc: '计划于凌晨 2:00 进行广告屏维护。', img: 'https://picsum.photos/seed/agent3/100/100', status: 'offline' },
              { name: '财务AI助理', desc: '第四季度预算预测待审批。', img: 'https://picsum.photos/seed/agent4/100/100', status: 'online' },
            ].map((agent, i) => (
              <div 
                key={i} 
                onClick={() => onNavigate('chat')}
                className="p-4 rounded-xl bg-slate-800 border border-white/5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${agent.img})` }}></div>
                  <div className={`size-2 rounded-full mt-1 mr-1 ${agent.status === 'online' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                </div>
                <h4 className="font-bold text-sm">{agent.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{agent.desc}</p>
              </div>
            ))}
            <div className="p-4 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800/50 transition-colors h-full min-h-[140px]">
              <div className="size-10 rounded-full bg-slate-700 flex items-center justify-center mb-2 text-slate-400">
                <Plus size={24} />
              </div>
              <span className="text-xs font-semibold text-slate-400">添加智能体</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('agents');
  const [history, setHistory] = useState<ViewType[]>(['agents']);
  
  // 语音输入相关状态
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  
  // 长按相关ref
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const navigateTo = (view: ViewType) => {
    setHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentView(prevView);
    } else {
      setCurrentView('workbench');
    }
  };

  // 长按开始
  const handleTouchStart = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsVoiceModalOpen(true);
    }, 500); // 500ms触发长按
  };

  // 长按结束
  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // 处理语音输入结果
  const handleVoiceResult = (text: string) => {
    setVoiceInputText(text);
    // 如果识别到文字，存储到localStorage并跳转到聊天页面
    if (text.trim()) {
      console.log('语音识别结果:', text);
      // 存储到localStorage，这样AgentChatView可以读取到
      localStorage.setItem('userQuestion', text);
      localStorage.setItem('selectedAgent', '销售AI助理'); // 默认使用销售AI助理
      navigateTo('chat');
    }
  };

  // 修改BottomNav组件以支持长按
  const BottomNavWithLongPress = ({ activeView, onViewChange }: { activeView: ViewType, onViewChange: (view: ViewType) => void }) => {
    return (
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-darker pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-end pb-2">
          <button 
            onClick={() => onViewChange('workbench')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeView === 'workbench' ? 'text-primary' : 'text-slate-400'}`}
          >
            <LayoutGrid size={24} />
            <span className="text-[10px] font-medium">工作台</span>
          </button>
          
          <button 
            onClick={() => onViewChange('insights')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeView === 'insights' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Bot size={24} />
            <span className="text-[10px] font-medium">AI资讯</span>
          </button>

          <div className="relative -top-5">
            <button 
              onClick={() => {
                if (!isLongPressRef.current) {
                  onViewChange('agents');
                }
              }}
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transform transition-transform hover:scale-105 ${activeView === 'agents' ? 'ring-4 ring-primary/20' : ''}`}
            >
              <BillboardIcon size={32} />
            </button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-500 whitespace-nowrap">投小智</span>
          </div>

          <button 
            onClick={() => onViewChange('tasks')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeView === 'tasks' ? 'text-primary' : 'text-slate-400'}`}
          >
            <CheckSquare size={24} />
            <span className="text-[10px] font-medium">任务</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors w-12"
          >
            <User size={24} />
            <span className="text-[10px] font-medium">我的</span>
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-hidden"
        >
          {currentView === 'workbench' && <WorkbenchView onNavigate={navigateTo} />}
          {currentView === 'chat' && <AgentChatView onBack={goBack} onNavigate={navigateTo} />}
          {currentView === 'campaign-list' && <CampaignListView onBack={goBack} onSelect={() => navigateTo('campaign-detail')} />}
          {currentView === 'campaign-detail' && <CampaignDetailView onBack={goBack} />}
          {currentView === 'tasks' && <TasksView onNavigate={navigateTo} />}
          {currentView === 'task-detail' && <TaskDetailView onBack={goBack} />}
          {currentView === 'insights' && <InsightsView onNavigate={navigateTo} />}
          {currentView === 'agents' && <AgentsView onNavigate={navigateTo} />}
        </motion.div>
      </AnimatePresence>

      {currentView !== 'chat' && <BottomNavWithLongPress activeView={currentView} onViewChange={navigateTo} />}
      
      {/* 语音输入弹窗 */}
      <VoiceInputModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onResult={handleVoiceResult}
      />
    </div>
  );
}
