import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300 antialiased h-screen overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Header title="智能工作台" subtitle="早上好，Alex。这是您的每日概览。">
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-subtext-light dark:text-subtext-dark text-lg">search</span>
            </span>
            <input className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark" placeholder="让 AI 帮您查找合同、客户..." type="text"/>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                <span className="material-icons-round text-accent">bolt</span> 快捷操作
              </h3>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">编辑快捷方式</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <button onClick={() => navigate('/customers')} className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-primary text-xl">add_box</span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">新建客户</span>
              </button>
              <button onClick={() => navigate('/plans')} className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-accent text-xl">auto_fix_high</span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">生成方案</span>
              </button>
              <button onClick={() => navigate('/inventory')} className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-green-500 text-xl">map</span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">查看档期</span>
              </button>
              <button onClick={() => navigate('/sales-contracts')} className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-orange-500 text-xl">assignment_turned_in</span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">起草合同</span>
              </button>
              <button onClick={() => navigate('/execution')} className="flex flex-col items-center justify-center p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-pink-500 text-xl">camera_alt</span>
                </div>
                <span className="text-sm font-medium text-text-light dark:text-text-dark">申请上刊</span>
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                <span className="material-icons-round text-primary">analytics</span> 数据概览
              </h3>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button className="px-3 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-text-light dark:text-text-dark">本周</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-subtext-light dark:text-subtext-dark hover:text-primary">本月</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark font-medium">可用资源位</p>
                    <h4 className="text-3xl font-display font-bold text-text-light dark:text-text-dark mt-1">1,240</h4>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <span className="material-icons-round text-[14px] mr-1">trending_up</span> +4.5%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full"></div>
                </div>
                <p className="text-xs text-subtext-light dark:text-subtext-dark mt-2">75% 入驻率</p>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark font-medium">本月营收</p>
                    <h4 className="text-3xl font-display font-bold text-text-light dark:text-text-dark mt-1">¥89,400</h4>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <span className="material-icons-round text-[14px] mr-1">trending_down</span> -2.1%
                  </span>
                </div>
                <div className="flex items-end space-x-2 h-10 mt-2">
                  <div className="w-1/6 bg-accent/30 dark:bg-accent/20 rounded-t h-[40%]"></div>
                  <div className="w-1/6 bg-accent/40 dark:bg-accent/30 rounded-t h-[60%]"></div>
                  <div className="w-1/6 bg-accent/60 dark:bg-accent/40 rounded-t h-[30%]"></div>
                  <div className="w-1/6 bg-accent/80 dark:bg-accent/50 rounded-t h-[80%]"></div>
                  <div className="w-1/6 bg-accent dark:bg-accent/70 rounded-t h-[50%]"></div>
                  <div className="w-1/6 bg-accent dark:bg-accent/90 rounded-t h-[75%]"></div>
                </div>
              </div>

              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark font-medium">待办事项</p>
                    <h4 className="text-3xl font-display font-bold text-text-light dark:text-text-dark mt-1">12</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <span className="material-icons-round text-lg">priority_high</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-center">
                    <span className="block text-xs text-subtext-light dark:text-subtext-dark">待审批</span>
                    <span className="block text-lg font-bold text-text-light dark:text-text-dark">5</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-center">
                    <span className="block text-xs text-subtext-light dark:text-subtext-dark">待巡检</span>
                    <span className="block text-lg font-bold text-text-light dark:text-text-dark">7</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="font-bold text-text-light dark:text-text-dark">待办任务</h3>
                <a className="text-sm text-primary hover:underline" href="#">查看全部</a>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="material-icons-round">description</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">合同审批 - 星空传媒</h4>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">特殊价格条款需您审批确认。</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">高优先级</span>
                    <button className="text-subtext-light hover:text-primary dark:text-subtext-dark">
                      <span className="material-icons-round">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <span className="material-icons-round">image</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">画面审核 - B区</h4>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">24个点位上报了画面问题。</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">运营</span>
                    <button className="text-subtext-light hover:text-primary dark:text-subtext-dark">
                      <span className="material-icons-round">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-icons-round">handyman</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">维修派单 - 屏幕 #402</h4>
                    <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">监控系统报告信号丢失。</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">维修</span>
                    <button className="text-subtext-light hover:text-primary dark:text-subtext-dark">
                      <span className="material-icons-round">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 bg-gradient-to-br from-primary to-accent text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons-round">auto_awesome</span>
                <h3 className="font-bold text-lg">AI 洞察</h3>
              </div>
              <p className="text-sm text-blue-50 leading-relaxed mb-6">
                基于历史数据分析，<strong>北区</strong> 的入住率预计下个月将下降 15%。建议针对空闲点位启动促销活动。
              </p>
              <button className="w-full py-2.5 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                <span>生成活动方案</span>
                <span className="material-icons-round text-sm">arrow_forward</span>
              </button>
            </div>
          </section>
        </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50 group">
        <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
          <p className="text-sm text-text-light dark:text-text-dark font-medium">今天有什么可以帮您管理资源的吗？</p>
          <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white dark:bg-surface-dark border-b border-r border-gray-100 dark:border-gray-600 transform rotate-45"></div>
        </div>
        <button className="ai-pulse flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg text-white hover:scale-105 transition-transform duration-200">
          <span className="material-icons-round text-2xl">smart_toy</span>
        </button>
      </div>
    </div>
  );
}
