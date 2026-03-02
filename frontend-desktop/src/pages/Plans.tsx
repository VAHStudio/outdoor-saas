import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// --- Types ---
interface AdSlot {
  id: string;
  name: string;
  price: number;
  status: string;
}

interface Point {
  id: string;
  name: string;
  location: string;
  slots: AdSlot[];
}

type PlanStatus = 'draft' | 'communicating' | 'pending' | 'signed';

interface Plan {
  id: string;
  title: string;
  customer: string;
  status: PlanStatus;
  budget: number;
  requirements: string;
  mediaTypes: string[];
  points: Point[];
  mockups: string[];
  updatedAt: string;
}

// --- Mock Data ---
const mockPlans: Plan[] = [
  {
    id: 'PLN-001',
    title: '星空传媒 2024 Q3 品牌焕新',
    customer: '星空传媒',
    status: 'communicating',
    budget: 500000,
    requirements: '覆盖市中心核心商圈，提升品牌年轻化形象，要求高人流量和强视觉冲击力。',
    mediaTypes: ['LED大屏', '地铁灯箱'],
    updatedAt: '2024-06-15',
    points: [
      {
        id: 'PT-101',
        name: '市中心商业街',
        location: '市中心',
        slots: [
          { id: 'SL-101-1', name: '入口主屏 A', price: 12000, status: 'available' },
          { id: 'SL-101-2', name: '广场侧屏 B', price: 9800, status: 'available' }
        ]
      },
      {
        id: 'PT-102',
        name: '科技园地铁站',
        location: '科技园',
        slots: [
          { id: 'SL-102-1', name: 'A出口通道灯箱', price: 4500, status: 'available' },
          { id: 'SL-102-2', name: '站厅包柱', price: 8000, status: 'available' }
        ]
      }
    ],
    mockups: [
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'PLN-002',
    title: '绿地集团 新盘发售宣传',
    customer: '绿地集团',
    status: 'pending',
    budget: 300000,
    requirements: '针对高净值人群，覆盖高端住宅区及周边主干道，强调品质感。',
    mediaTypes: ['户外看板', '社区道闸'],
    updatedAt: '2024-06-18',
    points: [
      {
        id: 'PT-201',
        name: '滨海大道',
        location: '南山区',
        slots: [
          { id: 'SL-201-1', name: '跨线桥高炮', price: 25000, status: 'available' }
        ]
      }
    ],
    mockups: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'PLN-003',
    title: '蓝天科技 新品发布会预热',
    customer: '蓝天科技',
    status: 'signed',
    budget: 800000,
    requirements: '全城核心地段霸屏，制造话题热度，配合线上社交媒体传播。',
    mediaTypes: ['LED大屏', '地标建筑灯光秀'],
    updatedAt: '2024-06-20',
    points: [],
    mockups: []
  },
  {
    id: 'PLN-004',
    title: '本地生活APP 社区下沉推广',
    customer: '某互联网公司',
    status: 'draft',
    budget: 150000,
    requirements: '精准覆盖大型居住社区，高频次曝光，引导扫码下载。',
    mediaTypes: ['电梯海报', '社区门禁'],
    updatedAt: '2024-06-22',
    points: [],
    mockups: []
  }
];

const columns: { id: PlanStatus; title: string; color: string }[] = [
  { id: 'draft', title: '草稿', color: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
  { id: 'communicating', title: '沟通中', color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' },
  { id: 'pending', title: '待确认', color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' },
  { id: 'signed', title: '已签约', color: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' }
];

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isMapMode, setIsMapMode] = useState(false);
  const [expandedPoints, setExpandedPoints] = useState<string[]>([]);

  // --- Handlers ---
  const togglePointExpand = (pointId: string) => {
    setExpandedPoints(prev => 
      prev.includes(pointId) ? prev.filter(id => id !== pointId) : [...prev, pointId]
    );
  };

  const toggleAllPoints = () => {
    if (!selectedPlan) return;
    if (expandedPoints.length === selectedPlan.points.length) {
      setExpandedPoints([]); // Collapse all
    } else {
      setExpandedPoints(selectedPlan.points.map(p => p.id)); // Expand all
    }
  };

  // --- Render Kanban ---
  const renderKanban = () => (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map(col => {
        const columnPlans = mockPlans.filter(p => p.status === col.id);
        return (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/20 rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-100 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.color.split(' ')[0]}`}></span>
                <h3 className="font-bold text-slate-800 dark:text-white">{col.title}</h3>
              </div>
              <span className="text-xs font-medium bg-white dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400 shadow-sm">
                {columnPlans.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
              {columnPlans.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setExpandedPoints(plan.points.map(p => p.id)); // Default expand all on open
                  }}
                  className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark cursor-pointer hover:shadow-md hover:border-primary transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{plan.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${col.color}`}>
                      {col.title}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{plan.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{plan.customer}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plan.mediaTypes.map((type, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border-light dark:border-border-dark">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">¥ {(plan.budget / 10000).toFixed(1)}w</span>
                    <span className="text-[10px] text-slate-400">{plan.updatedAt}</span>
                  </div>
                </div>
              ))}
              {columnPlans.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-xl text-slate-400 text-sm">
                  暂无方案
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- Render Details ---
  const renderDetails = () => {
    if (!selectedPlan) return null;
    const isAllExpanded = expandedPoints.length === selectedPlan.points.length && selectedPlan.points.length > 0;

    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header Info */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedPlan.title}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${columns.find(c => c.id === selectedPlan.status)?.color}`}>
                  {columns.find(c => c.id === selectedPlan.status)?.title}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{selectedPlan.id} · 更新于 {selectedPlan.updatedAt}</p>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">edit</span>
              编辑方案
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">客户</span>
              <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-slate-400 text-[18px]">business</span>
                {selectedPlan.customer}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">预算</span>
              <p className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="material-icons-outlined text-emerald-500 text-[18px]">payments</span>
                ¥ {selectedPlan.budget.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">媒体类型</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPlan.mediaTypes.map((type, idx) => (
                  <span key={idx} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-3 space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">需求说明</span>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-border-light dark:border-border-dark leading-relaxed">
                {selectedPlan.requirements}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Points */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-icons-outlined text-primary">place</span>
              选点列表 ({selectedPlan.points.length} 个点位)
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleAllPoints}
                className="text-sm text-primary hover:text-blue-700 font-medium transition-colors"
              >
                {isAllExpanded ? '一键折叠' : '一键展开'}
              </button>
              <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                <button 
                  onClick={() => setIsMapMode(false)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${!isMapMode ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <span className="material-icons-outlined text-[16px]">list</span>
                  列表
                </button>
                <button 
                  onClick={() => setIsMapMode(true)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${isMapMode ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <span className="material-icons-outlined text-[16px]">map</span>
                  地图
                </button>
              </div>
            </div>
          </div>

          {isMapMode ? (
            <div className="h-[500px] relative bg-[#e5e7eb] dark:bg-[#1e293b]">
              <img alt="Map background" className="w-full h-full object-cover opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcqm1NMECgCdZM1kAfv8vQYeOSlZMDsSU4pvlwvQi13XnjaCbPZulVOL2CwV0lDSKHqmKLTL-T5blax4UpwQo6hlLP7154webQXTGSvVLqY4AEJ9I8fkXfnNqO8oxoqdA84vB40JIl8tbiaJwxefiT4UolYX37QCDyzJ7IRB9vFLe7VvB4kp1ftWx44jIw3VEWrjSt4LRTQ-sYCD6Lx4nKUsldhkxQ9ar7M-iDYlD2WvVXTCDHWVVOzKO42UivOeZtSrDBk5LCMIc"/>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-border-light dark:border-border-dark text-sm font-medium text-slate-600 dark:text-slate-300">
                  地图模式预览 (共 {selectedPlan.points.length} 个标记点)
                </div>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {selectedPlan.points.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  暂无选点数据
                </div>
              ) : (
                selectedPlan.points.map(point => {
                  const isExpanded = expandedPoints.includes(point.id);
                  return (
                    <div key={point.id} className="bg-white dark:bg-surface-dark">
                      {/* Point Header */}
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        onClick={() => togglePointExpand(point.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-icons-outlined text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                            chevron_right
                          </span>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{point.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{point.location} · 包含 {point.slots.length} 个广告位</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{point.id}</span>
                      </div>
                      
                      {/* Ad Slots (Level 2) */}
                      {isExpanded && (
                        <div className="bg-slate-50 dark:bg-slate-800/30 border-t border-border-light dark:border-border-dark p-4 pl-12">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-border-dark">
                                <th className="pb-2 font-medium">广告位编号</th>
                                <th className="pb-2 font-medium">广告位名称</th>
                                <th className="pb-2 font-medium">状态</th>
                                <th className="pb-2 font-medium text-right">单价</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                              {point.slots.map(slot => (
                                <tr key={slot.id} className="text-sm">
                                  <td className="py-3 font-mono text-xs text-slate-500">{slot.id}</td>
                                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{slot.name}</td>
                                  <td className="py-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                      可售
                                    </span>
                                  </td>
                                  <td className="py-3 text-right text-slate-600 dark:text-slate-300">¥ {slot.price.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Mockups */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <span className="material-icons-outlined text-primary">image</span>
            设计小样图
          </h2>
          {selectedPlan.mockups.length === 0 ? (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-xl text-slate-400 text-sm">
              暂无设计图
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedPlan.mockups.map((url, idx) => (
                <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-border-light dark:border-border-dark group relative cursor-pointer">
                  <img src={url} alt={`Mockup ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">zoom_in</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="广告方案管理">
          {selectedPlan ? (
            <button 
              onClick={() => setSelectedPlan(null)}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <span className="material-icons-outlined text-[18px]">arrow_back</span>
              返回看板
            </button>
          ) : (
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">add</span>
              创建方案
            </button>
          )}
        </Header>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {selectedPlan ? renderDetails() : renderKanban()}
          </div>
        </div>
      </main>
    </div>
  );
}
