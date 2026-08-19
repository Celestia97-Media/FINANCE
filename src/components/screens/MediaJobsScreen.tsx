import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionType, JobStatus } from '../../types';
import {
  Film,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Building,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List,
  Trash2,
  Zap,
} from 'lucide-react';
import { formatVND, formatDate } from '../../utils/formatters';

const PRODUCTION_TYPES: ProductionType[] = [
  'Studio Shooting',
  'Outdoor Shooting',
  'Product Shooting',
  'Content Shooting',
  'Lookbook',
  'TVC',
  'On-set',
  'Event',
  'Livestream',
  'Other',
];

export const MediaJobsScreen: React.FC = () => {
  const {
    jobs,
    deleteJob,
    setSelectedJobId,
    setActiveScreen,
    setIsQuickAddOpen,
    getJobActualCost,
    getJobExpenses,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.pic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client_brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || job.production_type === selectedType;
    const matchesStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'Over Budget'
        ? getJobActualCost(job.job_id) > job.budget
        : job.status === selectedStatus);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">02 — Danh Sách Media Jobs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {filteredJobs.length} dự án
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý tất cả các buổi quay chụp, phân loại ngân sách và tiến độ sản xuất
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('create-job')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Media Job Mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên project, campaign, địa điểm, PIC, thương hiệu..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Tất cả loại hình ({PRODUCTION_TYPES.length})</option>
              {PRODUCTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Planning">Planning (Lên kế hoạch)</option>
              <option value="In Progress">In Progress (Đang quay chụp)</option>
              <option value="Completed">Completed (Đã hoàn tất)</option>
              <option value="Over Budget">Over Budget (Vượt ngân sách)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-700 text-teal-400' : 'text-slate-400'
                }`}
                title="Dạng lưới thẻ"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-slate-700 text-teal-400' : 'text-slate-400'
                }`}
                title="Dạng bảng chi tiết"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => {
            const actual = getJobActualCost(job.job_id);
            const remaining = job.budget - actual;
            const percent = job.budget > 0 ? Math.round((actual / job.budget) * 100) : 0;
            const isOver = actual > job.budget;
            const expensesCount = getJobExpenses(job.job_id).length;

            return (
              <div
                key={job.job_id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {job.production_type}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isOver
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : job.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {isOver ? '⚠️ Vượt Budget' : job.status}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-teal-300 transition-colors">
                      {job.project_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.client_brand} • {job.campaign}</span>
                    </p>
                  </div>

                  {/* Meta details */}
                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-850 p-3 rounded-xl border border-slate-800">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300 font-medium">{formatDate(job.date)}</span>
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span>PIC: <strong className="text-slate-300">{job.pic}</strong> ({job.department})</span>
                    </p>
                  </div>
                </div>

                {/* Financial bar & actions */}
                <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Tiến độ chi tiêu</span>
                      <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                        {percent}% ({expensesCount} khoản chi)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
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
                    <div className="flex items-center justify-between text-xs mt-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Actual Cost</span>
                        <span className="font-bold text-purple-300">{formatVND(actual)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Budget</span>
                        <span className="font-bold text-slate-200">{formatVND(job.budget)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.job_id);
                        setActiveScreen('expense');
                      }}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-teal-600 hover:text-slate-950 text-teal-300 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Vào Expense Screen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedJobId(job.job_id);
                        setIsQuickAddOpen(true);
                      }}
                      className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/20"
                      title="Quick Add khoản chi cho job này"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Bạn có chắc chắn muốn xóa job "${job.project_name}"?`)) {
                          deleteJob(job.job_id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Xóa Media Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Project & Campaign</th>
                  <th className="px-4 py-3.5">Loại hình</th>
                  <th className="px-4 py-3.5">Ngày quay & Địa điểm</th>
                  <th className="px-4 py-3.5">PIC / Bộ phận</th>
                  <th className="px-4 py-3.5 text-right">Budget</th>
                  <th className="px-4 py-3.5 text-right">Actual Cost</th>
                  <th className="px-4 py-3.5 text-center">Tiến độ</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredJobs.map((job) => {
                  const actual = getJobActualCost(job.job_id);
                  const isOver = actual > job.budget;
                  const percent = job.budget > 0 ? Math.round((actual / job.budget) * 100) : 0;

                  return (
                    <tr key={job.job_id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-100 text-sm">{job.project_name}</div>
                        <div className="text-slate-400 text-[11px]">{job.client_brand} • {job.campaign}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/20 text-[11px] font-medium">
                          {job.production_type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-200">{formatDate(job.date)}</div>
                        <div className="text-slate-400 truncate max-w-[150px]">{job.location}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-200">{job.pic}</div>
                        <div className="text-slate-400">{job.department}</div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-slate-200">
                        {formatVND(job.budget)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-purple-300">
                        {formatVND(actual)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`font-bold text-xs ${
                            isOver ? 'text-rose-400' : percent > 85 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {percent}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedJobId(job.job_id);
                              setActiveScreen('expense');
                            }}
                            className="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500 hover:text-slate-950 text-teal-300 rounded-lg text-xs font-semibold border border-teal-500/20 transition-all"
                          >
                            Expense Screen
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
