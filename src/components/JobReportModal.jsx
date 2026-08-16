import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Building 
} from 'lucide-react';
import { useState } from 'react';
import { CATEGORY_DATABASE } from '../data/categories';
import { formatCurrency, formatShortCurrency } from '../utils/storage';

const JobReportModal = ({ isOpen, onClose, job }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const budget = Number(job.budget || 0);
  const activeExpenses = (job.expenses || []).filter(e => e.paymentStatus !== 'Rejected');
  const actualCost = activeExpenses.reduce((sum, e) => sum + Number(e.total || 0), 0);
  const remaining = budget - actualCost;
  const utilization = budget > 0 ? ((actualCost / budget) * 100).toFixed(1) : '0';

  // Category breakdown calculation
  const breakdown = CATEGORY_DATABASE.map(cat => {
    const catExpenses = activeExpenses.filter(e => e.category === cat.id);
    const catTotal = catExpenses.reduce((sum, e) => sum + Number(e.total || 0), 0);
    const pct = actualCost > 0 ? ((catTotal / actualCost) * 100).toFixed(1) : '0';
    return {
      id: cat.id,
      name: cat.name,
      total: catTotal,
      percentage: pct,
      count: catExpenses.length
    };
  }).filter(c => c.total > 0);

  // Generate plain text report
  const generatePlainText = () => {
    let text = `==============================\n`;
    text += `MEDIA JOB REPORT\n`;
    text += `==============================\n`;
    text += `Project: ${job.projectName}\n`;
    text += `Campaign: ${job.campaign}\n`;
    text += `Production: ${job.productionType}\n`;
    text += `Date: ${job.date}\n`;
    text += `Location: ${job.location || 'N/A'}\n`;
    text += `PIC: ${job.pic || 'N/A'}\n\n`;
    text += `COST SUMMARY\n`;
    text += `------------------------------\n`;
    text += `Approved Budget: ${formatCurrency(budget)}\n`;
    text += `Actual Cost:     ${formatCurrency(actualCost)}\n`;
    text += `Remaining:       ${formatCurrency(remaining)}\n`;
    text += `Budget Utilization: ${utilization}%\n\n`;
    text += `COST BREAKDOWN\n`;
    text += `------------------------------\n`;
    breakdown.forEach(item => {
      text += `${item.name} — ${formatShortCurrency(item.total)} (${formatCurrency(item.total)}) — ${item.percentage}%\n`;
    });
    text += `------------------------------\n`;
    text += `TOTAL: ${formatCurrency(actualCost)}\n`;
    text += `==============================\n`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-container glass-panel animate-scale-up" style={{ maxWidth: '680px' }}>
        <div className="modal-header flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="modal-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">MEDIA JOB REPORT</h2>
              <p className="text-sm text-muted">Báo cáo tài chính & quyết toán buổi sản xuất</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
              {copied ? 'Đã Copy' : 'Copy Text'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> In / PDF
            </button>
            <button className="btn-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body mt-4 flex-col gap-6 printable-report">
          {/* Header info */}
          <div className="report-header-card glass p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="badge-highlight mb-1 inline-block">{job.productionType}</span>
                <h3 className="text-2xl font-bold">{job.projectName}</h3>
                <p className="text-sm text-gradient font-semibold">{job.campaign}</p>
              </div>
              <div className="text-right text-sm text-muted">
                <div>Ngày: <strong>{job.date}</strong></div>
                <div>PIC: <strong>{job.pic}</strong></div>
                <div>Địa điểm: <strong>{job.location}</strong></div>
              </div>
            </div>
          </div>

          {/* Cost Summary Section */}
          <div>
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">COST SUMMARY</h4>
            <div className="summary-grid">
              <div className="summary-card glass">
                <span className="summary-label">Approved Budget</span>
                <span className="summary-value font-mono" style={{ color: '#3b82f6' }}>
                  {formatShortCurrency(budget)}
                </span>
                <span className="text-xs text-muted font-mono">{formatCurrency(budget)}</span>
              </div>

              <div className="summary-card glass highlight-border">
                <span className="summary-label">Actual Cost</span>
                <span className="summary-value font-mono text-purple">
                  {formatShortCurrency(actualCost)}
                </span>
                <span className="text-xs text-muted font-mono">{formatCurrency(actualCost)}</span>
              </div>

              <div className="summary-card glass">
                <span className="summary-label">Remaining</span>
                <span className="summary-value font-mono" style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
                  {formatShortCurrency(remaining)}
                </span>
                <span className="text-xs text-muted font-mono">{formatCurrency(remaining)}</span>
              </div>
            </div>

            <div className="utilization-banner glass p-3 rounded-lg flex items-center justify-between mt-3">
              <span className="text-sm font-semibold">Budget Utilization (Tỷ lệ sử dụng ngân sách):</span>
              <span className="text-lg font-bold font-mono" style={{ color: Number(utilization) > 100 ? '#ef4444' : '#818cf8' }}>
                {utilization}%
              </span>
            </div>
          </div>

          {/* Cost Breakdown List */}
          <div>
            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">COST BREAKDOWN</h4>
            <div className="breakdown-list flex-col gap-2">
              {breakdown.map(item => (
                <div key={item.id} className="breakdown-row glass p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-xs text-muted">({item.count} items)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono font-bold">{formatShortCurrency(item.total)}</span>
                      <span className="text-xs text-muted ml-2 font-mono">({formatCurrency(item.total)})</span>
                    </div>
                    <span className="badge-percent font-mono font-bold">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}

              <div className="breakdown-total p-3 flex justify-between items-center border-t-2 mt-2">
                <span className="font-bold text-lg">TOTAL ACTUAL EXPENDITURE</span>
                <span className="font-bold text-xl font-mono text-purple">{formatCurrency(actualCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReportModal;
