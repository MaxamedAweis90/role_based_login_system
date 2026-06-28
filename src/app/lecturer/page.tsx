import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from '@/lib/jwt-edge';
import DashboardLayout from '@/components/DashboardLayout';
import { GraduationCap, Users, Calendar, PlusCircle, ArrowUpRight } from 'lucide-react';

export default async function LecturerDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  const decoded = await verifyJWT(token);
  if (!decoded || decoded.role !== 'Lecturer') {
    redirect('/login');
  }

  return (
    <DashboardLayout username={decoded.username} role="Lecturer">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Lecturer Console
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Welcome back! You have 3 pending grade reviews and 2 lectures scheduled for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Modules</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">4</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-medium">
              <span>Term: Semester 2</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">128</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12 New Students</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Grading</span>
                <h3 className="text-3xl font-extrabold text-amber-700 mt-2">18</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-medium">
              <span>Due: July 5th</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 bg-white border border-slate-200 shadow-sm glass-card-hover">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lectures Today</span>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2">2</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-medium">
              <span>Next: 14:00 PM</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Courses */}
          <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm lg:col-span-2">
            <h2 className="text-base font-bold text-slate-800 mb-4">Current Semester Courses</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">CS-302: Database Management Systems</h3>
                    <span className="text-xs text-slate-500 mt-1 inline-block font-medium">Mondays & Wednesdays (10:00 - 11:30)</span>
                  </div>
                  <span className="text-xs bg-brand-50 border border-brand-200 text-brand-700 px-2.5 py-1 rounded-full font-bold">42 Students</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">CS-401: Advanced Web Engineering</h3>
                    <span className="text-xs text-slate-500 mt-1 inline-block font-medium">Tuesdays & Thursdays (14:00 - 15:30)</span>
                  </div>
                  <span className="text-xs bg-brand-50 border border-brand-200 text-brand-700 px-2.5 py-1 rounded-full font-bold">35 Students</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Quick Tools</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Post Announcement
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all">
                  <PlusCircle className="w-4 h-4 text-brand-600" />
                  Upload Lecture Slide
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all">
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  Setup Midterm Quiz
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-bold text-center border-t border-slate-100 pt-4 mt-4">
              Role: {decoded.role} | Account: {decoded.username}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
