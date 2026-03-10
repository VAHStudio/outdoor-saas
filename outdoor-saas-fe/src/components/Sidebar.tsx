import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { type: 'divider', name: '资源运营' },
    { name: '社区管理', icon: 'apartment', path: '/communities' },
    { name: '道闸管理', icon: 'gate', path: '/barrier-gates' },
    { name: '框架管理', icon: 'grid_view', path: '/frames' },
    { type: 'divider', name: '方案管理' },
    { name: '方案列表', icon: 'psychology', path: '/plans' },
    { name: '方案社区', icon: 'location_on', path: '/plan-communities' },
    { name: '方案道闸', icon: 'directions_car', path: '/plan-barriers' },
    { name: '方案框架', icon: 'view_module', path: '/plan-frames' },
  ];

  return (
    <aside className="w-48 h-full bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 transition-colors duration-300 z-20">
      <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg mr-2 shadow-lg flex-shrink-0">
          O
        </div>
        <div className="overflow-hidden">
          <h1 className="font-display font-bold text-base tracking-tight text-text-light dark:text-text-dark truncate">Outdoor 4.0</h1>
          <p className="text-[9px] text-subtext-light dark:text-subtext-dark uppercase tracking-wider font-semibold truncate">AI SaaS 平台</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
        {navItems.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div key={index} className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-subtext-light dark:text-subtext-dark uppercase tracking-wider">{item.name}</p>
              </div>
            );
          }
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path!}
              className={clsx(
                "flex items-center px-3 py-2 rounded-lg transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-4 border-primary" 
                  : "text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
              )}
            >
              <span className={clsx("mr-3 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")}>
                <Icon name={item.icon!} size={20} />
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-surface-light dark:border-gray-600">
            {user?.realName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-light dark:text-text-dark truncate">
              {user?.realName || user?.username || '用户'}
            </p>
            <p className="text-xs text-subtext-light dark:text-subtext-dark truncate">
              {user?.role === 'ADMIN' ? '管理员' :
               user?.role === 'SALES' ? '销售经理' :
               user?.role === 'MEDIA' ? '媒介专员' :
               user?.role === 'ENGINEERING' ? '工程师' :
               user?.role === 'FINANCE' ? '财务经理' : '用户'}
            </p>
          </div>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-subtext-light hover:text-primary dark:text-subtext-dark dark:hover:text-white transition-colors"
            title="退出登录"
          >
            <Icon name="logout" size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
