import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// --- Types ---
interface Point {
  id: string;
  name: string;
  type: '社区' | '线路' | '站点' | '大牌';
  slotTypes: string[];
  totalSlots: number;
  availableSlots: number;
  address: string;
  photos: string[];
  lat?: number;
  lng?: number;
}

interface AdSlot {
  id: string;
  pointName: string;
  mediaType: string;
  location: string;
  specifications: string;
  price: number;
  unit: string;
  status: '正常' | '故障' | '停用' | '到期';
  photos: string[];
  // Dynamic fields
  building?: string; unitNo?: string; elevator?: string; // 框架
  direction?: string; orientation?: string; inOut?: string; // 道闸
  format?: string; illumination?: string; traffic?: string; // 大牌
}

// --- Mock Data ---
const mockPoints: Point[] = [
  { id: 'PT-001', name: '翠园社区', type: '社区', slotTypes: ['电梯框架', '道闸'], totalSlots: 25, availableSlots: 12, address: '南山区科技园南路88号', photos: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'] },
  { id: 'PT-002', name: '滨海大道跨线桥', type: '大牌', slotTypes: ['户外大牌'], totalSlots: 2, availableSlots: 0, address: '滨海大道与科苑路交汇处', photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'] },
];

const mockAdSlots: AdSlot[] = [
  // 电梯框架
  { id: 'SL-001-01', pointName: '翠园社区', mediaType: '电梯框架', location: 'A栋1单元', specifications: '45cm x 60cm', price: 300, unit: '周', status: '正常', photos: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'], building: 'A栋', unitNo: '1单元', elevator: '客梯1' },
  { id: 'SL-001-02', pointName: '翠园社区', mediaType: '电梯框架', location: 'A栋2单元', specifications: '45cm x 60cm', price: 300, unit: '周', status: '正常', photos: ['https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'], building: 'A栋', unitNo: '2单元', elevator: '客梯2' },
  // 道闸
  { id: 'SL-001-03', pointName: '翠园社区', mediaType: '道闸', location: '南门入口', specifications: '300cm x 80cm', price: 1200, unit: '月', status: '故障', photos: ['https://images.unsplash.com/photo-1621831336117-74b882eb03f3?auto=format&fit=crop&w=800&q=80'], direction: '南门', orientation: '朝外', inOut: '入口' },
  // 户外大牌
  { id: 'SL-002-01', pointName: '滨海大道跨线桥', mediaType: '户外大牌', location: '东向西方向', specifications: '18m x 6m', price: 85000, unit: '月', status: '正常', photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'], format: '三面翻', illumination: '外打光', traffic: '15万辆/日' },
];

const mediaTypes = ['电梯框架', '道闸', '户外大牌'];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<'points' | 'slots'>('points');
  const [isMapMode, setIsMapMode] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('电梯框架');
  
  const closeDrawer = () => {
    setSelectedPoint(null);
    setSelectedSlot(null);
  };

  const renderDynamicHeaders = () => {
    switch (selectedMediaType) {
      case '电梯框架':
        return <><th className="p-4 font-medium">楼栋</th><th className="p-4 font-medium">单元</th><th className="p-4 font-medium">电梯</th></>;
      case '道闸':
        return <><th className="p-4 font-medium">方位</th><th className="p-4 font-medium">朝向</th><th className="p-4 font-medium">进出口</th></>;
      case '户外大牌':
        return <><th className="p-4 font-medium">形式</th><th className="p-4 font-medium">打光</th><th className="p-4 font-medium">车流量</th></>;
      default:
        return null;
    }
  };

  const renderDynamicCells = (slot: AdSlot) => {
    switch (selectedMediaType) {
      case '电梯框架':
        return <><td className="p-4">{slot.building}</td><td className="p-4">{slot.unitNo}</td><td className="p-4">{slot.elevator}</td></>;
      case '道闸':
        return <><td className="p-4">{slot.direction}</td><td className="p-4">{slot.orientation}</td><td className="p-4">{slot.inOut}</td></>;
      case '户外大牌':
        return <><td className="p-4">{slot.format}</td><td className="p-4">{slot.illumination}</td><td className="p-4">{slot.traffic}</td></>;
      default:
        return null;
    }
  };

  const filteredSlots = mockAdSlots.filter(s => 
    s.mediaType === selectedMediaType &&
    (s.id.includes(searchTerm) || s.pointName.includes(searchTerm))
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 font-body transition-colors duration-200 antialiased h-screen flex overflow-hidden">
      {!isMapMode && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0B1120] relative">
        {!isMapMode && (
          <Header title="资源管理中心">
            <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mr-4">
              <button 
                onClick={() => { setActiveTab('points'); closeDrawer(); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'points' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                点位
              </button>
              <button 
                onClick={() => { setActiveTab('slots'); closeDrawer(); setIsMapMode(false); }}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'slots' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                广告位
              </button>
            </div>
            {activeTab === 'slots' && (
              <div className="flex items-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-1.5 shadow-sm mr-4">
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
            )}
            <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined text-[18px]">add</span>
              新增{activeTab === 'points' ? '点位' : '广告位'}
            </button>
          </Header>
        )}

        <div className="flex-1 overflow-hidden flex relative">
          {activeTab === 'points' && isMapMode ? (
             <div className="flex-1 flex overflow-hidden">
               <div className="w-80 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col z-10">
                 <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center gap-3">
                   <button onClick={() => setIsMapMode(false)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                     <span className="material-icons-outlined">arrow_back</span>
                   </button>
                   <h2 className="font-bold text-lg text-slate-900 dark:text-white">点位分布地图</h2>
                 </div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                   {mockPoints.map(point => (
                     <div key={point.id} onClick={() => setSelectedPoint(point)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedPoint?.id === point.id ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}>
                       <h4 className="font-bold text-sm text-slate-900 dark:text-white">{point.name}</h4>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="flex-1 relative bg-[#e5e7eb] dark:bg-[#1e293b]">
                 <img alt="Map background" className="w-full h-full object-cover opacity-60 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcqm1NMECgCdZM1kAfv8vQYeOSlZMDsSU4pvlwvQi13XnjaCbPZulVOL2CwV0lDSKHqmKLTL-T5blax4UpwQo6hlLP7154webQXTGSvVLqY4AEJ9I8fkXfnNqO8oxoqdA84vB40JIl8tbiaJwxefiT4UolYX37QCDyzJ7IRB9vFLe7VvB4kp1ftWx44jIw3VEWrjSt4LRTQ-sYCD6Lx4nKUsldhkxQ9ar7M-iDYlD2WvVXTCDHWVVOzKO42UivOeZtSrDBk5LCMIc"/>
               </div>
             </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="relative w-64">
                    <span className="material-icons-outlined absolute left-3 top-2 text-slate-400 text-[18px]">search</span>
                    <input type="text" placeholder={`搜索${activeTab === 'points' ? '点位名称...' : '广告位或点位...'}`} className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-sm focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  {activeTab === 'points' && (
                    <button onClick={() => setIsMapMode(true)} className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                      <span className="material-icons-outlined text-[16px]">map</span>地图模式
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  {activeTab === 'points' ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <th className="p-4 font-medium">点位名称</th>
                          <th className="p-4 font-medium">类型</th>
                          <th className="p-4 font-medium">包含广告位类型</th>
                          <th className="p-4 font-medium text-center">总数量</th>
                          <th className="p-4 font-medium text-center">空位数</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                        {mockPoints.filter(p => p.name.includes(searchTerm)).map(point => (
                          <tr key={point.id} onClick={() => setSelectedPoint(point)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <td className="p-4 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{point.name}<div className="text-xs font-normal text-slate-500 font-mono mt-0.5">{point.id}</div></td>
                            <td className="p-4"><span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{point.type}</span></td>
                            <td className="p-4"><div className="flex flex-wrap gap-1">{point.slotTypes.map((type, idx) => (<span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">{type}</span>))}</div></td>
                            <td className="p-4 text-center font-medium text-slate-700 dark:text-slate-300">{point.totalSlots}</td>
                            <td className="p-4 text-center"><span className={`font-bold ${point.availableSlots > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{point.availableSlots}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <th className="p-4 font-medium">广告位编号</th>
                          <th className="p-4 font-medium">所在点位</th>
                          <th className="p-4 font-medium">媒体类型</th>
                          {renderDynamicHeaders()}
                          <th className="p-4 font-medium">规格</th>
                          <th className="p-4 font-medium">刊例价</th>
                          <th className="p-4 font-medium">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-light dark:divide-border-dark text-sm">
                        {filteredSlots.map(slot => (
                          <tr key={slot.id} onClick={() => setSelectedSlot(slot)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <td className="p-4 font-mono text-xs font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{slot.id}</td>
                            <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{slot.pointName}</td>
                            <td className="p-4"><span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{slot.mediaType}</span></td>
                            {renderDynamicCells(slot)}
                            <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">{slot.specifications}</td>
                            <td className="p-4 font-medium text-slate-900 dark:text-white">¥ {slot.price.toLocaleString()} <span className="text-xs text-slate-500 font-normal">/{slot.unit}</span></td>
                            <td className="p-4"><span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${slot.status === '正常' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : slot.status === '故障' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : slot.status === '停用' ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{slot.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Slide-out Drawer */}
          <div className={`absolute inset-y-0 right-0 w-[400px] bg-white dark:bg-surface-dark shadow-2xl border-l border-border-light dark:border-border-dark transform transition-transform duration-300 ease-in-out flex flex-col z-20 ${selectedPoint || selectedSlot ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-outlined text-primary">{selectedPoint ? 'place' : 'ad_units'}</span>
                {selectedPoint ? '点位详情' : '广告位详情'}
              </h2>
              <button onClick={closeDrawer} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-icons-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Drawer Content (Simplified for brevity, similar to previous) */}
              {selectedSlot && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedSlot.pointName}</h3>
                  <p className="text-sm text-primary font-medium mb-4">{selectedSlot.mediaType} - {selectedSlot.id}</p>
                  <div className="aspect-video rounded-lg overflow-hidden border border-border-light dark:border-border-dark mb-4">
                    <img src={selectedSlot.photos[0]} alt="Current Ad" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-border-light dark:border-border-dark">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">规格尺寸</span><span className="font-medium text-slate-900 dark:text-white">{selectedSlot.specifications}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">刊例价</span><span className="font-medium text-emerald-600 dark:text-emerald-400">¥ {selectedSlot.price.toLocaleString()} / {selectedSlot.unit}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
