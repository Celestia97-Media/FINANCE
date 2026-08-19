import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveScreen } from '../../types';
import {
  LayoutDashboard,
  Film,
  PlusCircle,
  Receipt,
  CheckSquare,
  BarChart3,
  Zap,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    stats,
    jobs,
    selectedJobId,
    setSelectedJobId,
    setIsQuickAddOpen,
    setIsAddExpenseOpen,
    resetToDefault,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems: { id: ActiveScreen; label: string; subLabel: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', subLabel: '01 — Tổng quan', icon: LayoutDashboard },
    { id: 'jobs', label: 'Media Jobs', subLabel: '02 — Danh sách', icon: Film },
    { id: 'create-job', label: 'Create Job', subLabel: '03 — Tạo mới', icon: PlusCircle },
    { id: 'expense', label: 'Expense Screen', subLabel: '04 — Chi phí', icon: Receipt },
    {
      id: 'approval',
      label: 'Approval',
      subLabel: '05 — Duyệt chi',
      icon: CheckSquare,
      badge: stats.waitingApprovalCount,
    },
    { id: 'report', label: 'Report & Export', subLabel: '06 — Báo cáo', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                  <Film className="w-5 h-5 font-bold" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    FINANCE MEDIA
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Quản lý chi phí & Ngân sách Media
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-850 text-teal-300 border border-slate-700/90 shadow-sm shadow-teal-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Fast Triggers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Add Button (Hero on-set action) */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              title="Thêm nhanh chi phí shooting (Grab, Coffee, Ăn uống, Đạo cụ...)"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span className="font-extrabold tracking-wide">QUICK ADD</span>
            </button>

            {/* Quick Job Switcher (Desktop) */}
            <div className="hidden xl:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
              <span className="text-slate-500 mr-2">Job:</span>
              <select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  if (activeScreen !== 'expense') {
                    // keep on current or allow easy toggle
                  }
                }}
                className="bg-transparent text-teal-300 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {jobs.map((j) => (
                  <option key={j.job_id} value={j.job_id} className="bg-slate-900 text-slate-200">
                    {j.project_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-800 transition-colors"
              title="Khôi phục dữ liệu mẫu ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 px-4 py-4 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-semibold ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-400" />
                  <div className="flex-1 truncate">
                    <p className="font-bold truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.subLabel}</p>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Select Job Mobile */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <label className="block text-[11px] text-slate-400 font-semibold mb-1">
              Đang chọn Job:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
            >
              {jobs.map((j) => (
                <option key={j.job_id} value={j.job_id}>
                  {j.project_name} ({j.production_type})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-base">Khôi phục dữ liệu mẫu?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Toàn bộ dữ liệu tự thêm sẽ được reset về trạng thái mẫu ban đầu (Summer Campaign, TVC...).
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
              >
                Xác nhận Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
