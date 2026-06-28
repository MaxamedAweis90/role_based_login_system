import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/jwt-edge';
import DashboardLayout from '@/components/DashboardLayout';
import { BookOpen, GraduationCap, Calendar, Trophy, ArrowUpRight } from 'lucide-react';

export default async function StudentDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'Student') {
    redirect('/login');
  }

  return (
    <DashboardLayout username={decoded.username} role="Student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Hi {decoded.username}, welcome to your academic command center. Here is your progress this term.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courses Enrolled</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">5</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-semibold">
              <span>Term Credit Load: 15</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current GPA</span>
                <h3 className="text-3xl font-extrabold text-amber-700 mt-2">3.84</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Deans List standing</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
                <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">96%</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-semibold">
              <span>Required: 80% minimum</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Work</span>
                <h3 className="text-3xl font-extrabold text-rose-600 mt-2">3</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md w-fit">
              <span>Next: CS-302 Project</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Courses */}
          <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm lg:col-span-2">
            <h2 className="text-base font-bold text-slate-800 mb-4">My Class Schedule Today</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-16 text-center text-slate-500 border-r border-slate-200 pr-4">
                  <p className="text-xs font-bold">10:00</p>
                  <p className="text-[10px] font-semibold">AM</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">CS-302: Database Management Systems</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Room 402-A | Prof. Henderson</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-16 text-center text-slate-500 border-r border-slate-200 pr-4">
                  <p className="text-xs font-bold">14:00</p>
                  <p className="text-[10px] font-semibold">PM</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">CS-401: Advanced Web Engineering</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Lab 3 | Dr. Roberts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">Portal Notifications</h2>
            <div className="space-y-4">
              <div className="text-xs border-l-2 border-brand-500 pl-3 py-1">
                <p className="font-bold text-slate-700">Grade Update</p>
                <p className="text-slate-500 mt-0.5 font-medium">Quiz 2 grade uploaded for CS-302.</p>
              </div>
              <div className="text-xs border-l-2 border-amber-500 pl-3 py-1">
                <p className="font-bold text-slate-700">Lab Reschedule</p>
                <p className="text-slate-500 mt-0.5 font-medium">CS-401 Thursday lab moved to Friday.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
