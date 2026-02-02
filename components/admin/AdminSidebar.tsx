import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  User,
  ShoppingBag
} from 'lucide-react';

import { useAuth } from '../../AuthContext';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-[#1a1a2e] text-white flex flex-col border-r border-white/5 fixed left-0 top-0">
      {/* User Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-white/5 bg-[#16213e]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan p-1 mb-3">
          <div className="w-full h-full rounded-full bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
             <User className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <h3 className="font-bold text-lg">Администратор</h3>
        <span className="text-xs text-green-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          В сети
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-accent-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Дашборд</span>
        </NavLink>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2 px-4">КОНТЕНТ</div>

        <NavLink 
          to="/admin/content" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-accent-cyan text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">Тексты и Блоки</span>
        </NavLink>

        <NavLink 
          to="/admin/media" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-accent-pink text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <ImageIcon className="w-5 h-5" />
          <span className="font-medium">Медиа Галерея</span>
        </NavLink>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2 px-4">МАГАЗИН</div>

        <NavLink 
          to="/admin/store" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">Заказы и Товары</span>
        </NavLink>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-6 mb-2 px-4">СИСТЕМА</div>

        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-accent-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Настройки</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;