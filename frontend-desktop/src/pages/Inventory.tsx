import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { communityService } from '../services/communityService';

interface InventoryItem {
  id: string;
  name: string;
  community: string;
  mediaType: string;
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  dateRange: string;
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [communities, barriers, frames] = await Promise.all([
        communityService.getAllCommunities(),
        communityService.getBarrierGates(),
        communityService.getFrames()
      ]);

      const items: InventoryItem[] = [
        ...barriers.map((barrier, idx) => {
          const community = communities.find(c => c.id === barrier.communityId);
          return {
            id: barrier.gateNo,
            name: barrier.doorLocation,
            community: community?.buildingName || '未知社区',
            mediaType: '道闸',
            status: barrier.releaseStatus === 0 ? 'available' : barrier.releaseStatus === 1 ? 'occupied' : 'maintenance',
            price: 1200,
            dateRange: barrier.releaseDateBegin && barrier.releaseDateEnd 
              ? \`\${barrier.releaseDateBegin} ~ \${barrier.releaseDateEnd}\`
              : '全年可投'
          };
        }),
        ...frames.map((frame, idx) => {
          const community = communities.find(c => c.id === frame.communityId);
          return {
            id: frame.frameNo,
            name: \`\${frame.building} \${frame.unit}\`,
            community: community?.buildingName || '未知社区',
            mediaType: '电梯框架',
            status: frame.releaseStatus === 0 ? 'available' : frame.releaseStatus === 1 ? 'occupied' : 'maintenance',
            price: 300,
            dateRange: frame.releaseDateBegin && frame.releaseDateEnd
              ? \`\${frame.releaseDateBegin} ~ \${frame.releaseDateEnd}\`
              : '全年可投'
          };
        })
      ];

      setInventory(items);
    } catch (err) {
      console.error('加载库存数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = filterStatus === 'all' 
    ? inventory 
    : inventory.filter(item => item.status === filterStatus);

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">加载库存数据中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        <Header title="库存查询">
          <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 shadow-sm mr-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 p-0 pr-6 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="available">可售</option>
              <option value="occupied">已售</option>
              <option value="maintenance">维护中</option>
            </select>
          </div>
        </Header>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
              <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  资源库存 ({filteredInventory.length} / {inventory.length})
                </h3>
              </div>
              
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="p-4 font-medium">资源编号</th>
                    <th className="p-4 font-medium">名称</th>
                    <th className="p-4 font-medium">所属社区</th>
                    <th className="p-4 font-medium">媒体类型</th>
                    <th className="p-4 font-medium">价格</th>
                    <th className="p-4 font-medium">档期</th>
                    <th className="p-4 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-900 dark:text-white">{item.id}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{item.community}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.mediaType}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">¥{item.price}/月</td>
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{item.dateRange}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'available' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : item.status === 'occupied'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {item.status === 'available' ? '可售' : item.status === 'occupied' ? '已售' : '维护中'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredInventory.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  暂无库存数据
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
