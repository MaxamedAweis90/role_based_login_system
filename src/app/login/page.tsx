'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, User, AlertCircle, Loader2 } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Monitor redirects from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      const messageParam = params.get('message');

      if (errorParam === 'unauthorized') {
        setToast({
          message: "You don't have access to this area. Please sign in first.",
          type: 'error',
        });
        cleanUrl();
      } else if (messageParam === 'logged_out') {
        setToast({
          message: "Logged out successfully.",
          type: 'success',
        });
        cleanUrl();
      }
    }

    function cleanUrl() {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const role = data.role;
      const dest = role === 'Admin' ? '/admin' : role === 'Lecturer' ? '/lecturer' : '/student';
      
      // Pass login_success to the dashboard to show welcome toast
      router.replace(`${dest}?message=login_success`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 overflow-hidden">
      {/* Soft bright gradient background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/25 mb-4 shadow-sm">
            <KeyRound className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 via-indigo-600 to-brand-800 bg-clip-text text-transparent">
            RBAC Secure Portal
          </h1>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Next.js Role-Based Authentication System
          </p>
        </div>

        {/* High-Contrast Login Card */}
        <div className="glass-card rounded-2xl p-8 bg-white border border-slate-200 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Notification */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-fade-in text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-sm font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition-all text-sm font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying Account...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mt-6 text-center text-xs text-slate-600 font-medium">
          <p>Demo Accounts: <span className="font-bold text-slate-950">admin_user</span> (Admin) | <span className="font-bold text-slate-950">lecturer_user</span> (Lecturer) | <span className="font-bold text-slate-950">student_user</span> (Student)</p>
          <p className="mt-1 text-slate-500">Password is username + 123 (e.g. admin123)</p>
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
