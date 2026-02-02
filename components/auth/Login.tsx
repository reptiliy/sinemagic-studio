import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Chrome, Globe, User, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../AuthContext';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 0, num2: 0 });
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithDemo, signInWithGoogle, user, isAdmin } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaChallenge({ num1, num2 });
    setCaptchaInput('');
  };

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isRegister) {
        // Registration Logic
        if (password !== confirmPassword) {
          throw new Error('Пароли не совпадают');
        }
        if (!termsAccepted) {
          throw new Error('Необходимо принять условия использования');
        }
        if (parseInt(captchaInput) !== captchaChallenge.num1 + captchaChallenge.num2) {
          generateCaptcha();
          throw new Error('Неверная капча');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0], // Default name from email
              role: 'user', // Default role
            },
          },
        });

        if (error) throw error;

        setSuccessMessage('Регистрация успешна! Проверьте почту для подтверждения.');
        setIsRegister(false);
        generateCaptcha();
      } else {
        // Login Logic
        // Check for demo credentials
        if (
          (email === 'admin@sinemagic.com' && password === 'admin') || 
          (email === 'admin2@sinemagic.com')
        ) {
          signInWithDemo(email);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to start Google login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-purple/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-cyan/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white font-black text-xl mb-4 shadow-[0_0_40px_rgba(168,85,247,0.3)] rotate-12">
            SS
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {isRegister ? 'Регистрация' : 'Добро пожаловать'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isRegister ? 'Создайте новый аккаунт' : 'Войдите в свой аккаунт'}
          </p>
        </div>

        <div className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-400">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            <Globe className="w-5 h-5" />
            {isRegister ? 'Регистрация через Google' : 'Войти через Google'}
          </button>

          {!isRegister && (
            <>
              <div className="relative flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-gray-500 text-sm">или</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <button
                onClick={() => signInWithDemo('demo@sinemagic.com')}
                type="button"
                className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 border border-white/10"
              >
                <Lock className="w-5 h-5" />
                Демo-вход (без регистрации)
              </button>
            </>
          )}

          <div className="relative flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-500 font-medium uppercase">Или через email</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Email Адрес</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-purple transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#16213e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Пароль</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-purple transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#16213e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Подтверждение пароля</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent-purple transition-colors" />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#16213e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Капча: Сколько будет {captchaChallenge.num1} + {captchaChallenge.num2}?</label>
                  <div className="relative group flex gap-2">
                    <div className="relative flex-1">
                        <input 
                        type="number" 
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="w-full bg-[#16213e] border border-white/5 rounded-2xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all"
                        placeholder="Ответ"
                        required
                        />
                    </div>
                    <button 
                        type="button"
                        onClick={generateCaptcha}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 text-white transition-all"
                        title="Обновить капчу"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 rounded border-white/10 bg-[#16213e] text-accent-purple focus:ring-offset-[#0f0f1a]"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none">
                    Я принимаю <span className="text-white underline decoration-white/30 hover:decoration-white transition-all">правила сервиса</span>
                  </label>
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-2xl text-white font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isRegister ? 'Регистрация...' : 'Вход...') : (isRegister ? 'Зарегистрироваться' : 'Войти')}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="text-center pt-4">
             <button
               type="button"
               onClick={() => {
                 setIsRegister(!isRegister);
                 setError(null);
                 setSuccessMessage(null);
                 generateCaptcha();
               }}
               className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
             >
               {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
             </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          &copy; 2026 Sinemagic Studio. Защищенный вход.
        </p>
      </div>
    </div>
  );
};

export default Login;
