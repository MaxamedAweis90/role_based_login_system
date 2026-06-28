'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Shield, 
  BookOpen, 
  GraduationCap,
  LayoutDashboard,
  Users,
  Settings,
  FolderLock,
  Calendar,
  ClipboardList,
  Construction,
  ArrowLeft
} from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  username: string;
  role: 'Admin' | 'Lecturer' | 'Student';
}

// Under Construction layout to display inside the viewport
function UnderConstructionView({ tabName, onBack }: { tabName: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
      <div className="inline-flex p-4 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mb-6 shadow-sm animate-bounce">
        <Construction className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
        {tabName} is Under Construction
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 font-medium">
        This workspace panel is currently under development. Our engineering team is crafting this space to bring you advanced features soon!
      </p>
      
      {/* Mock Development Progress Bar */}
      <div className="w-full max-w-xs bg-slate-200 h-2.5 rounded-full overflow-hidden mt-6 border border-slate-300/60">
        <div className="bg-brand-600 h-full rounded-full animate-pulse" style={{ width: '45%' }} />
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Development Progress: 45%</span>

      <button
        onClick={onBack}
        className="flex items-center gap-2 mt-8 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-md active:scale-95 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Overview
      </button>
    </div>
  );
}

export default function DashboardLayout({ children, username, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Determine the primary dashboard tab label
  let primaryTabLabel = 'Admin Panel';
  if (role === 'Lecturer') primaryTabLabel = 'Lecture Portal';
  if (role === 'Student') primaryTabLabel = 'Student Hub';

  // Navigation tab state
  const [activeTabLabel, setActiveTabLabel] = useState<string>(primaryTabLabel);

  // Keep state sync if role updates
  useEffect(() => {
    setActiveTabLabel(primaryTabLabel);
  }, [primaryTabLabel]);

  // Monitor redirects from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      const messageParam = params.get('message');

      if (errorParam === 'access_denied') {
        setToast({
          message: "Access Denied: You do not have permission to view that page.",
          type: 'error',
        });
        cleanUrl();
      } else if (messageParam === 'login_success') {
        setToast({
          message: `Success! Welcome back, ${username}.`,
          type: 'success',
        });
        cleanUrl();
      }
    }

    function cleanUrl() {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [username]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login?message=logged_out');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTabClick = (label: string) => {
    setActiveTabLabel(label);
    setIsMobileOpen(false); // Close drawer for mobile responsiveness
  };

  // Configure role specific parameters (Light Mode High Contrast)
  let roleIcon = <User className="w-5 h-5 text-brand-600" />;
  let roleBadgeColor = 'bg-brand-5 text-brand-700 border-brand-200';
  let navItems: { label: string; icon: React.ReactNode }[] = [];

  if (role === 'Admin') {
    roleIcon = <Shield className="w-5 h-5 text-red-600" />;
    roleBadgeColor = 'bg-red-50 text-red-700 border-red-200';
    navItems = [
      { label: 'Admin Panel', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'User Accounts', icon: <Users className="w-4 h-4" /> },
      { label: 'Security Logs', icon: <FolderLock className="w-4 h-4" /> },
      { label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'Lecturer') {
    roleIcon = <BookOpen className="w-5 h-5 text-emerald-600" />;
    roleBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    navItems = [
      { label: 'Lecture Portal', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Class Manager', icon: <Users className="w-4 h-4" /> },
      { label: 'Grades Upload', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'Student') {
    roleIcon = <GraduationCap className="w-5 h-5 text-amber-700" />;
    roleBadgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    navItems = [
      { label: 'Student Hub', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Schedules', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Grades & Transcript', icon: <ClipboardList className="w-4 h-4" /> },
    ];
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between p-6 bg-white">
      {/* Upper Section */}
      <div className="space-y-8">
        {/* Branding header */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${roleBadgeColor} shadow-sm`}>
            {roleIcon}
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-slate-800">RBAC Hub</h2>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{role} Workspace</span>
          </div>
        </div>

        {/* Sidebar navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item, idx) => {
            const isCurrentActive = activeTabLabel === item.label;
            return (
              <button
                key={idx}
                onClick={() => handleTabClick(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isCurrentActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile & Logout */}
      <div className="border-t border-slate-200 pt-6 space-y-4">
        {/* User Identity */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm uppercase">
            {username.slice(0, 2)}
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-slate-800 truncate">{username}</p>
            <span className={`inline-block px-2 py-0.5 mt-0.5 text-[10px] font-bold border rounded-full ${roleBadgeColor}`}>
              {role}
            </span>
          </div>
        </div>

        {/* Logout Trigger */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? 'Logging out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-slate-200 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop click-out */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer body */}
          <aside className="relative w-64 max-w-xs bg-white border-r border-slate-200 h-full flex flex-col z-10 animate-fade-in">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header bar */}
        <header className="h-16 sticky top-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-855"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Current location name */}
          <h2 className="hidden md:block text-sm font-bold text-slate-500">
            Console / {activeTabLabel}
          </h2>

          {/* Right section: Logged in user info */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-slate-500 font-bold">Logged in as:</span>
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-extrabold text-slate-800 tracking-wide">{username}</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto animate-fade-in">
          {activeTabLabel === primaryTabLabel ? (
            children
          ) : (
            <UnderConstructionView 
              tabName={activeTabLabel} 
              onBack={() => setActiveTabLabel(primaryTabLabel)} 
            />
          )}
        </main>
      </div>

      {/* Floating Interactive Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
