import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { planService } from '../services/planService';

interface Customer {
  id: string;
  name: string;
  industry: string;
  contact: string;
  phone: string;
  level: 'A' | 'B' | 'C';
  status: 'active' | 'inactive';
  lastContact: string;
  address?: string;
  planCount: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const plans = await planService.getAllPlans();
      
      // Extract unique customers from plans
      const customerMap = new Map<string, Customer>();
      plans.forEach((plan, index) => {
        if (!customerMap.has(plan.customer)) {
          customerMap.set(plan.customer, {
            id: `CUST-${String(index + 1).padStart(3, '0')}`,
            name: plan.customer,
            industry: '广告客户',
            contact: '待补充',
            phone: '待补充',
            level: 'A',
            status: 'active',
            lastContact: new Date().toISOString().split('T')[0],
            planCount: 1
          });
        } else {
          const existing = customerMap.get(plan.customer)!;
          existing.planCount++;
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('加载客户数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">加载客户数据中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="客户管理">
          <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
            <span className="material-icons-outlined text-[18px]">add</span>
            新增客户
          </button>
        </Header>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
              <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-slate-900 dark:text-white">客户列表 ({customers.length})</h3>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-4 font-medium">客户名称</th>
                    <th className="p-4 font-medium">行业</th>
                    <th className="p-4 font-medium">联系人</th>
                    <th className="p-4 font-medium">级别</th>
                    <th className="p-4 font-medium">状态</th>
                    <th className="p-4 font-medium">方案数</th>
                    <th className="p-4 font-medium">最近联系</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                  {customers.map(customer => (
                    <tr 
                      key={customer.id} 
                      onClick={() => setSelectedCustomer(customer)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {customer.name}
                        <div className="text-xs font-normal text-slate-500 font-mono mt-0.5">{customer.id}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{customer.industry}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900 dark:text-white">{customer.contact}</div>
                        <div className="text-xs text-slate-500">{customer.phone}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          customer.level === 'A' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          customer.level === 'B' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {customer.level}级
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          customer.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {customer.status === 'active' ? '活跃' : '停用'}
                        </span>
                      </td>
                      <td className="p-4 text-center font-medium text-slate-700 dark:text-slate-300">{customer.planCount}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">{customer.lastContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {customers.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  暂无客户数据
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
