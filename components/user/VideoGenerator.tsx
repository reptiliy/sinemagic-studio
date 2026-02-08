import React, { useState, useEffect, useRef } from 'react';
import { Video, Loader2, Play, Download, AlertCircle, Settings, Key, Wand2 } from 'lucide-react';

interface VideoGeneratorProps {
  onGenerate?: (videoUrl: string) => void;
}

interface VideoTask {
  taskId: string;
  status: 'generating' | 'success' | 'failed';
  resultUrls?: string[];
  error?: string;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [model, setModel] = useState<'veo3_fast' | 'veo3'>('veo3_fast');
  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<VideoTask | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key from env or localStorage
  useEffect(() => {
    const envKey = import.meta.env.VITE_KIE_API_KEY;
    const storedKey = localStorage.getItem('kie_api_key');
    if (envKey) {
      setApiKey(envKey);
    } else if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowSettings(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('kie_api_key', key);
    setShowSettings(false);
  };

  const pollStatus = async (taskId: string) => {
    try {
      const response = await fetch(`https://api.kie.ai/api/v1/veo/task/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to check status');
      }

      const data = await response.json();
      // Assuming data structure based on typical API patterns
      // Status: 0=Generating, 1=Success, 2=Failed
      
      if (data.code === 200) {
          const status = data.data.status; // 0, 1, 2
          
          if (status === 1) { // Success
            setCurrentTask(prev => prev ? {
              ...prev,
              status: 'success',
              resultUrls: data.data.info.resultUrls
            } : null);
            setLoading(false);
          } else if (status === 2 || status === 3) { // Failed
            setCurrentTask(prev => prev ? {
              ...prev,
              status: 'failed',
              error: data.msg || 'Generation failed'
            } : null);
            setLoading(false);
            setError(data.msg || 'Generation failed');
          } else {
            // Still generating, poll again
            setTimeout(() => pollStatus(taskId), 3000);
          }
      } else {
          throw new Error(data.msg || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Polling error:', err);
      // Don't stop polling on transient network errors, but maybe limit retries?
      // For now, let's stop and show error
      setLoading(false);
      setError(err.message);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (!prompt) return;

    setLoading(true);
    setError(null);
    setCurrentTask(null);

    try {
      const response = await fetch('https://api.kie.ai/api/v1/veo/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          aspect_ratio: aspectRatio,
          generationType: "TEXT_2_VIDEO"
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        const taskId = data.data.taskId;
        setCurrentTask({ taskId, status: 'generating' });
        // Start polling
        setTimeout(() => pollStatus(taskId), 2000);
      } else {
        throw new Error(data.msg || 'Failed to start generation');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Video className="w-6 h-6 text-accent-purple" />
            Генератор видео Veo 3
          </h3>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            title="Настройки API"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings && (
          <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Configuration
            </h4>
            <div className="flex gap-4">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Kie.ai API Key"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50"
              />
              <button
                onClick={() => saveApiKey(apiKey)}
                className="px-6 py-2 bg-accent-purple/20 text-accent-purple rounded-xl font-bold hover:bg-accent-purple/30 transition-colors"
              >
                Сохранить
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ключ будет сохранен локально в вашем браузере.
            </p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Промпт</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Опишите видео, которое хотите создать (на английском работает лучше)..."
              className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Формат</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-3 px-4 rounded-xl border transition-all font-bold ${
                    aspectRatio === '16:9'
                      ? 'bg-accent-purple/20 border-accent-purple text-white'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  16:9 (Горизонтально)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-3 px-4 rounded-xl border transition-all font-bold ${
                    aspectRatio === '9:16'
                      ? 'bg-accent-purple/20 border-accent-purple text-white'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  9:16 (Вертикально)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Модель</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModel('veo3_fast')}
                  className={`py-3 px-4 rounded-xl border transition-all font-bold ${
                    model === 'veo3_fast'
                      ? 'bg-accent-cyan/20 border-accent-cyan text-white'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  Veo 3 Fast
                </button>
                <button
                  type="button"
                  onClick={() => setModel('veo3')}
                  className={`py-3 px-4 rounded-xl border transition-all font-bold ${
                    model === 'veo3'
                      ? 'bg-accent-cyan/20 border-accent-cyan text-white'
                      : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  Veo 3 Quality
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !prompt || !apiKey}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent-purple/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Сгенерировать
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {currentTask && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            Результат
            {currentTask.status === 'generating' && (
              <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                Обработка
              </span>
            )}
            {currentTask.status === 'success' && (
              <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20">
                Готово
              </span>
            )}
          </h4>

          {currentTask.status === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-accent-purple animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white/50" />
                </div>
              </div>
              <p className="text-gray-400 max-w-sm">
                Видео генерируется. Это может занять от 2 до 5 минут. Пожалуйста, не закрывайте вкладку.
              </p>
            </div>
          )}

          {currentTask.status === 'success' && currentTask.resultUrls && (
            <div className="grid grid-cols-1 gap-6">
              {currentTask.resultUrls.map((url, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black relative group border border-white/10">
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-full object-contain"
                      poster="https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=1000&auto=format&fit=crop"
                    />
                  </div>
                  <div className="flex justify-end">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Скачать видео
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
