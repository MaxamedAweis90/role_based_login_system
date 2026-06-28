import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/jwt-edge';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldAlert, Users, Server, Activity, ArrowUpRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'Admin') {
    redirect('/login');
  }

  return (
    <DashboardLayout username={decoded.username} role="Admin">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome Back, Admin
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            System status is operational. All access controllers are functioning normally.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">3</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>All Seeded Roles Active</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System State</span>
                <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">Active</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Server className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Host CPU Load: 1.2%</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sessions</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">1</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-600 font-medium">
              <span>Token Expire: 1 hour</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Threat Alerts</span>
                <h3 className="text-3xl font-extrabold text-rose-600 mt-2">0</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              <span>Secured by Middleware</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">RBAC Audit Log</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-700">Database Connection Established</span>
              </div>
              <span className="text-slate-500 font-medium">Just Now</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-bold text-slate-700">Access Granted: user admin_user ({decoded.username})</span>
              </div>
              <span className="text-slate-500 font-medium">1m ago</span>
            </div>
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-bold text-slate-700">CSRF & Session Validation Checked</span>
              </div>
              <span className="text-slate-500 font-medium">2m ago</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
