import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PlusCircle,
  Zap,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import { formatVND, formatDate } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CATEGORIES } from '../../data/categories';

export const DashboardScreen: React.FC = () => {
  const {
    stats,
    jobs,
    expenses,
    setActiveScreen,
    setSelectedJobId,
    setIsQuickAddOpen,
    getJobActualCost,
  } = useApp();

  // Chart data: Budget vs Actual for top jobs
  const jobComparisonData = jobs.map((job) => {
    const actual = getJobActualCost(job.job_id);
    return {
      name: job.project_name.length > 15 ? job.project_name.substring(0, 15) + '...' : job.project_name,
      fullName: job.project_name,
      Budget: job.budget,
      Actual: actual,
      isOver: actual > job.budget,
    };
  });

  // Category distribution data
  const categoryMap: Record<string, number> = {};
  expenses
    .filter((e) => e.payment_status !== 'Rejected')
    .forEach((e) => {
      categoryMap[e.category_id] = (categoryMap[e.category_id] || 0) + e.total;
    });

  const categoryChartData = Object.entries(categoryMap).map(([catId, total]) => {
    const def = CATEGORIES.find((c) => c.id === catId);
    return {
      name: def?.name || catId,
      value: total,
      color: def?.color || '#94a3b8',
    };
  });

  const overBudgetJobs = jobs.filter((j) => getJobActualCost(j.job_id) > j.budget);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner / Welcome & Primary Actions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ thống Quản lý Chi phí Sản xuất Media</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Tổng Quan Tài Chính Media
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Theo dõi thời gian thực tiến độ giải ngân, kiểm soát chi phí thực tế, hoàn ứng và duyệt chi các buổi shooting.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveScreen('create-job')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>CREATE NEW MEDIA JOB</span>
            </button>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>QUICK ADD CHI PHÍ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Key Metric Cards (Matching requirement 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tổng số Media Job tháng này */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Media Job Tháng Này
            </span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-100">{stats.totalJobsThisMonth}</span>
            <span className="text-xs text-slate-500 ml-1.5 font-medium">dự án shooting</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Đang triển khai & hoàn tất</span>
          </div>
        </div>

        {/* 2. Tổng Budget */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng Ngân Sách (Budget)
            </span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-teal-300">
              {formatVND(stats.totalBudget)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400">Hạn mức phê duyệt toàn bộ</div>
        </div>

        {/* 3. Tổng Actual Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng Chi Thực Tế (Actual)
            </span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-300">
              {formatVND(stats.totalActualCost)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Tỉ lệ giải ngân:{' '}
            <strong className="text-purple-300">
              {stats.totalBudget > 0
                ? Math.round((stats.totalActualCost / stats.totalBudget) * 100)
                : 0}
              %
            </strong>
          </div>
        </div>

        {/* 4. Tổng chi phí phát sinh */}
        <div
          className={`bg-slate-900/80 border rounded-2xl p-5 transition-all ${
            stats.totalIncurredCost > 0
              ? 'border-rose-500/40 bg-rose-950/10'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chi Phí Phát Sinh
            </span>
            <div
              className={`p-2 rounded-xl ${
                stats.totalIncurredCost > 0
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                stats.totalIncurredCost > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {formatVND(stats.totalIncurredCost)}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {stats.totalIncurredCost > 0 ? 'Phát sinh vượt ngân sách' : 'Kiểm soát tốt ngân sách'}
          </div>
        </div>
      </div>

      {/* Row 2 of Metric Summary: 3 Secondary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 5. Số Job vượt ngân sách */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Job Vượt Ngân Sách</p>
              <p className="text-lg font-bold text-slate-100">
                {stats.overBudgetJobCount}{' '}
                <span className="text-xs font-normal text-slate-400">/ {jobs.length} jobs</span>
              </p>
            </div>
          </div>
          {stats.overBudgetJobCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
              Cần kiểm soát
            </span>
          )}
        </div>

        {/* 6. Số khoản đang chờ thanh toán */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Chờ Thanh Toán</p>
              <p className="text-lg font-bold text-slate-100">
                {stats.pendingPaymentCount}{' '}
                <span className="text-xs font-normal text-slate-400">khoản chi</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('expense')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
          >
            Chi tiết <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7. Số khoản đang chờ duyệt */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Đang Chờ Duyệt (Approval)</p>
              <p className="text-lg font-bold text-slate-100">
                {stats.waitingApprovalCount}{' '}
                <span className="text-xs font-normal text-slate-400">phiếu</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('approval')}
            className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-500/30 transition-colors"
          >
            Duyệt ngay
          </button>
        </div>
      </div>

      {/* Risk Alert Banner if any job is over budget */}
      {overBudgetJobs.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/30 border border-rose-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-200">
                Cảnh báo bội chi tại {overBudgetJobs.length} dự án!
              </p>
              <p className="text-xs text-slate-400">
                {overBudgetJobs.map((j) => `${j.project_name} (+${formatVND(getJobActualCost(j.job_id) - j.budget)})`).join('; ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedJobId(overBudgetJobs[0].job_id);
              setActiveScreen('expense');
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-colors"
          >
            Xem Dự Án Vượt Ngân Sách
          </button>
        </div>
      )}

      {/* Visual Charts: Budget vs Actual & Category Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Budget vs Actual per Job */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                So Sánh Ngân Sách vs Chi Thực Tế Theo Dự Án
              </h3>
              <p className="text-xs text-slate-400">Budget vs Actual Cost Breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-500" />
                <span className="text-slate-300">Ngân sách (Budget)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-slate-300">Thực tế (Actual)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobComparisonData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-slate-200">{data.fullName}</p>
                          <p className="text-teal-400">Budget: {formatVND(data.Budget)}</p>
                          <p className="text-purple-400">Actual: {formatVND(data.Actual)}</p>
                          <p className={data.isOver ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {data.isOver
                              ? `Vượt: +${formatVND(data.Actual - data.Budget)}`
                              : `Còn dư: ${formatVND(data.Budget - data.Actual)}`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Budget" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Cost Distribution by Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Cơ Cấu Chi Phí (Category)</h3>
            <p className="text-xs text-slate-400">Tỉ trọng giải ngân theo 8 nhóm hạng mục</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => formatVND(Number(val) || 0)}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category legend list */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
            {categoryChartData.slice(0, 6).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-semibold text-slate-200">{formatVND(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Media Jobs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Các Dự Án Shooting Gần Đây</h3>
            <p className="text-xs text-slate-400">Danh sách các Media Job đang theo dõi ngân sách</p>
          </div>
          <button
            onClick={() => setActiveScreen('jobs')}
            className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            Xem tất cả ({jobs.length}) <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => {
            const actual = getJobActualCost(job.job_id);
            const remaining = job.budget - actual;
            const percent = job.budget > 0 ? Math.round((actual / job.budget) * 100) : 0;
            const isOver = actual > job.budget;

            return (
              <div
                key={job.job_id}
                onClick={() => {
                  setSelectedJobId(job.job_id);
                  setActiveScreen('expense');
                }}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-teal-500/20">
                      {job.production_type}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isOver
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : job.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {isOver ? 'Vượt Budget' : job.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-100 text-sm group-hover:text-teal-300 transition-colors line-clamp-1">
                    {job.project_name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">{job.campaign}</p>

                  <div className="space-y-1 text-xs text-slate-400 mb-3">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {formatDate(job.date)}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />{' '}
                      <span className="truncate">{job.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> PIC: {job.pic}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Actual / Budget</span>
                    <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver
                          ? 'bg-rose-500'
                          : percent > 85
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-2">
                    <span className="text-purple-300 font-semibold">{formatVND(actual)}</span>
                    <span className="text-slate-400">Ngân sách: {formatVND(job.budget)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
