import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  Film,
  Sparkles,
  AlertCircle,
  Eye,
  CheckCheck,
  Building,
} from 'lucide-react';
import { formatVND, formatDateTime } from '../../utils/formatters';

export const ApprovalScreen: React.FC = () => {
  const {
    approvals,
    jobs,
    expenses,
    approveItem,
    rejectItem,
    batchApprove,
    setViewingDocument,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Waiting Approval' | 'Approved' | 'Rejected'>('Waiting Approval');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [activeRejectingId, setActiveRejectingId] = useState<string | null>(null);

  const filteredApprovals = approvals.filter((appr) => {
    if (statusFilter === 'ALL') return true;
    return appr.status === statusFilter;
  });

  const waitingList = approvals.filter((a) => a.status === 'Waiting Approval');
  const totalWaitingAmount = waitingList.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const approvedList = approvals.filter((a) => a.status === 'Approved');
  const totalApprovedAmount = approvedList.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  const handleConfirmReject = (approvalId: string) => {
    rejectItem(approvalId, 'Finance Manager', rejectReason || 'Từ chối duyệt / Chứng từ chưa hợp lệ');
    setActiveRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Title & Batch Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">05 — Phê Duyệt Chi Phí (Approval)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Finance & Manager Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kiểm tra chứng từ, phê duyệt hoàn ứng nhân viên (Reimbursement) và thanh toán nhà cung cấp
          </p>
        </div>

        {waitingList.length > 0 && (
          <button
            onClick={() => batchApprove(waitingList.map((w) => w.approval_id))}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <CheckCheck className="w-4 h-4" />
            <span>DUYỆT TẤT CẢ ({waitingList.length} PHIẾU)</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Waiting */}
        <div className="bg-slate-900 border border-cyan-500/30 bg-cyan-950/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
              Đang Chờ Duyệt
            </span>
            <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-cyan-300">
              {formatVND(totalWaitingAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <strong className="text-cyan-300">{waitingList.length}</strong> khoản cần phê duyệt gấp
          </p>
        </div>

        {/* Approved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Đã Phê Duyệt
            </span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatVND(totalApprovedAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Đã duyệt <strong className="text-slate-200">{approvedList.length}</strong> khoản chi
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Từ Chối (Rejected)
            </span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">
              {approvals.filter((a) => a.status === 'Rejected').length} phiếu
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cần nhân viên cập nhật lại hóa đơn</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['Waiting Approval', 'Approved', 'Rejected', 'ALL'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === status
                ? 'bg-slate-800 text-teal-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {status === 'Waiting Approval' && `Chờ Duyệt (${waitingList.length})`}
            {status === 'Approved' && `Đã Duyệt (${approvedList.length})`}
            {status === 'Rejected' && `Từ Chối (${approvals.filter((a) => a.status === 'Rejected').length})`}
            {status === 'ALL' && `Tất Cả (${approvals.length})`}
          </button>
        ))}
      </div>

      {/* Approval List */}
      {filteredApprovals.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
          <CheckCircle2 className="w-12 h-12 text-teal-500/60 mx-auto mb-2" />
          <p className="text-slate-200 font-bold text-base">Hàng đợi duyệt đang trống!</p>
          <p className="text-xs text-slate-400 mt-1">Tất cả các khoản chi đã được xử lý đầy đủ.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((appr) => {
            const job = jobs.find((j) => j.job_id === appr.job_id);
            const expense = expenses.find((e) => e.expense_id === appr.expense_id);
            const hasDoc = expense?.documents && expense.documents.length > 0;

            return (
              <div
                key={appr.approval_id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-lg ${
                  appr.status === 'Waiting Approval'
                    ? 'border-cyan-500/40 hover:border-cyan-400/60'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/20">
                        {appr.approval_type}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          appr.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : appr.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        }`}
                      >
                        {appr.status}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        Gửi lúc: {formatDateTime(appr.submitted_at)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-100 text-base">{appr.expense_desc}</h3>
                      {job && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Film className="w-3.5 h-3.5 text-teal-400" />
                          <span>
                            Dự án: <strong className="text-slate-300">{job.project_name}</strong> ({job.production_type})
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Người yêu cầu: <strong className="text-slate-200">{appr.requested_by}</strong>
                      </span>
                      {expense?.vendor && (
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          Vendor: <strong className="text-slate-200">{expense.vendor}</strong>
                        </span>
                      )}
                      {appr.comment && (
                        <span className="text-slate-400 italic">"{appr.comment}"</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 uppercase font-bold block">
                        Số tiền phê duyệt
                      </span>
                      <span className="text-xl font-black text-teal-300">
                        {formatVND(appr.amount)}
                      </span>
                    </div>

                    {/* Document View Button */}
                    {hasDoc && (
                      <button
                        onClick={() => setViewingDocument(expense!.documents![0])}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-400" />
                        <span>Xem Hóa Đơn ({expense!.documents!.length})</span>
                      </button>
                    )}

                    {/* Action buttons if Waiting */}
                    {appr.status === 'Waiting Approval' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveRejectingId(appr.approval_id)}
                          className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => approveItem(appr.approval_id, 'Finance Manager')}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold shadow-md shadow-teal-500/20 active:scale-95 transition-all"
                        >
                          Duyệt Chi
                        </button>
                      </div>
                    )}

                    {appr.status === 'Approved' && (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã duyệt bởi {appr.approver || 'Finance'}
                      </div>
                    )}

                    {appr.status === 'Rejected' && (
                      <div className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Đã từ chối
                      </div>
                    )}
                  </div>
                </div>

                {/* Reject note dialog */}
                {activeRejectingId === appr.approval_id && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-850 p-4 rounded-xl">
                    <p className="text-xs font-bold text-rose-400">Nhập lý do từ chối khoản chi:</p>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="VD: Thiếu hóa đơn đỏ VAT, số tiền không khớp bill..."
                      className="w-full px-3 py-2 bg-slate-900 border border-rose-500/40 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveRejectingId(null)}
                        className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleConfirmReject(appr.approval_id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg"
                      >
                        Xác nhận từ chối
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
