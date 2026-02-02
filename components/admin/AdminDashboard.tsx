import React from 'react';
import { 
  Users, 
  Activity, 
  Globe, 
  Cpu 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visits: 4000, clicks: 2400 },
  { name: 'Tue', visits: 3000, clicks: 1398 },
  { name: 'Wed', visits: 2000, clicks: 9800 },
  { name: 'Thu', visits: 2780, clicks: 3908 },
  { name: 'Fri', visits: 1890, clicks: 4800 },
  { name: 'Sat', visits: 2390, clicks: 3800 },
  { name: 'Sun', visits: 3490, clicks: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Дашборд</h1>
          <p className="text-gray-400">С возвращением, Админ! Вот что происходит в вашей студии.</p>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300">
          Обновлено: Сегодня, 14:30
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Globe className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Globe className="w-6 h-6" />
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">+12%</span>
            </div>
            <h3 className="text-4xl font-black mb-1">Онлайн</h3>
            <p className="text-blue-100 text-sm font-medium">Статус сайта</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-br from-accent-purple to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">+254</span>
            </div>
            <h3 className="text-4xl font-black mb-1">1,204</h3>
            <p className="text-purple-100 text-sm font-medium">Всего посетителей</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-br from-accent-pink to-rose-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-500/20 relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">+5%</span>
            </div>
            <h3 className="text-4xl font-black mb-1">8.4с</h3>
            <p className="text-pink-100 text-sm font-medium">Ср. длительность</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl p-6 text-white shadow-lg shadow-gray-500/20 relative overflow-hidden group hover:scale-105 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">v1.0</span>
            </div>
            <h3 className="text-4xl font-black mb-1">Стабильно</h3>
            <p className="text-gray-300 text-sm font-medium">Здоровье системы</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#16213e] rounded-3xl p-8 border border-white/5 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Обзор трафика</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">День</button>
              <button className="px-4 py-2 bg-accent-purple text-white rounded-lg text-xs font-bold shadow-lg shadow-purple-500/20">Неделя</button>
              <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">Месяц</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f1a', borderColor: '#374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Log */}
        <div className="bg-[#16213e] rounded-3xl p-8 border border-white/5 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-6">Недавняя активность</h3>
          <div className="space-y-6">
             {[1, 2, 3, 4].map((item) => (
               <div key={item} className="flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                   <div className="w-2 h-2 rounded-full bg-accent-cyan"></div>
                 </div>
                 <div>
                   <p className="text-sm text-gray-300">Обновлен текст в <span className="text-white font-bold">блоке Hero</span>.</p>
                   <span className="text-xs text-gray-500">2 часа назад</span>
                 </div>
               </div>
             ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl bg-white/5 text-gray-400 font-bold text-sm hover:bg-white/10 hover:text-white transition-all border border-white/5">
            Смотреть весь лог
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;