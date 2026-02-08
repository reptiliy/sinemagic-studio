import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../Header';
import Footer from '../Footer';
import VideoGenerator from './VideoGenerator';
import { 
  User, Settings, LogOut, Shield, Video, Image as ImageIcon, 
  Box, CreditCard, LayoutDashboard, Sparkles, Zap
} from 'lucide-react';

type Tab = 'profile' | 'videos' | 'images' | 'models' | 'plans';

const UserProfile: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  
  // Profile Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setWebsite(profile.website || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        website,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Профиль успешно обновлен!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (view: any) => {
    if (view === 'home') window.location.href = '/';
  };

  const menuItems = [
    { id: 'profile', label: 'Мой Профиль', icon: User },
    { id: 'videos', label: 'Мои Видео', icon: Video },
    { id: 'images', label: 'Мои Изображения', icon: ImageIcon },
    { id: 'models', label: 'Модели', icon: Box },
    { id: 'plans', label: 'Тарифы', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-accent-purple/30">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none" />
      
      <Header onNavigate={handleNavigate} currentView="custom" />
      
      <main className="flex-grow pt-32 pb-20 px-6 container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* User Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan p-[2px] mb-4 shadow-xl shadow-accent-purple/20">
                <div className="w-full h-full rounded-full bg-[#0a0a0a] overflow-hidden">
                  {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img 
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <span className="text-2xl font-black text-white">
                        {fullName ? fullName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1 relative z-10">
                {fullName || 'Пользователь'}
              </h2>
              <p className="text-sm text-gray-400 mb-4 relative z-10">{user?.email}</p>
              
              <div className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between relative z-10">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Роль</span>
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  isAdmin ? 'bg-accent-purple/20 text-accent-purple' : 'bg-white/10 text-gray-300'
                }`}>
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-accent-purple to-accent-cyan text-white shadow-lg shadow-accent-purple/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="font-bold relative z-10">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="h-px bg-white/5 my-2" />
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-bold">Выйти</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Status Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-20">
                    <Shield className="w-32 h-32 text-accent-purple rotate-12" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-accent-cyan" />
                    Текущий статус
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                      <span className="text-gray-400 text-sm font-bold uppercase tracking-wider block mb-2">Тарифный план</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">Демо (Бесплатно)</span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/20">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                      <span className="text-gray-400 text-sm font-bold uppercase tracking-wider block mb-2">ID Аккаунта</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-mono text-white">{user?.id.slice(0, 8)}...</span>
                        <div className="text-xs text-gray-500">
                          Рег: {new Date(user?.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-accent-purple" />
                    Настройки профиля
                  </h3>

                  {message && (
                    <div className={`p-4 rounded-xl border mb-6 ${
                      message.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Email</label>
                        <input 
                          type="email" 
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Полное имя</label>
                        <input 
                          type="text" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                          placeholder="Ваше имя"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Вебсайт</label>
                        <input 
                          type="url" 
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent-purple/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                      >
                        {loading ? (
                          'Сохранение...'
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Сохранить изменения
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'videos' && <VideoGenerator />}

            {(activeTab === 'images' || activeTab === 'models') && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  {activeTab === 'images' && <ImageIcon className="w-10 h-10 text-gray-400" />}
                  {activeTab === 'models' && <Box className="w-10 h-10 text-gray-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {activeTab === 'images' && 'Генерация изображений'}
                  {activeTab === 'models' && 'Модели генерации'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  Этот раздел находится в разработке. Скоро здесь появятся инструменты для 
                  {activeTab === 'images' && ' генерации профессиональных изображений.'}
                  {activeTab === 'models' && ' выбора и настройки моделей искусственного интеллекта.'}
                </p>
                <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
                  Узнать когда будет доступно
                </button>
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CreditCard className="w-16 h-16 text-accent-purple mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Тарифные планы</h3>
                <p className="text-gray-400 mb-8">Выберите план, который подходит именно вам</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Free Plan */}
                  <div className="bg-black/40 border-2 border-accent-purple rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent-purple text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                      CURRENT
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Демо</h4>
                    <div className="text-3xl font-black text-white mb-4">₽0<span className="text-sm font-normal text-gray-400">/мес</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-accent-purple" /> 3 генерации в день
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-accent-purple" /> Стандартная скорость
                      </li>
                    </ul>
                  </div>
                  
                  {/* Pro Plan */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                    <h4 className="text-lg font-bold text-white mb-2">Pro</h4>
                    <div className="text-3xl font-black text-white mb-4">₽990<span className="text-sm font-normal text-gray-400">/мес</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-gray-400" /> 100 генераций в день
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-gray-400" /> Высокая скорость
                      </li>
                    </ul>
                    <button disabled className="w-full py-2 rounded-xl bg-white/10 text-gray-400 font-bold text-sm">Скоро</button>
                  </div>

                  {/* Max Plan */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                    <h4 className="text-lg font-bold text-white mb-2">Max</h4>
                    <div className="text-3xl font-black text-white mb-4">₽2990<span className="text-sm font-normal text-gray-400">/мес</span></div>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-gray-400" /> Безлимит
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Zap className="w-4 h-4 text-gray-400" /> Max качество
                      </li>
                    </ul>
                    <button disabled className="w-full py-2 rounded-xl bg-white/10 text-gray-400 font-bold text-sm">Скоро</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default UserProfile;