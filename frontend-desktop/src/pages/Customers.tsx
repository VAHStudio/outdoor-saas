import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Customer {
  id: string;
  name: string;
  industry: string;
  contact: string;
  phone: string;
  level: 'A' | 'B' | 'C';
  status: 'active' | 'inactive';
  lastContact: string;
  // Detail fields
  address?: string;
  website?: string;
  source?: string;
  notes?: string;
  history?: { date: string, type: string, desc: string }[];
  pastContracts?: { id: string, name: string, date: string, amount: string, status: string }[];
  historicalPlans?: { id: string, name: string, date: string, status: string }[];
}

const mockCustomers: Customer[] = [
  { 
    id: 'CUST-001', name: '星空传媒', industry: '广告代理', contact: '张伟', phone: '13800138000', level: 'A', status: 'active', lastContact: '2024-07-01', address: '深圳市南山区科技园南路88号', website: 'www.star-media.com', source: '主动开发', notes: '重点客户，主要投放户外大牌和地铁广告。', 
    history: [{ date: '2024-07-01', type: '拜访', desc: '沟通下半年投放计划' }, { date: '2024-06-15', type: '电话', desc: '确认夏季大促方案' }],
    pastContracts: [
      { id: 'SC-2023-089', name: '2023年度框架协议', date: '2023-01-10', amount: '¥ 1,200,000', status: '已完成' },
      { id: 'SC-2023-145', name: '国庆专项投放合同', date: '2023-08-20', amount: '¥ 350,000', status: '已完成' }
    ],
    historicalPlans: [
      { id: 'PL-2024-056', name: '2024夏季大促媒介方案', date: '2024-05-10', status: '已采纳' },
      { id: 'PL-2023-112', name: '双十一预热投放方案', date: '2023-09-15', status: '已采纳' }
    ]
  },
  { 
    id: 'CUST-002', name: '绿生活零售', industry: '快消品', contact: '李娜', phone: '13900139000', level: 'B', status: 'active', lastContact: '2024-06-28', address: '深圳市福田区深南大道6001号', website: 'www.green-life.com', source: '展会', notes: '新客户，尝试投放社区电梯框架。', 
    history: [{ date: '2024-06-28', type: '签约', desc: '签订框架广告合同' }],
    pastContracts: [],
    historicalPlans: [
      { id: 'PL-2024-088', name: '社区电梯框架试投方案', date: '2024-06-20', status: '已采纳' }
    ]
  },
  { 
    id: 'CUST-003', name: '海洋广告', industry: '广告代理', contact: '王强', phone: '13700137000', level: 'A', status: 'inactive', lastContact: '2024-05-10', address: '广州市天河区珠江新城', website: '-', source: '转介绍', notes: '近期预算缩减，暂停投放。', 
    history: [{ date: '2024-05-10', type: '电话', desc: '客户表示暂无投放需求' }],
    pastContracts: [
      { id: 'SC-2022-045', name: '2022年度合作协议', date: '2022-02-15', amount: '¥ 800,000', status: '已完成' }
    ],
    historicalPlans: [
      { id: 'PL-2024-012', name: '春季新品发布方案', date: '2024-03-05', status: '未采纳' }
    ]
  },
  { 
    id: 'CUST-004', name: '巅峰科技', industry: 'IT互联网', contact: '赵总', phone: '13600136000', level: 'A', status: 'active', lastContact: '2024-07-02', address: '北京市海淀区中关村', website: 'www.peak-tech.com', source: '主动开发', notes: '大客户，年度框架协议。', 
    history: [{ date: '2024-07-02', type: '拜访', desc: '季度回顾会议' }],
    pastContracts: [
      { id: 'SC-2024-005', name: '2024年度框架协议', date: '2024-01-05', amount: '¥ 2,500,000', status: '执行中' }
    ],
    historicalPlans: [
      { id: 'PL-2024-002', name: '2024年度媒介策略规划', date: '2023-12-10', status: '已采纳' }
    ]
  },
];

export default function Customers() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const closeDrawer = () => setSelectedCustomer(null);

  const renderDashboard = () => (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span className="material-icons-outlined text-[18px]">business</span>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">总客户数</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">1,245</div>
            <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
              <span className="material-icons-outlined text-[14px]">trending_up</span> 较上月增长 12%
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="material-icons-outlined text-[18px]">check_circle</span>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">活跃客户</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">892</div>
            <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
              <span className="material-icons-outlined text-[14px]">trending_up</span> 活跃率 71.6%
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <span className="material-icons-outlined text-[18px]">star</span>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">A级客户</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">156</div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              贡献 68% 营收
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <span className="material-icons-outlined text-[18px]">person_add</span>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">本月新增</div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">45</div>
            <div className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
              <span className="material-icons-outlined text-[14px]">trending_up</span> 较上月增长 5%
            </div>
          </div>
        </div>

        {/* Recent Customers List Component */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-icons-outlined text-primary">recent_actors</span>
              最近跟进客户
            </h3>
            <button 
              onClick={() => setViewMode('list')} 
              className="text-sm text-primary hover:text-blue-700 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              查看全部客户 <span className="material-icons-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-6 py-4">客户名称</th>
                  <th className="px-6 py-4">行业</th>
                  <th className="px-6 py-4">联系人</th>
                  <th className="px-6 py-4">级别</th>
                  <th className="px-6 py-4">最后跟进</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {mockCustomers.slice(0, 3).map(customer => (
                  <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{customer.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{customer.id}</div>
                    </td>
                    <td className="px-6 py-4">{customer.industry}</td>
                    <td className="px-6 py-4">{customer.contact}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        customer.level === 'A' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        customer.level === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>{customer.level}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{customer.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative w-64">
            <span className="material-icons-outlined absolute left-3 top-2 text-slate-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="搜索客户名称或编号..." 
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
            />
          </div>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5">
            <span className="material-icons-outlined text-[16px]">filter_list</span>
            高级筛选
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-border-light dark:border-border-dark">
              <tr>
                <th className="px-6 py-4">客户名称</th>
                <th className="px-6 py-4">行业</th>
                <th className="px-6 py-4">联系人</th>
                <th className="px-6 py-4">联系电话</th>
                <th className="px-6 py-4">级别</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">最后跟进</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {mockCustomers.map(customer => (
                <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{customer.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{customer.id}</div>
                  </td>
                  <td className="px-6 py-4">{customer.industry}</td>
                  <td className="px-6 py-4">{customer.contact}</td>
                  <td className="px-6 py-4 font-mono">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      customer.level === 'A' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      customer.level === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>{customer.level}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      customer.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>{customer.status === 'active' ? '活跃' : '沉睡'}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{customer.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="客户管理" subtitle="管理您的客户档案与跟进记录。">
          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <button 
                onClick={() => setViewMode('dashboard')}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span className="material-icons-outlined text-[18px]">dashboard</span>
                返回仪表盘
              </button>
            )}
            <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">person_add</span>
              新增客户
            </button>
          </div>
        </Header>

        <div className="flex-1 overflow-hidden flex relative">
          {viewMode === 'dashboard' ? renderDashboard() : renderList()}

          {/* Slide-out Drawer */}
          <div className={`absolute inset-y-0 right-0 w-[450px] bg-white dark:bg-surface-dark shadow-2xl border-l border-border-light dark:border-border-dark transform transition-transform duration-300 ease-in-out flex flex-col z-20 ${selectedCustomer ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-primary">business</span>
                客户详情
              </h2>
              <button onClick={closeDrawer} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-icons-outlined text-[20px]">close</span>
              </button>
            </div>
            
            {selectedCustomer && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      selectedCustomer.level === 'A' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      selectedCustomer.level === 'B' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>{selectedCustomer.level}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                      selectedCustomer.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>{selectedCustomer.status === 'active' ? '活跃' : '沉睡'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500 font-mono">{selectedCustomer.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-border-light dark:border-border-dark">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">联系人</div>
                    <div className="font-medium text-slate-900 dark:text-white">{selectedCustomer.contact}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">联系电话</div>
                    <div className="font-medium text-slate-900 dark:text-white font-mono">{selectedCustomer.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">所属行业</div>
                    <div className="font-medium text-slate-900 dark:text-white">{selectedCustomer.industry}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">客户来源</div>
                    <div className="font-medium text-slate-900 dark:text-white">{selectedCustomer.source}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-slate-500 mb-1">公司地址</div>
                    <div className="font-medium text-slate-900 dark:text-white">{selectedCustomer.address}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-[18px] text-slate-400">notes</span>
                    备注信息
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-border-light dark:border-border-dark">
                    {selectedCustomer.notes}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-[18px] text-slate-400">history</span>
                    跟进记录
                  </h4>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-600 before:to-transparent">
                    {selectedCustomer.history?.map((record, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <span className="material-icons-outlined text-[16px]">{record.type === '签约' ? 'edit_document' : record.type === '拜访' ? 'directions_run' : 'phone'}</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-surface-dark p-4 rounded border border-border-light dark:border-border-dark shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{record.type}</div>
                            <time className="font-mono text-xs text-slate-500">{record.date}</time>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 text-xs">{record.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCustomer.pastContracts && selectedCustomer.pastContracts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-[18px] text-slate-400">description</span>
                      过往合作合同
                    </h4>
                    <div className="space-y-2">
                      {selectedCustomer.pastContracts.map((contract, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-border-light dark:border-border-dark flex justify-between items-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
                          <div>
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{contract.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                              <span className="font-mono">{contract.id}</span>
                              <span>|</span>
                              <span>{contract.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{contract.amount}</div>
                            <div className={`text-[10px] font-medium mt-1 inline-flex px-1.5 py-0.5 rounded ${
                              contract.status === '已完成' ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>{contract.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCustomer.historicalPlans && selectedCustomer.historicalPlans.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-icons-outlined text-[18px] text-slate-400">psychology</span>
                      历史方案清单
                    </h4>
                    <div className="space-y-2">
                      {selectedCustomer.historicalPlans.map((plan, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-border-light dark:border-border-dark flex justify-between items-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
                          <div>
                            <div className="font-medium text-sm text-slate-900 dark:text-white">{plan.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                              <span className="font-mono">{plan.id}</span>
                              <span>|</span>
                              <span>{plan.date}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`text-[10px] font-medium inline-flex px-1.5 py-0.5 rounded ${
                              plan.status === '已采纳' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}>{plan.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {selectedCustomer && (
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10 md:hidden" onClick={closeDrawer} />
          )}
        </div>
      </main>
    </div>
  );
}
