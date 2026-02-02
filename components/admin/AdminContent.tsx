import React, { useState, useEffect, useMemo } from 'react';
import { useContent } from '../../ContentContext';
import { translations as staticTranslations } from '../../translations';
import { 
  Save, RefreshCw, Layout, Type, Video, 
  Eye, EyeOff, Search, Check, ChevronRight,
  Globe, Edit3, Grid, ToggleLeft, ToggleRight,
  ShoppingBag, Plus, Trash2, Image as ImageIcon,
  FileText, ExternalLink
} from 'lucide-react';

// Helper to flatten object
function flattenKeys(obj: any, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const nested = flattenKeys(obj[key], prefix + key + '.');
      result = { ...result, ...nested };
    } else {
      result[prefix + key] = String(obj[key]);
    }
  }
  return result;
}

const SECTION_NAMES: Record<string, string> = {
  header: 'Шапка (Header)',
  home: 'Главная (Hero)',
  hero_marquee: 'Бегущая строка',
  store: 'Магазин (Store)',
  showcase: 'Витрина (Showcase)',
  video: 'Видео секция',
  bento: 'Сетка (Bento)',
  cta: 'Призыв (CTA)',
  about: 'О нас',
  help: 'Помощь',
  price: 'Цены',
  footer: 'Подвал (Footer)'
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  header: <Layout className="w-5 h-5" />,
  home: <Grid className="w-5 h-5" />,
  hero_marquee: <Type className="w-5 h-5" />,
  showcase: <Grid className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  store: <ShoppingBag className="w-5 h-5" />,
  bento: <Layout className="w-5 h-5" />,
  cta: <Type className="w-5 h-5" />,
  about: <Edit3 className="w-5 h-5" />,
  help: <Check className="w-5 h-5" />,
  price: <Layout className="w-5 h-5" />,
  footer: <Layout className="w-5 h-5" />
};

const AVAILABLE_VIDEOS = [
  '/videos/1.mp4',
  '/videos/2.mp4',
  '/videos/3.mp4',
  '/videos/4.mp4',
  '/videos/5.mp4',
  '/videos/6.mp4',
  '/videos/7.mp4',
  '/videos/8.mp4',
  '/videos/9.mp4',
];

const AdminContent: React.FC = () => {
  const { 
    translations, sections, loading, updateTranslation, toggleSection, refreshContent,
    products, addProduct, updateProduct, deleteProduct,
    pages, addPage, updatePage, deletePage
  } = useContent();
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'sections' | 'content' | 'video' | 'pages'>('sections');
  const [activeGroup, setActiveGroup] = useState<string>('header'); // For content tab sidebar
  const [filter, setFilter] = useState('');
  const [currentLang, setCurrentLang] = useState('ru');

  // Page Management State
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [newPage, setNewPage] = useState({ title: '', slug: '', content: '', isVisible: true });

  // Batch Save State
  const [pendingSectionChanges, setPendingSectionChanges] = useState<Record<string, boolean>>({});
  const [isGlobalSaving, setIsGlobalSaving] = useState(false);

  // Product Management State (re-declaring if missing or ensuring existence)
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', category: '', description: '', isVisible: true });


  const staticFlatValues = useMemo(() => {
     return flattenKeys(staticTranslations[currentLang as 'ru' | 'en' | 'de' | 'uk'] || staticTranslations['ru']);
  }, [currentLang]);

  const getEffectiveValue = (key: string) => {
      return translations[key]?.[currentLang] ?? staticFlatValues[key] ?? '';
  };

  useEffect(() => {
    const flat: Record<string, string> = {};
    const staticFlatRu = flattenKeys(staticTranslations['ru']); 
    
    Object.keys(staticFlatRu).forEach(key => {
        flat[key] = staticFlatValues[key] || '';
    });

    Object.keys(translations).forEach(key => {
      if (translations[key][currentLang]) {
          flat[key] = translations[key][currentLang];
      }
    });
    
    setEditValues(flat);
  }, [translations, currentLang, staticFlatValues]);

  const handleTextChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const hasUnsavedChanges = useMemo(() => {
    const hasTextChanges = Object.keys(editValues).some(key => editValues[key] !== getEffectiveValue(key));
    const hasSectionChanges = Object.keys(pendingSectionChanges).length > 0;
    return hasTextChanges || hasSectionChanges;
  }, [editValues, pendingSectionChanges, translations, currentLang]);

  const handleSaveAll = async () => {
    setIsGlobalSaving(true);
    try {
      // Save Sections
      const sectionPromises = Object.entries(pendingSectionChanges).map(([id, isVisible]) => 
        toggleSection(id, isVisible)
      );
      
      // Save Texts
      const textPromises = Object.keys(editValues)
        .filter(key => editValues[key] !== getEffectiveValue(key))
        .map(key => updateTranslation(key, editValues[key], currentLang));
      
      await Promise.all([...sectionPromises, ...textPromises]);
      
      setPendingSectionChanges({});
      // Optional: Show success notification
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении');
    } finally {
      setIsGlobalSaving(false);
    }
  };

  const handleSaveText = async (key: string) => {
    const originalValue = getEffectiveValue(key);
    if (editValues[key] === originalValue) return;

    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      await updateTranslation(key, editValues[key], currentLang);
    } catch (error) {
      alert('Ошибка сохранения');
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleToggleSection = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const originalStatus = sections[id] !== false;
    
    setPendingSectionChanges(prev => {
      const next = { ...prev };
      if (newStatus === originalStatus) {
        delete next[id];
      } else {
        next[id] = newStatus;
      }
      return next;
    });
  };

  const groupedTranslations = useMemo(() => {
    return Object.keys(editValues).reduce((acc, key) => {
      const group = key.split('.')[0];
      if (!acc[group]) acc[group] = [];
      acc[group].push(key);
      return acc;
    }, {} as Record<string, string[]>);
  }, [editValues]);

  const KNOWN_SECTIONS = ['header', 'home', 'hero_marquee', 'showcase', 'video', 'store', 'bento', 'cta', 'about', 'help', 'price', 'footer'];
  const allSectionIds = Array.from(new Set([...Object.keys(sections), ...KNOWN_SECTIONS]));

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            CMS Панель
          </h2>
          <p className="text-gray-400 text-sm mt-1">Управляйте контентом и структурой сайта</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={currentLang} 
              onChange={(e) => setCurrentLang(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer hover:bg-black/60 transition-colors"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="uk">Українська</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
            </div>
          </div>

          <button 
            onClick={() => refreshContent()}
            className="p-2.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl transition-all active:scale-95"
            title="Обновить данные"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges || isGlobalSaving}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
              hasUnsavedChanges 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-95' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGlobalSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span className="hidden md:inline">Сохранить</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-fit overflow-x-auto">
        {[
          { id: 'sections', label: 'Структура', icon: Layout },
          { id: 'content', label: 'Контент', icon: Edit3 },
          { id: 'video', label: 'Видео', icon: Video },
          { id: 'pages', label: 'Страницы', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {/* SECTIONS TAB */}
        {activeTab === 'sections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSectionIds.map((id) => {
              const isVisible = pendingSectionChanges[id] !== undefined 
                ? pendingSectionChanges[id] 
                : (sections[id] !== false);
              return (
                <div  
                  key={id} 
                  className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 ${
                    isVisible 
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border-purple-500/30 shadow-lg shadow-purple-900/10' 
                      : 'bg-black/40 border-white/5 grayscale opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isVisible ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-500'}`}>
                      {SECTION_ICONS[id] || <Layout className="w-5 h-5" />}
                    </div>
                    <button
                      onClick={() => handleToggleSection(id, isVisible)}
                      className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                        isVisible ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${isVisible ? 'text-white' : 'text-gray-400'}`}>
                      {SECTION_NAMES[id] || id}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">ID: {id}</p>
                  </div>

                  <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
                    isVisible ? 'w-full bg-purple-500' : 'w-0 bg-gray-600'
                  }`} />
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0 space-y-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              
              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.keys(groupedTranslations).map(group => (
                  <button
                    key={group}
                    onClick={() => setActiveGroup(group)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeGroup === group 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{group}</span>
                      {activeGroup === group && <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-6 min-h-[600px]">
              <h3 className="text-xl font-bold text-white mb-6 capitalize flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                Редактирование: {activeGroup}
              </h3>

              <div className="space-y-6">
                {groupedTranslations[activeGroup]
                  ?.filter(key => key.toLowerCase().includes(filter.toLowerCase()) || editValues[key]?.toLowerCase().includes(filter.toLowerCase()))
                  .map(key => {
                    const isChanged = editValues[key] !== getEffectiveValue(key);
                    const isLongText = key.includes('desc') || key.includes('p1') || key.includes('p2') || key.includes('p3') || key.includes('p4') || key.includes('p5');
                    const isVideoUrl = key.includes('url') && key.includes('video');

                    return (
                      <div key={key} className="group relative">
                        <label className="block text-xs font-mono text-gray-500 mb-2 ml-1">{key}</label>
                        <div className="relative">
                          {isLongText ? (
                            <textarea
                              value={editValues[key]}
                              onChange={(e) => handleTextChange(key, e.target.value)}
                              className={`w-full bg-black/40 border rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:ring-2 transition-all min-h-[120px] resize-y ${
                                isChanged ? 'border-yellow-500/50 focus:ring-yellow-500/20' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20'
                              }`}
                            />
                          ) : isVideoUrl ? (
                            <div className="relative">
                              <select
                                value={editValues[key]}
                                onChange={(e) => handleTextChange(key, e.target.value)}
                                className={`w-full bg-black/40 border rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                                  isChanged ? 'border-yellow-500/50 focus:ring-yellow-500/20' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20'
                                }`}
                              >
                                <option value="" className="bg-gray-900 text-white">Выберите видео...</option>
                                {AVAILABLE_VIDEOS.map(video => (
                                  <option key={video} value={video} className="bg-gray-900 text-white">
                                    {video}
                                  </option>
                                ))}
                              </select>
                              <Video className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={editValues[key]}
                              onChange={(e) => handleTextChange(key, e.target.value)}
                              className={`w-full bg-black/40 border rounded-xl px-4 py-3 pr-20 text-white focus:outline-none focus:ring-2 transition-all ${
                                isChanged ? 'border-yellow-500/50 focus:ring-yellow-500/20' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20'
                              }`}
                            />
                          )}
                          
                          {/* Save Action */}
                          <div className={`absolute right-2 bottom-2 flex items-center gap-2 transition-opacity ${isChanged || saving[key] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {isChanged && (
                              <button
                                onClick={() => handleTextChange(key, getEffectiveValue(key))}
                                className="p-1.5 text-gray-400 hover:text-white bg-black/60 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Сбросить"
                              >
                                <span className="text-xs">✕</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleSaveText(key)}
                              disabled={!isChanged || saving[key]}
                              className={`p-2 rounded-lg transition-all ${
                                isChanged 
                                  ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
                                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
                              }`}
                              title="Сохранить"
                            >
                              {saving[key] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* VIDEO TAB */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Video className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Медиа Галерея (Showcase)</h3>
                  <p className="text-gray-400">Управление видео-роликами на главной странице (6 слотов)</p>
                </div>
              </div>

              {/* Main Section Toggle */}
              <div className="flex items-center justify-between p-5 bg-black/40 rounded-xl border border-white/10 mb-8">
                <div>
                  <h4 className="font-bold text-white">Показывать секцию галереи</h4>
                  <p className="text-sm text-gray-500">Включить/выключить весь блок на сайте</p>
                </div>
                <button
                  onClick={() => handleToggleSection('showcase', sections['showcase'] !== false)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    sections['showcase'] !== false ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sections['showcase'] !== false ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Individual Videos */}
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const urlKey = `showcase.video_${num}_url`;
                  const labelKey = `showcase.video_${num}_label`;
                  const sectionKey = `showcase_video_${num}`;
                  const isVisible = pendingSectionChanges[sectionKey] !== undefined 
                    ? pendingSectionChanges[sectionKey] 
                    : (sections[sectionKey] !== false);

                  return (
                    <div key={num} className="bg-black/20 rounded-xl border border-white/5 p-4 md:p-6 transition-all hover:border-white/10">
                      <div className="flex flex-col md:flex-row gap-4 md:items-start">
                        {/* Video Preview / Number */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <span className="text-2xl font-bold text-white/20">#{num}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-white flex items-center gap-2">
                              Видео слот #{num}
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isVisible ? 'Активен' : 'Скрыт'}
                              </span>
                            </h5>
                            
                            {/* Toggle Visibility */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Показывать</span>
                              <div 
                                onClick={() => handleToggleSection(sectionKey, isVisible)}
                                className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${
                                  isVisible ? 'bg-purple-600' : 'bg-gray-700'
                                }`}
                              >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  isVisible ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                              </div>
                            </label>
                          </div>

                          {/* Inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* URL Input */}
                            <div className="space-y-1">
                              <label className="text-xs text-gray-500 ml-1">Ссылка на видео (mp4)</label>
                              <div className="relative flex gap-2">
                                <div className="relative flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    value={editValues[urlKey] || ''}
                                    onChange={(e) => handleTextChange(urlKey, e.target.value)}
                                    placeholder="/videos/..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                                  />
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) handleTextChange(urlKey, e.target.value);
                                    }}
                                    className="w-8 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors cursor-pointer appearance-none text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    title="Выбрать из доступных"
                                  >
                                    <option value="">▼</option>
                                    {AVAILABLE_VIDEOS.map(video => (
                                      <option key={video} value={video} className="bg-gray-900 text-white text-left">
                                        {video.split('/').pop()}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  onClick={() => handleSaveText(urlKey)}
                                  disabled={editValues[urlKey] === getEffectiveValue(urlKey) || saving[urlKey]}
                                  className={`px-3 rounded-lg transition-all ${
                                    editValues[urlKey] !== getEffectiveValue(urlKey)
                                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                      : 'bg-white/5 text-gray-500'
                                  }`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Label Input */}
                            <div className="space-y-1">
                              <label className="text-xs text-gray-500 ml-1">Название / Подпись</label>
                              <div className="relative flex gap-2">
                                <input
                                  type="text"
                                  value={editValues[labelKey] || ''}
                                  onChange={(e) => handleTextChange(labelKey, e.target.value)}
                                  placeholder="Название видео"
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveText(labelKey)}
                                  disabled={editValues[labelKey] === getEffectiveValue(labelKey) || saving[labelKey]}
                                  className={`px-3 rounded-lg transition-all ${
                                    editValues[labelKey] !== getEffectiveValue(labelKey)
                                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                      : 'bg-white/5 text-gray-500'
                                  }`}
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* PAGES TAB */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Страницы</h3>
                  <p className="text-gray-400">Управление дополнительными страницами</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingPage(null);
                  setNewPage({ title: '', slug: '', content: '', isVisible: true });
                  setIsAddingPage(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
              >
                <Plus className="w-5 h-5" />
                <span>Создать страницу</span>
              </button>
            </div>

            {/* Page List */}
            {!isAddingPage && !editingPage && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(pages || []).map(page => (
                  <div key={page.id} className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{page.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                            <Globe className="w-3 h-3" />
                            <span>/p/{page.slug}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${page.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {page.isVisible ? 'PUB' : 'HID'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <a 
                          href={`/p/${page.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                          title="Открыть"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPage(page);
                              setNewPage({ ...page });
                              setIsAddingPage(false);
                            }}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить эту страницу?')) {
                                deletePage(page.id);
                              }
                            }}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty State */}
                {(pages || []).length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">Страниц пока нет</p>
                    <button 
                      onClick={() => setIsAddingPage(true)}
                      className="mt-4 text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Создать первую страницу
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Editor */}
            {(isAddingPage || editingPage) && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {isAddingPage ? <Plus className="w-6 h-6 text-blue-400" /> : <Edit3 className="w-6 h-6 text-blue-400" />}
                    {isAddingPage ? 'Новая страница' : 'Редактирование страницы'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddingPage(false);
                      setEditingPage(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    Отмена
                  </button>
                </div>

                <div className="space-y-6 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 ml-1">Заголовок страницы</label>
                      <input
                        type="text"
                        value={newPage.title}
                        onChange={e => setNewPage({...newPage, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none"
                        placeholder="О компании"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 ml-1">URL адрес (slug)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">/p/</span>
                        <input
                          type="text"
                          value={newPage.slug}
                          onChange={e => setNewPage({...newPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 focus:outline-none font-mono"
                          placeholder="about-us"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 ml-1">Контент (HTML поддерживается)</label>
                    <textarea
                      value={newPage.content}
                      onChange={e => setNewPage({...newPage, content: e.target.value})}
                      className="w-full h-96 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:outline-none font-mono text-sm leading-relaxed"
                      placeholder="<p>Текст страницы...</p>"
                    />
                    <p className="text-xs text-gray-500 ml-1">
                      Поддерживаются HTML теги для форматирования. Страница будет автоматически обернута в Header и Footer.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => setNewPage({...newPage, isVisible: !newPage.isVisible})}
                        className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                          newPage.isVisible ? 'bg-green-500' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          newPage.isVisible ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                      <span className="text-gray-400 group-hover:text-white transition-colors">
                        Опубликовать на сайте
                      </span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsAddingPage(false);
                          setEditingPage(null);
                        }}
                        className="px-6 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors font-bold"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={async () => {
                          if (!newPage.title || !newPage.slug) return alert('Заполните заголовок и адрес');
                          
                          if (editingPage) {
                            await updatePage(editingPage.id, newPage);
                          } else {
                            await addPage(newPage);
                          }
                          setIsAddingPage(false);
                          setEditingPage(null);
                          setNewPage({ title: '', slug: '', content: '', isVisible: true });
                        }}
                        className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors font-bold shadow-lg shadow-blue-900/20"
                      >
                        {editingPage ? 'Сохранить изменения' : 'Создать страницу'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STORE TAB */}
        {activeTab === 'store' && (
          <div className="space-y-8">
             <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-500/20 rounded-xl">
                   <ShoppingBag className="w-8 h-8 text-green-400" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-white">Товары</h3>
                   <p className="text-gray-400">Управление каталогом магазина</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/10">
                   <span className="text-sm text-gray-400">Секция на сайте:</span>
                   <button
                     onClick={() => handleToggleSection('store', sections['store'] !== false)}
                     className={`relative w-10 h-6 rounded-full transition-colors duration-300 ${
                       sections['store'] !== false ? 'bg-green-500' : 'bg-gray-700'
                     }`}
                   >
                     <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                       sections['store'] !== false ? 'translate-x-4' : 'translate-x-0'
                     }`} />
                   </button>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Add/Edit Form */}
               <div className="lg:col-span-1">
                 <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sticky top-6">
                   <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                     <Plus className="w-5 h-5 text-purple-400" />
                     {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
                   </h4>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="text-xs text-gray-400 ml-1">Название товара</label>
                       <input
                         type="text"
                         value={newProduct.name}
                         onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                         className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none"
                         placeholder="Например: Домик для кота"
                       />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 ml-1">Цена (₽)</label>
                          <input
                            type="text"
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none"
                            placeholder="1500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 ml-1">Категория</label>
                          <input
                            type="text"
                            value={newProduct.category}
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none"
                            placeholder="Игрушки"
                          />
                        </div>
                     </div>

                     <div>
                       <label className="text-xs text-gray-400 ml-1">Ссылка на фото</label>
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={newProduct.image}
                           onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 focus:outline-none"
                           placeholder="https://..."
                         />
                       </div>
                       {newProduct.image && (
                         <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black/20 border border-white/5">
                           <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                       )}
                     </div>

                     <div className="pt-4 flex gap-3">
                       {editingProduct && (
                         <button
                           onClick={() => {
                             setEditingProduct(null);
                             setNewProduct({ name: '', price: '', image: '', category: '', description: '', isVisible: true });
                           }}
                           className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors font-bold"
                         >
                           Отмена
                         </button>
                       )}
                       <button
                         onClick={async () => {
                           if (!newProduct.name || !newProduct.price) return alert('Заполните название и цену');
                           
                           if (editingProduct) {
                             await updateProduct(editingProduct, newProduct);
                             setEditingProduct(null);
                           } else {
                             await addProduct(newProduct);
                           }
                           setNewProduct({ name: '', price: '', image: '', category: '', description: '', isVisible: true });
                         }}
                         className="flex-1 py-3 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-colors font-bold shadow-lg shadow-green-900/20"
                       >
                         {editingProduct ? 'Сохранить' : 'Добавить'}
                       </button>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Product List */}
              <div className="lg:col-span-2 space-y-4">
                {(products || []).length === 0 ? (
                  <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Товаров пока нет. Добавьте первый!</p>
                  </div>
                ) : (
                  (products || []).map(product => (
                     <div key={product.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/30 transition-all group">
                       <div className="w-20 h-20 rounded-lg bg-black/40 overflow-hidden flex-shrink-0">
                         {product.image ? (
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center">
                             <ImageIcon className="w-8 h-8 text-gray-600" />
                           </div>
                         )}
                       </div>
                       
                       <div className="flex-1 text-center sm:text-left">
                         <h5 className="font-bold text-white text-lg">{product.name}</h5>
                         <div className="flex items-center justify-center sm:justify-start gap-3 text-sm mt-1">
                           <span className="text-green-400 font-mono font-bold">{product.price} ₽</span>
                           {product.category && (
                             <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-xs">
                               {product.category}
                             </span>
                           )}
                           <span className={`px-2 py-0.5 rounded-full text-xs ${product.isVisible ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                             {product.isVisible ? 'Активен' : 'Скрыт'}
                           </span>
                         </div>
                       </div>

                       <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                           onClick={() => updateProduct(product.id, { isVisible: !product.isVisible })}
                           className={`p-2 rounded-lg transition-colors ${product.isVisible ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-700 text-gray-400'}`}
                           title={product.isVisible ? 'Скрыть' : 'Показать'}
                         >
                           {product.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                         </button>
                         <button
                           onClick={() => {
                             setEditingProduct(product.id);
                             setNewProduct({
                               name: product.name,
                               price: product.price,
                               image: product.image,
                               category: product.category,
                               description: product.description || '',
                               isVisible: product.isVisible
                             });
                           }}
                           className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                           title="Редактировать"
                         >
                           <Edit3 className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => {
                             if(confirm('Удалить товар?')) deleteProduct(product.id);
                           }}
                           className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                           title="Удалить"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContent;
