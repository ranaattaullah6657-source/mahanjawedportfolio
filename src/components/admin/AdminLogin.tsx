import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Lock, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, setActivePage } = usePortfolio();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@mahamjawad.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#09090b] relative">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl relative">
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin CMS Portal
          </h2>
          <p className="text-xs text-zinc-400">
            Secure administrative control center for Maham Jawad's portfolio.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email / Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@mahamjawad.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-sm transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In To CMS'}</span>
          </button>
        </form>

        {/* Demo Quick Fill helper */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
          <p className="text-xs text-zinc-500 mb-2">Portfolio Review Mode</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fill Demo Credentials (admin@mahamjawad.com)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
