import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { PaymentStatus, PaidByType, Expense } from '../../types';
import {
  Receipt,
  Plus,
  Zap,
  Filter,
  Search,
  Calendar,
  MapPin,
  User,
  Building,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Download,
  Eye,
} from 'lucide-react';
import { formatVND, formatDate } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

export const ExpenseScreen: React.FC = () => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    selectedJob,
    expenses,
    deleteExpense,
    setIsAddExpenseOpen,
    setIsQuickAddOpen,
    setQuickAddDefaultPresetId,
    setViewingDocument,
    getJobExpenses,
    getJobActualCost,
    getJobCategoryCost,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!selectedJob) {
    return (
      <div className="text-center py-16 space-y-4">
        <Receipt className="w-16 h-16 text-slate-600 mx-auto" />
        <p className="text-slate-400">Không tìm thấy Media Job nào. Hãy tạo Job mới!</p>
      </div>
    );
  }

  const jobExpenses = getJobExpenses(selectedJob.job_id);
  const actualCost = getJobActualCost(selectedJob.job_id);
  const remainingCost = selectedJob.budget - actualCost;
  const isOverBudget = actualCost > selectedJob.budget;
  const burnRate = selectedJob.budget > 0 ? Math.round((actualCost / selectedJob.budget) * 100) : 0;

  // Filtered expenses list
  const filteredExpenses = jobExpenses.filter((exp) => {
    const matchesCat = activeCategoryFilter === 'ALL' || exp.category_id === activeCategoryFilter;
    const matchesStatus = activeStatusFilter === 'ALL' || exp.payment_status === activeStatusFilter;
    const matchesSearch =
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.sub_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.note && exp.note.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. Media Job Selector & Hero Banner (Section 3) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Job identity and metadata */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                {selectedJob.production_type}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300 font-semibold">{selectedJob.client_brand}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{formatDate(selectedJob.date)}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tight">
                {selectedJob.project_name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" /> {selectedJob.location}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" /> PIC: {selectedJob.pic}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-400" /> {selectedJob.department}
              </span>
            </div>
          </div>

          {/* Right: Budget, Actual, Remaining Dashboard Panel */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 backdrop-blur-md">
            {/* Budget */}
            <div className="px-3 py-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                Budget
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-200">
                {formatVND(selectedJob.budget)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Actual */}
            <div className="px-3 py-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-purple-400 block">
                Actual Cost
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-purple-300">
                {formatVND(actualCost)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Remaining */}
            <div className="px-3 py-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                {isOverBudget ? 'Vượt Ngân Sách' : 'Remaining (Còn dư)'}
              </span>
              <span
                className={`text-lg sm:text-xl font-black ${
                  isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isOverBudget ? `+${formatVND(actualCost - selectedJob.budget)}` : formatVND(remainingCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar banner */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">
              Tiến độ giải ngân ({burnRate}% của ngân sách {formatVND(selectedJob.budget)})
            </span>
            <span
              className={`font-bold ${
                isOverBudget ? 'text-rose-400' : burnRate > 85 ? 'text-amber-400' : 'text-teal-400'
              }`}
            >
              {isOverBudget ? '⚠️ Đã vượt ngân sách!' : `Còn khả dụng: ${formatVND(remainingCost)}`}
            </span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isOverBudget
                  ? 'bg-rose-500'
                  : burnRate > 85
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(burnRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. EXPENSE CATEGORIES SUMMARY GRID (Section 3 & 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>EXPENSE CATEGORIES (Chi phí theo nhóm)</span>
          </h2>
          <span className="text-xs text-slate-500">8 Nhóm chi phí chuẩn sản xuất</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => {
            const catCost = getJobCategoryCost(selectedJob.job_id, cat.id);
            const isSelected = activeCategoryFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryFilter(isSelected ? 'ALL' : cat.id);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500 ring-2 ring-teal-500/20 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: cat.bgLight, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  {catCost > 0 && (
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-300 truncate">{cat.name}</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-100 mt-1 truncate">
                  {formatVND(catCost)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Action Buttons & Table Controls (Section 3 & 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-base">Danh Sách Chi Phí Buổi Shooting</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {filteredExpenses.length} mục
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Add Fast Button */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>+ QUICK ADD (ON-SET)</span>
            </button>

            {/* Standard Add Expense Button */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD EXPENSE (CHI TIẾT)</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mô tả, vendor, ghi chú..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Paid">Paid (Đã thanh toán)</option>
              <option value="Reimbursement">Reimbursement (Hoàn ứng)</option>
              <option value="Waiting Approval">Waiting Approval (Chờ duyệt)</option>
              <option value="Pending">Pending (Chờ xử lý)</option>
              <option value="Approved">Approved (Đã duyệt)</option>
              <option value="Rejected">Rejected (Từ chối)</option>
            </select>

            {activeCategoryFilter !== 'ALL' && (
              <button
                onClick={() => setActiveCategoryFilter('ALL')}
                className="px-3 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs rounded-xl border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>Xóa lọc Category</span>
                <span className="font-bold">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Expenses List Table (Section 4) */}
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">Chưa có khoản chi nào trong bộ lọc này</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Hãy nhấn nút Add Expense hoặc Quick Add để ghi lại chi phí ngay.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                + Quick Add Ngay
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Category / Sub-category</th>
                  <th className="px-4 py-3.5">Mô tả & Vendor</th>
                  <th className="px-4 py-3.5 text-center">Số lượng / Đơn vị</th>
                  <th className="px-4 py-3.5 text-right">Đơn giá</th>
                  <th className="px-4 py-3.5 text-right">TOTAL (VND)</th>
                  <th className="px-4 py-3.5 text-center">Paid by</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-center">Chứng từ</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredExpenses.map((exp) => {
                  const catDef = CATEGORIES.find((c) => c.id === exp.category_id);
                  const hasDoc = exp.documents && exp.documents.length > 0;

                  return (
                    <tr key={exp.expense_id} className="hover:bg-slate-850/50 transition-colors">
                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: catDef?.bgLight, color: catDef?.color }}
                          >
                            <CategoryIcon name={catDef?.icon || 'HelpCircle'} className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block">{catDef?.name || exp.category_id}</span>
                            <span className="text-[11px] text-teal-400">{exp.sub_category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Description & Vendor */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-semibold text-slate-100 text-xs">{exp.description}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-500">Vendor:</span>
                          <span className="text-slate-300 font-medium">{exp.vendor}</span>
                        </div>
                        {exp.note && (
                          <div className="text-slate-500 text-[10px] italic mt-0.5 truncate">
                            Note: {exp.note}
                          </div>
                        )}
                      </td>

                      {/* Qty & Unit */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="font-semibold text-slate-200">
                          {exp.quantity} {exp.unit}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td className="px-4 py-3.5 text-right font-medium text-slate-300">
                        {formatVND(exp.unit_price)}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 text-right font-black text-teal-300 text-sm">
                        {formatVND(exp.total)}
                      </td>

                      {/* Paid by */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                          {exp.paid_by}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            exp.payment_status === 'Paid' || exp.payment_status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : exp.payment_status === 'Reimbursement'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : exp.payment_status === 'Waiting Approval'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : exp.payment_status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {exp.payment_status}
                        </span>
                      </td>

                      {/* Documents / Receipts */}
                      <td className="px-4 py-3.5 text-center">
                        {hasDoc ? (
                          <button
                            onClick={() => setViewingDocument(exp.documents![0])}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg text-[11px] font-semibold border border-teal-500/30 transition-colors"
                            title="Xem hóa đơn / chứng từ"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Bill ({exp.documents!.length})</span>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Xác nhận xóa khoản chi "${exp.description}"?`)) {
                              deleteExpense(exp.expense_id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Xóa khoản chi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
