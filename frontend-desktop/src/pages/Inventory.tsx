import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// --- Types ---
interface InventoryItem {
  id: string;
  pointName: string;
  mediaType: string;
  status: '空闲' | '在刊' | '预定' | '故障';
  price: number;
  unit: string;
  currentCustomer?: string;
  bookingInfo?: string;
  nextAvailable?: string;
  // Dynamic fields
  building?: string; unitNo?: string; elevator?: string; // 框架
  direction?: string; orientation?: string; inOut?: string; // 道闸
  format?: string; illumination?: string; traffic?: string; // 大牌
  // Gantt Schedule (1-30 days for mock)
  schedule: { start: number, end: number, type: 'published' | 'booked', customer: string }[];
}

// --- Mock Data ---
const mockInventory: InventoryItem[] = [
  // 电梯框架
  { id: 'FR-001', pointName: '翠园社区', mediaType: '电梯框架', status: '在刊', price: 300, unit: '周', currentCustomer: '星空传媒', bookingInfo: '无', nextAvailable: '2024-08-01', building: 'A栋', unitNo: '1单元', elevator: '客梯1', schedule: [{ start: 1, end: 15, type: 'published', customer: '星空传媒' }, { start: 20, end: 30, type: 'booked', customer: '绿生活' }] },
  { id: 'FR-002', pointName: '翠园社区', mediaType: '电梯框架', status: '空闲', price: 300, unit: '周', currentCustomer: '-', bookingInfo: '绿生活 (08.15起)', nextAvailable: '现在', building: 'A栋', unitNo: '2单元', elevator: '客梯2', schedule: [{ start: 15, end: 25, type: 'booked', customer: '绿生活' }] },
  { id: 'FR-003', pointName: '阳光小区', mediaType: '电梯框架', status: '预定', price: 280, unit: '周', currentCustomer: '-', bookingInfo: '海洋广告 (07.10起)', nextAvailable: '2024-09-01', building: 'B栋', unitNo: '1单元', elevator: '货梯', schedule: [{ start: 10, end: 30, type: 'booked', customer: '海洋广告' }] },
  // 道闸
  { id: 'BR-001', pointName: '科技园南区', mediaType: '道闸', status: '在刊', price: 1200, unit: '月', currentCustomer: '极速汽车', bookingInfo: '无', nextAvailable: '2024-08-15', direction: '南门', orientation: '朝外', inOut: '入口', schedule: [{ start: 1, end: 30, type: 'published', customer: '极速汽车' }] },
  { id: 'BR-002', pointName: '科技园北区', mediaType: '道闸', status: '空闲', price: 1000, unit: '月', currentCustomer: '-', bookingInfo: '无', nextAvailable: '现在', direction: '北门', orientation: '朝内', inOut: '出口', schedule: [] },
  // 户外大牌
  { id: 'BB-001', pointName: '滨海大道跨线桥', mediaType: '户外大牌', status: '在刊', price: 85000, unit: '月', currentCustomer: '巅峰科技', bookingInfo: '星空传媒 (10.01起)', nextAvailable: '2024-10-01', format: '三面翻', illumination: '外打光', traffic: '15万辆/日', schedule: [{ start: 1, end: 30, type: 'published', customer: '巅峰科技' }] },
];

const mediaTypes = ['电梯框架', '道闸', '户外大牌'];

export default function Inventory() {
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');
  const [selectedMediaType, setSelectedMediaType] = useState('电梯框架');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockInventory.filter(item => 
    item.mediaType === selectedMediaType && 
    (item.pointName.includes(searchTerm) || item.id.includes(searchTerm))
  );

  const renderDynamicHeaders = () => {
    switch (selectedMediaType) {
      case '电梯框架':
        return (
          <>
            <th className="px-4 py-3">楼栋</th>
            <th className="px-4 py-3">单元</th>
            <th className="px-4 py-3">电梯</th>
          </>
        );
      case '道闸':
        return (
          <>
            <th className="px-4 py-3">方位</th>
            <th className="px-4 py-3">朝向</th>
            <th className="px-4 py-3">进出口</th>
          </>
        );
      case '户外大牌':
        return (
          <>
            <th className="px-4 py-3">形式</th>
            <th className="px-4 py-3">打光</th>
            <th className="px-4 py-3">车流量</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderDynamicCells = (item: InventoryItem) => {
    switch (selectedMediaType) {
      case '电梯框架':
        return (
          <>
            <td className="px-4 py-3">{item.building}</td>
            <td className="px-4 py-3">{item.unitNo}</td>
            <td className="px-4 py-3">{item.elevator}</td>
          </>
        );
      case '道闸':
        return (
          <>
            <td className="px-4 py-3">{item.direction}</td>
            <td className="px-4 py-3">{item.orientation}</td>
            <td className="px-4 py-3">{item.inOut}</td>
          </>
        );
      case '户外大牌':
        return (
          <>
            <td className="px-4 py-3">{item.format}</td>
            <td className="px-4 py-3">{item.illumination}</td>
            <td className="px-4 py-3">{item.traffic}</td>
          </>
        );
      default:
        return null;
    }
  };

  const renderListView = () => (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-border-dark">
            <tr>
              <th className="px-4 py-3">广告位编号</th>
              <th className="px-4 py-3">点位名称</th>
              {renderDynamicHeaders()}
              <th className="px-4 py-3">当前在刊客户</th>
              <th className="px-4 py-3">方案预定信息</th>
              <th className="px-4 py-3">最近可订时间</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">{item.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.pointName}</td>
                {renderDynamicCells(item)}
                <td className="px-4 py-3">
                  <span className={item.currentCustomer !== '-' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>{item.currentCustomer}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{item.bookingInfo}</td>
                <td className="px-4 py-3">
                  <span className={item.nextAvailable === '现在' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                    {item.nextAvailable}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    item.status === '空闲' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    item.status === '在刊' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    item.status === '预定' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium">加入预定</button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">没有找到符合条件的广告位</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGanttView = () => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span> 在刊档期</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span> 预定档期</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-600"></span> 空闲档期</div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Gantt Header */}
            <div className="flex border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
              <div className="w-48 flex-shrink-0 p-3 font-semibold text-xs text-slate-500 uppercase border-r border-border-light dark:border-border-dark">广告位</div>
              <div className="flex-1 flex">
                {days.map(day => (
                  <div key={day} className="flex-1 text-center py-2 text-xs text-slate-500 border-r border-border-light dark:border-border-dark last:border-r-0">
                    {day}日
                  </div>
                ))}
              </div>
            </div>
            {/* Gantt Body */}
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {filteredData.map(item => (
                <div key={item.id} className="flex hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-48 flex-shrink-0 p-3 border-r border-border-light dark:border-border-dark">
                    <div className="font-medium text-sm text-slate-900 dark:text-white truncate">{item.pointName}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{item.id}</div>
                  </div>
                  <div className="flex-1 relative bg-slate-50/50 dark:bg-slate-800/10 flex">
                    {/* Grid lines */}
                    {days.map(day => (
                      <div key={day} className="flex-1 border-r border-border-light/50 dark:border-border-dark/50 last:border-r-0"></div>
                    ))}
                    {/* Schedule Bars */}
                    {item.schedule.map((block, idx) => {
                      const left = `${((block.start - 1) / 30) * 100}%`;
                      const width = `${((block.end - block.start + 1) / 30) * 100}%`;
                      const isPublished = block.type === 'published';
                      return (
                        <div 
                          key={idx}
                          className={`absolute top-2 bottom-2 rounded-md shadow-sm flex items-center justify-center text-[10px] font-bold text-white overflow-hidden px-1 ${isPublished ? 'bg-blue-500/90' : 'bg-amber-500/90'}`}
                          style={{ left, width }}
                          title={`${block.customer} (${block.start}日 - ${block.end}日)`}
                        >
                          <span className="truncate">{block.customer}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="销控查询" subtitle="实时查询媒体资源的销售状态与档期。">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 shadow-sm">
              <span className="material-icons-outlined text-slate-400 text-[18px]">category</span>
              <select 
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer"
              >
                {mediaTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <span className="material-icons-outlined text-[18px]">list</span>
                列表视图
              </button>
              <button 
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${viewMode === 'gantt' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <span className="material-icons-outlined text-[18px]">calendar_view_month</span>
                档期图
              </button>
            </div>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">search</span>
                <input 
                  type="text" 
                  placeholder="搜索点位名称或编号..." 
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-4 py-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors flex items-center gap-2">
                <span className="material-icons-outlined text-[18px]">filter_list</span>
                高级筛选
              </button>
            </div>

            {/* Content */}
            {viewMode === 'list' ? renderListView() : renderGanttView()}
          </div>
        </div>
      </main>
    </div>
  );
}
