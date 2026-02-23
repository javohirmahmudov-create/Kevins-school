'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, User, Users, UserCircle } from 'lucide-react';

/**
 * Ushbu sahifa Next.js dagi "Hydration" xatolarini va Vercel build muammolarini 
 * bartaraf qilish uchun optimallashtirilgan.
 * Tanlangan dizayn: Red-gradient background (from-red-50 via-white to-red-50).
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
    console.log('✅ Kevin\'s Academy portal yuklandi.');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login API simulyatsiyasi
      await new Promise(resolve => setTimeout(resolve, 800));

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
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header qismi */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-3xl mb-4 shadow-xl shadow-red-500/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Kevin's Academy
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Ingliz tili portali</p>
        </div>

        {/* Login kartasi */}
        <div className="bg-white border border-red-100 rounded-[2.5rem] shadow-2xl shadow-red-200/50 p-8 sm:p-10">
          <div className="flex bg-red-50 rounded-2xl p-1 mb-8">
            {(['admin', 'student', 'parent'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  userType === type 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-slate-500 hover:text-red-400'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Foydalanuvchi</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Maxfiy parol</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
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
