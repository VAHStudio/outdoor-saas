import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Settings() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="系统设置" subtitle="管理您的账户和系统偏好设置。" />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-8">
            <h2 className="text-xl font-semibold mb-4">设置选项</h2>
            <p className="text-slate-500 dark:text-slate-400">设置页面内容正在开发中...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
