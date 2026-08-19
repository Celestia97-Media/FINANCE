import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  FileSpreadsheet,
  PieChart as PieIcon,
  Filter,
  CheckCircle,
  Calendar,
  Layers,
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
  Legend,
} from 'recharts';
import * as XLSX from 'xlsx';

export const ReportScreen: React.FC = () => {
  const { jobs, expenses, getJobActualCost, getJobCategoryBreakdown, stats } = useApp();

  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');

  // Filtered expenses based on selection
  const relevantExpenses = expenses.filter((e) => {
    if (selectedJobFilter !== 'ALL') {
      return e.job_id === selectedJobFilter;
    }
    return true;
  });

  // Calculate category totals
  const categoryTotals: Record<string, number> = {};
  relevantExpenses
    .filter((e) => e.payment_status !== 'Rejected')
    .forEach((e) => {
      categoryTotals[e.category_id] = (categoryTotals[e.category_id] || 0) + (Number(e.total) || 0);
    });

  const pieData = CATEGORIES.map((cat) => ({
    name: cat.name,
    value: categoryTotals[cat.id] || 0,
    color: cat.color,
  })).filter((item) => item.value > 0);

  // Category vs Budget breakdown bar data
  const categoryBarData = CATEGORIES.map((cat) => {
    const totalSpent = categoryTotals[cat.id] || 0;
    return {
      name: cat.name,
      'Chi tiêu thực tế': totalSpent,
    };
  });

  // Export to Excel function using XLSX
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Overview Summary
    const summaryData = [
      ['BÁO CÁO TỔNG QUAN TÀI CHÍNH & CHI PHÍ MEDIA PRODUCTION'],
      ['Ngày xuất báo cáo:', new Date().toLocaleDateString('vi-VN')],
      [],
      ['Chỉ số', 'Giá trị'],
      ['Tổng số Media Job:', stats.totalJobsThisMonth],
      ['Tổng Ngân Sách (Budget):', stats.totalBudget],
      ['Tổng Chi Thực Tế (Actual Cost):', stats.totalActualCost],
      ['Chi Phí Phát Sinh Vượt Ngân Sách:', stats.totalIncurredCost],
      ['Số Job Vượt Ngân Sách:', stats.overBudgetJobCount],
      ['Số Khoản Chờ Thanh Toán:', stats.pendingPaymentCount],
      ['Số Khoản Đang Chờ Duyệt:', stats.waitingApprovalCount],
      [],
      ['CHI TIẾT THEO 8 NHÓM HẠNG MỤC (CATEGORIES)'],
      ['Mã Nhóm', 'Tên Nhóm Chi Phí', 'Tổng Chi Phí (VND)'],
      ...CATEGORIES.map((c) => [c.id, c.name, categoryTotals[c.id] || 0]),
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'TongQuan_KPI');

    // Sheet 2: Media Jobs List
    const jobsData = [
      [
        'Mã Job',
        'Tên Dự Án (Project Name)',
        'Chiến Dịch (Campaign)',
        'Loại Hình (Production Type)',
        'Ngày Quay',
        'Địa Điểm',
        'PIC',
        'Phòng Ban',
        'Khách Hàng / Brand',
        'Ngân Sách (Budget VND)',
        'Thực Tế (Actual VND)',
        'Chênh Lệch (Variance)',
        'Trạng Thái',
      ],
      ...jobs.map((j) => {
        const actual = getJobActualCost(j.job_id);
        return [
          j.job_id,
          j.project_name,
          j.campaign,
          j.production_type,
          j.date,
          j.location,
          j.pic,
          j.department,
          j.client_brand,
          j.budget,
          actual,
          j.budget - actual,
          j.status,
        ];
      }),
    ];
    const wsJobs = XLSX.utils.aoa_to_sheet(jobsData);
    XLSX.utils.book_append_sheet(wb, wsJobs, 'DanhSach_MediaJobs');

    // Sheet 3: Expenses Detail
    const expensesData = [
      [
        'Mã Chi Phí',
        'Mã Job',
        'Nhóm (Category)',
        'Hạng Mục Con (Sub-category)',
        'Mô Tả Chi Tiết',
        'Nhà Cung Cấp (Vendor)',
        'Số Lượng',
        'Đơn Vị',
        'Đơn Giá (VND)',
        'Tổng Tiền (Total VND)',
        'Người Chi Trả (Paid By)',
        'Trạng Thái Thanh Toán',
        'Ghi Chú',
        'Người Tạo',
        'Ngày Tạo',
      ],
      ...expenses.map((e) => [
        e.expense_id,
        e.job_id,
        e.category_id,
        e.sub_category,
        e.description,
        e.vendor,
        e.quantity,
        e.unit,
        e.unit_price,
        e.total,
        e.paid_by,
        e.payment_status,
        e.note || '',
        e.created_by,
        e.created_at,
      ]),
    ];
    const wsExpenses = XLSX.utils.aoa_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(wb, wsExpenses, 'ChiTiet_Expenses');

    // Trigger download
    XLSX.writeFile(wb, `BaoCao_Finance_Media_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header & Export Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">
              06 — Báo Cáo & Phân Tích Ngân Sách (Report)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Budget vs Actual Analytics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Báo cáo chi tiết quyết toán dự án, cơ cấu chi phí 8 nhóm và xuất file Excel kế toán
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            title="In phiếu quyết toán"
          >
            <Printer className="w-4 h-4" />
            <span>In Phiếu Quyết Toán</span>
          </button>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>XUẤT EXCEL (.XLSX)</span>
          </button>
        </div>
      </div>

      {/* Filter by Job selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold text-slate-300">Phạm Vi Báo Cáo:</span>
        </div>
        <select
          value={selectedJobFilter}
          onChange={(e) => setSelectedJobFilter(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="ALL">Toàn bộ tất cả Media Jobs ({jobs.length} dự án)</option>
          {jobs.map((j) => (
            <option key={j.job_id} value={j.job_id}>
              {j.project_name} ({j.production_type})
            </option>
          ))}
        </select>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Chart 1: Category breakdown bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Tổng Chi Phí Thực Tế Theo Hạng Mục</h3>
            <p className="text-xs text-slate-400">Chi tiêu phân bổ trên 8 nhóm danh mục</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [formatVND(Number(val) || 0), 'Chi phí']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Chi tiêu thực tế" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category share pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Tỉ Trọng Cơ Cấu Chi Phí (Cost Share)</h3>
            <p className="text-xs text-slate-400">Phần trăm ngân sách của từng nhóm</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatVND(Number(val) || 0)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t border-slate-800 pt-3">
            {pieData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-300 truncate">{cat.name}:</span>
                <span className="font-bold text-slate-100">{formatVND(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Financial Settlement Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Print Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 print:border-black pb-5 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-400 print:text-teal-700 uppercase tracking-wider block">
              BẢNG TỔNG HỢP THANH QUYẾT TOÁN CHI PHÍ MEDIA PRODUCTION
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 print:text-black mt-1">
              FINANCE MEDIA SETTLEMENT REPORT
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Thời gian xuất: {new Date().toLocaleDateString('vi-VN')} | Đơn vị tính: Việt Nam Đồng (VND)
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Tổng Chi Thực Tế:</span>
            <span className="text-2xl font-black text-teal-300 print:text-teal-700">
              {formatVND(
                relevantExpenses
                  .filter((e) => e.payment_status !== 'Rejected')
                  .reduce((sum, e) => sum + e.total, 0)
              )}
            </span>
          </div>
        </div>

        {/* 8 Categories summary table */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider mb-3">
            Bảng Tổng Kết Theo 8 Nhóm Hạng Mục
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 print:bg-gray-100 text-slate-300 print:text-black uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Mã nhóm</th>
                  <th className="px-4 py-3">Tên nhóm chi phí</th>
                  <th className="px-4 py-3 text-center">Số khoản chi</th>
                  <th className="px-4 py-3 text-right">Tổng thành tiền (VND)</th>
                  <th className="px-4 py-3 text-right">Tỉ trọng (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200 text-slate-300 print:text-black">
                {CATEGORIES.map((cat) => {
                  const total = categoryTotals[cat.id] || 0;
                  const count = relevantExpenses.filter((e) => e.category_id === cat.id).length;
                  const allTotal = relevantExpenses.reduce((s, e) => s + e.total, 0);
                  const percent = allTotal > 0 ? ((total / allTotal) * 100).toFixed(1) : '0';

                  return (
                    <tr key={cat.id} className="hover:bg-slate-850/40">
                      <td className="px-4 py-3 font-mono text-teal-400 print:text-teal-800 font-bold">
                        {cat.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-200 print:text-black">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{count}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-100 print:text-black">
                        {formatVND(total)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Expenses List */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider mb-3">
            Bảng Kê Chi Tiết Từng Khoản Chi
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 print:bg-gray-100 text-slate-300 print:text-black uppercase font-semibold">
                <tr>
                  <th className="px-3 py-2.5">STT</th>
                  <th className="px-3 py-2.5">Hạng mục</th>
                  <th className="px-3 py-2.5">Nội dung / Diễn giải</th>
                  <th className="px-3 py-2.5">Nhà cung cấp</th>
                  <th className="px-3 py-2.5 text-center">SL & Đơn vị</th>
                  <th className="px-3 py-2.5 text-right">Đơn giá</th>
                  <th className="px-3 py-2.5 text-right">Thành tiền (VND)</th>
                  <th className="px-3 py-2.5 text-center">Hình thức chi</th>
                  <th className="px-3 py-2.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-200 text-slate-300 print:text-black">
                {relevantExpenses.map((exp, idx) => (
                  <tr key={exp.expense_id}>
                    <td className="px-3 py-2.5 text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-bold text-teal-400 print:text-teal-800">
                      {exp.category_id} / {exp.sub_category}
                    </td>
                    <td className="px-3 py-2.5 text-slate-200 print:text-black font-medium">
                      {exp.description}
                    </td>
                    <td className="px-3 py-2.5">{exp.vendor}</td>
                    <td className="px-3 py-2.5 text-center">
                      {exp.quantity} {exp.unit}
                    </td>
                    <td className="px-3 py-2.5 text-right">{formatVND(exp.unit_price)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-100 print:text-black">
                      {formatVND(exp.total)}
                    </td>
                    <td className="px-3 py-2.5 text-center">{exp.paid_by}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-semibold">{exp.payment_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures area for print */}
        <div className="grid grid-cols-3 gap-4 pt-10 text-center text-xs print:text-black text-slate-400">
          <div>
            <p className="font-bold text-slate-200 print:text-black uppercase">Người Lập Phiếu</p>
            <p className="text-[11px] italic mt-0.5">(Ký & ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-medium text-slate-300 print:text-black">Media Producer</p>
          </div>
          <div>
            <p className="font-bold text-slate-200 print:text-black uppercase">Kế Toán / Finance</p>
            <p className="text-[11px] italic mt-0.5">(Ký & ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-medium text-slate-300 print:text-black">Kế toán thanh toán</p>
          </div>
          <div>
            <p className="font-bold text-slate-200 print:text-black uppercase">Giám Đốc Sản Xuất</p>
            <p className="text-[11px] italic mt-0.5">(Ký & ghi rõ họ tên)</p>
            <div className="h-16" />
            <p className="font-medium text-slate-300 print:text-black">Executive Producer</p>
          </div>
        </div>
      </div>
    </div>
  );
};
