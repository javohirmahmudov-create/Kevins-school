'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, User, Users, UserCircle } from 'lucide-react';

/**
 * Ushbu sahifa Next.js dagi "Hydration" xatolarini va Vercel build muammolarini 
 * bartaraf qilish uchun optimallashtirilgan.
 */

// Dinamik render qilishni majburlaymiz (Vercel-da xatolarni kamaytirish uchun)
export const dynamic = 'force-dynamic';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'student' | 'parent'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // 1. Konsoldagi "Hydration failed" xatosini yo'qotish uchun isMounted ishlatamiz
  useEffect(() => {
    setIsMounted(true);
    
    // Foydalanuvchi turiga qarab ranglarni o'zgartirish yoki boshqa amallar
    console.log('✅ Kevin\'s Academy portal yuklandi.');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login API simulyatsiyasi
      await new Promise(resolve => setTimeout(resolve, 800));

      // DIQQAT: useRouter ba'zida Vercel-da "Could not resolve" berishi mumkin.
      // Shuning uchun eng ishonchli usul - window.location.href
      if (typeof window !== 'undefined') {
        const path = userType === 'admin' ? '/admin' : userType === 'student' ? '/student' : '/parent';
        window.location.href = path;
      }
    } catch (err) {
      setError('Tizimga kirishda xatolik yuz berdi. Iltimos, ma\'lumotlarni tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  // Komponent brauzerda to'liq yuklanmaguncha hech narsa ko'rsatmaymiz
  // Bu konsoldagi barcha qizil xatolarni (Hydration) yo'qotadi
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header qismi */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-xl shadow-blue-500/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kevin's Academy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Ingliz tili portali</p>
        </div>

        {/* Login kartasi */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-2xl p-8 sm:p-10">
          <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-2xl p-1 mb-8">
            {(['admin', 'student', 'parent'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  userType === type 
                    ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Foydalanuvchi</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Maxfiy parol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-2xl border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium uppercase tracking-widest">
          © 2024 Kevin's Academy
        </p>
      </motion.div>
    </div>
  );
}
