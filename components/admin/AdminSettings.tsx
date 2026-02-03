import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth, Profile } from '../../AuthContext';
import { Users, Shield, Search, RefreshCw, Save, Lock, Unlock, Star, Trash2 } from 'lucide-react';

interface ExtendedProfile extends Profile {
  is_blocked?: boolean;
  is_vip?: boolean;
  email?: string;
}

const AdminSettings: React.FC = () => {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setProfiles((data || []) as ExtendedProfile[]);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки профилей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => {
      const email = (p as any)?.email || '';
      const name = p.full_name || '';
      const username = p.username || '';
      return (
        email.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        username.toLowerCase().includes(q)
      );
    });
  }, [profiles, query]);

  const updateProfileField = async (id: string, field: keyof ExtendedProfile, value: any) => {
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', id);
      if (error) throw error;
      
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    } catch (e: any) {
      console.error(e);
      setError(e.message || `Ошибка обновления ${field}`);
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const deleteProfile = async (id: string) => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить пользователя?');
    if (!confirmed) return;
    setDeleting((s) => ({ ...s, [id]: true }));
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ошибка удаления пользователя');
    } finally {
      setDeleting((s) => ({ ...s, [id]: false }));
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-white">
        Недостаточно прав для просмотра настроек.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Настройки</h1>
          <p className="text-gray-400">
            Управление профилями пользователей, ролями и статусами.
          </p>
        </div>
        <button
          onClick={fetchProfiles}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>

      <div className="bg-[#16213e] rounded-3xl p-6 border border-white/5 shadow-xl">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/10 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full"
              placeholder="Поиск по email, имени, username"
            />
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">{profiles.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#16213e] rounded-3xl p-6 border border-white/5 shadow-xl">
        {error && (
          <div className="mb-4 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-purple" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm uppercase tracking-wider">
                  <th className="py-4 px-4">Пользователь</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4 text-center">Роль</th>
                  <th className="py-4 px-4 text-center">VIP</th>
                  <th className="py-4 px-4 text-center">Блок</th>
                  <th className="py-4 px-4 text-center">Удалить</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white overflow-hidden">
                          {p.avatar_url ? (
                            <img src={p.avatar_url} alt={p.username || ''} className="w-full h-full object-cover" />
                          ) : (
                            <Shield className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-bold flex items-center gap-2">
                            {p.full_name || p.username || '—'}
                            {p.role === 'admin' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-purple text-white font-black">ADMIN</span>}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{p.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {p.email || '—'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        value={p.role}
                        onChange={(e) =>
                          updateProfileField(p.id, 'role', e.target.value)
                        }
                        className="bg-black/20 text-white border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-accent-purple transition-colors"
                        disabled={!!saving[p.id]}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => updateProfileField(p.id, 'is_vip', !p.is_vip)}
                        disabled={!!saving[p.id]}
                        className={`p-2 rounded-lg transition-all ${
                          p.is_vip 
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                            : 'bg-white/5 text-gray-500 hover:text-yellow-400 hover:bg-white/10'
                        }`}
                        title={p.is_vip ? "Убрать VIP" : "Назначить VIP"}
                      >
                        <Star className={`w-5 h-5 ${p.is_vip ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => updateProfileField(p.id, 'is_blocked', !p.is_blocked)}
                        disabled={!!saving[p.id]}
                        className={`p-2 rounded-lg transition-all ${
                          p.is_blocked 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-white/5 text-gray-500 hover:text-red-400 hover:bg-white/10'
                        }`}
                        title={p.is_blocked ? "Разблокировать" : "Заблокировать"}
                      >
                        {p.is_blocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => deleteProfile(p.id)}
                        disabled={!!deleting[p.id]}
                        className="p-2 rounded-lg transition-all bg-white/5 text-gray-500 hover:text-red-500 hover:bg-white/10"
                        title="Удалить пользователя"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                Ничего не найдено
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
