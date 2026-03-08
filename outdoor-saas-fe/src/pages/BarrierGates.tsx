import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { barrierGateService } from '../services/barrierGateService';
import type { BarrierGate } from '../services/barrierGateService';
import type { PageResult } from '../types/query';
import Pagination from '../components/Pagination';

export default function BarrierGates() {
  const navigate = useNavigate();
  const [barrierGates, setBarrierGates] = useState<BarrierGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadBarrierGates();
  }, [currentPage, pageSize]);

  const loadBarrierGates = async () => {
    try {
      setLoading(true);
      // 使用分页查询代替全量查询
      const result = await barrierGateService.filterPage({
        pageNum: currentPage,
        pageSize: pageSize
      });
      
      // 处理返回结果
      if (Array.isArray(result)) {
        // 如果返回的是数组（旧接口），直接使用
        setBarrierGates(result);
        setTotal(result.length);
      } else {
        // 如果返回的是 PageResult 对象
        const pageResult = result as PageResult<BarrierGate>;
        setBarrierGates(pageResult.list || []);
        setTotal(pageResult.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 处理每页条数变化
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-subtext-light dark:text-subtext-dark">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">道闸管理</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          新增道闸
        </button>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">道闸编号</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">设备编号</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">门位置</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">社区ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {barrierGates.map((gate) => (
              <tr 
                key={gate.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/barrier-gates/${gate.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">{gate.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">{gate.gateNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark">{gate.deviceNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark">{gate.doorLocation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-subtext-light dark:text-subtext-dark">{gate.communityId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={() => navigate(`/barrier-gates/${gate.id}`)}
                  >
                    查看
                  </button>
                  <button className="text-primary hover:text-primary/80 transition-colors">编辑</button>
                  <button className="text-red-500 hover:text-red-600 transition-colors">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页组件 */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
