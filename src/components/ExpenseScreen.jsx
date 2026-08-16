import { useState, useMemo } from 'react';
import { 
  Plus, 
  Zap, 
  FileText, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Download, 
  Paperclip, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Tag,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  CATEGORY_DATABASE, 
  PAYMENT_STATUSES, 
  JOB_WORKFLOW_STATUSES 
} from '../data/categories';
import { formatCurrency, formatShortCurrency } from '../utils/storage';
import { PaymentStatusBadge, WorkflowStatusBadge } from './StatusBadge';

const ExpenseScreen = ({ 
  job, 
  onUpdateJob, 
  onBack, 
  onOpenAddExpense, 
  onOpenQuickAdd, 
  onOpenReport 
}) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const budget = Number(job.budget || 0);
  const expenses = job.expenses || [];

  // Totals calculations
  const { actualCost, remaining, isOverBudget, utilization } = useMemo(() => {
    const validExpenses = expenses.filter(e => e.paymentStatus !== 'Rejected');
    const actual = validExpenses.reduce((sum, e) => sum + Number(e.total || 0), 0);
    const rem = budget - actual;
    const isOver = actual > budget;
    const util = budget > 0 ? ((actual / budget) * 100).toFixed(1) : 0;
    return { actualCost: actual, remaining: rem, isOverBudget: isOver, utilization: util };
  }, [expenses, budget]);

  // Category totals mapping
  const categoryTotals = useMemo(() => {
    const map = {};
    CATEGORY_DATABASE.forEach(cat => {
      const items = expenses.filter(e => e.category === cat.id && e.paymentStatus !== 'Rejected');
      const total = items.reduce((sum, e) => sum + Number(e.total || 0), 0);
      map[cat.id] = { total, count: items.length };
    });
    return map;
  }, [expenses]);

  // Filtered expense list
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchCat = selectedCategoryTab === 'ALL' || exp.category === selectedCategoryTab;
      const matchStatus = selectedStatusFilter === 'ALL' || exp.paymentStatus === selectedStatusFilter;
      const matchSearch = 
        (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.vendor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.subCategory || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.note || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchCat && matchStatus && matchSearch;
    });
  }, [expenses, selectedCategoryTab, selectedStatusFilter, searchTerm]);

  // Handlers for modifying expenses
  const handleDeleteExpense = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản chi này không?')) {
      const updatedExpenses = expenses.filter(e => e.id !== id);
      onUpdateJob({ ...job, expenses: updatedExpenses });
    }
  };

  const handleQuickStatusChange = (id, newStatus) => {
    const updatedExpenses = expenses.map(e => e.id === id ? { ...e, paymentStatus: newStatus } : e);
    onUpdateJob({ ...job, expenses: updatedExpenses });
  };

  const handleWorkflowStatusChange = (e) => {
    onUpdateJob({ ...job, status: e.target.value });
  };

  return (
    <div className="expense-screen-container animate-fade-in">
      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          <ArrowLeft size={16} /> Quay lại Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button className="btn btn-secondary btn-sm" onClick={onOpenReport}>
            <FileText size={16} /> MEDIA JOB REPORT
          </button>
          <button 
            className="btn btn-sm shadow-glow" 
            onClick={onOpenQuickAdd}
            style={{ background: 'linear-gradient(135deg, #eab308, #f59e0b)', color: '#000', fontWeight: 700 }}
          >
            <Zap size={16} /> QUICK ADD (ON-SET)
          </button>
          <button className="btn btn-primary btn-sm shadow-glow" onClick={() => onOpenAddExpense()}>
            <Plus size={16} /> + ADD EXPENSE
          </button>
        </div>
      </div>

      {/* Main Job Banner */}
      <div className={`job-detail-banner glass-panel ${isOverBudget ? 'job-card-over' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="production-pill">{job.productionType}</span>
              <span className="badge-highlight">{job.campaign}</span>
              {isOverBudget && <span className="badge-alert">🔴 OVER BUDGET +{formatShortCurrency(actualCost - budget)}</span>}
            </div>
            <h1 className="text-2xl font-bold">{job.projectName}</h1>
            <div className="job-meta-row flex items-center gap-4 text-sm text-muted mt-2 flex-wrap">
              <span className="flex items-center gap-1"><Calendar size={14} /> {job.date}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'N/A'}</span>
              <span className="flex items-center gap-1"><User size={14} /> PIC: <strong>{job.pic}</strong></span>
              {job.client && <span className="flex items-center gap-1">Client: <strong>{job.client}</strong></span>}
            </div>
          </div>

          <div className="workflow-status-box glass p-3 rounded-lg flex flex-col gap-1 items-end">
            <span className="text-xs text-muted font-medium">Job Workflow Status:</span>
            <select
              value={job.status || 'Shooting in Progress'}
              onChange={handleWorkflowStatusChange}
              className="status-select font-semibold"
              style={{ padding: '4px 8px', fontSize: '0.85rem' }}
            >
              {JOB_WORKFLOW_STATUSES.map(st => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Highlights Grid */}
        <div className="summary-grid mt-6">
          <div className="summary-card glass">
            <span className="summary-label">APPROVED BUDGET</span>
            <span className="summary-value font-mono" style={{ color: '#3b82f6' }}>
              {formatShortCurrency(budget)}
            </span>
            <span className="text-xs text-muted font-mono">{formatCurrency(budget)}</span>
          </div>

          <div className="summary-card glass highlight-border">
            <span className="summary-label">ACTUAL COST (THỰC CHI)</span>
            <span className="summary-value font-mono text-purple">
              {formatShortCurrency(actualCost)}
            </span>
            <span className="text-xs text-muted font-mono">{formatCurrency(actualCost)}</span>
          </div>

          <div className="summary-card glass">
            <span className="summary-label">REMAINING (CÒN LẠI)</span>
            <span className="summary-value font-mono" style={{ color: remaining >= 0 ? '#22c55e' : '#ef4444' }}>
              {formatShortCurrency(remaining)}
            </span>
            <span className="text-xs text-muted font-mono">{formatCurrency(remaining)}</span>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="budget-progress-box mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted">Tỷ lệ sử dụng ngân sách: <strong className="text-main">{utilization}%</strong></span>
            <span className="text-muted">{isOverBudget ? '⚠️ Đã vượt hạn mức ngân sách' : '✅ Trong hạn mức cho phép'}</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${isOverBudget ? 'fill-red' : Number(utilization) > 85 ? 'fill-yellow' : 'fill-primary'}`} 
              style={{ width: `${Math.min(100, Number(utilization))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Expense Categories Bar (Scrollable chips) */}
      <div className="categories-strip-container mt-6">
        <div className="categories-strip">
          <button
            className={`cat-chip ${selectedCategoryTab === 'ALL' ? 'cat-chip-active' : ''}`}
            onClick={() => setSelectedCategoryTab('ALL')}
          >
            <span className="cat-chip-title">TẤT CẢ (ALL)</span>
            <span className="cat-chip-amount font-mono">{formatShortCurrency(actualCost)}</span>
          </button>

          {CATEGORY_DATABASE.map(cat => {
            const data = categoryTotals[cat.id] || { total: 0, count: 0 };
            const isActive = selectedCategoryTab === cat.id;
            return (
              <button
                key={cat.id}
                className={`cat-chip ${isActive ? 'cat-chip-active' : ''}`}
                onClick={() => setSelectedCategoryTab(cat.id)}
              >
                <span className="cat-chip-title">{cat.name}</span>
                <span className="cat-chip-amount font-mono">
                  {formatShortCurrency(data.total)}
                  {data.count > 0 && <span className="cat-chip-count">({data.count})</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Expenses Table Section */}
      <div className="glass-panel mt-6">
        {/* Table Filters Header */}
        <div className="table-controls-bar flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="search-input-wrapper flex-1 md:w-72">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm khoản chi, NCC, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search"
              />
            </div>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="status-filter-select"
              style={{ minWidth: '160px' }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              {PAYMENT_STATUSES.map(st => (
                <option key={st.id} value={st.id}>{st.dot} {st.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Hiển thị {filteredExpenses.length} khoản chi</span>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => onOpenAddExpense(selectedCategoryTab !== 'ALL' ? selectedCategoryTab : 'LOCATION')}
            >
              <Plus size={16} /> Thêm vào mục này
            </button>
          </div>
        </div>

        {/* Table Data */}
        {filteredExpenses.length === 0 ? (
          <div className="empty-state text-center py-10">
            <Layers size={40} className="empty-icon mx-auto mb-2 text-muted" />
            <h4 className="font-semibold text-main">Không tìm thấy khoản chi nào</h4>
            <p className="text-sm text-muted mt-1 mb-4">Nhấn "+ Thêm vào mục này" hoặc "Quick Add" để tạo khoản chi mới.</p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onOpenAddExpense(selectedCategoryTab !== 'ALL' ? selectedCategoryTab : 'LOCATION')}
            >
              <Plus size={16} /> + Thêm Khoản Chi
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Category / Sub-category</th>
                  <th>Description</th>
                  <th>Vendor (NCC)</th>
                  <th className="text-center">Qty x Đơn giá</th>
                  <th className="text-right">Thành Tiền (VND)</th>
                  <th>Paid By</th>
                  <th>Payment Status</th>
                  <th>Receipt</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(exp => {
                  const catObj = CATEGORY_DATABASE.find(c => c.id === exp.category);
                  const isRejected = exp.paymentStatus === 'Rejected';

                  return (
                    <tr key={exp.id} className={isRejected ? 'row-rejected' : ''}>
                      <td>
                        <div className="cat-badge-cell">
                          <span className="cat-pill">{catObj ? catObj.name : exp.category}</span>
                          <strong className="subcat-title block text-sm mt-0.5">{exp.subCategory || 'General'}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="desc-cell">
                          <span className="font-semibold text-main">{exp.description}</span>
                          {exp.note && <span className="desc-note block text-xs text-muted mt-0.5">{exp.note}</span>}
                        </div>
                      </td>

                      <td>
                        <span className="vendor-name text-sm text-muted">{exp.vendor || '—'}</span>
                      </td>

                      <td className="text-center">
                        <span className="text-xs font-mono">
                          {exp.quantity || 1} {exp.unit || 'Item'} × {formatShortCurrency(exp.unitPrice || 0)}
                        </span>
                      </td>

                      <td className="text-right font-mono font-bold">
                        <span className={isRejected ? 'text-strikethrough text-muted' : 'text-purple'}>
                          {formatCurrency(exp.total)}
                        </span>
                      </td>

                      <td>
                        <span className="badge-paidby">{exp.paidBy || 'Company'}</span>
                      </td>

                      <td>
                        <PaymentStatusBadge status={exp.paymentStatus || 'Pending'} />
                      </td>

                      <td>
                        {exp.receiptName ? (
                          <span className="receipt-attachment-pill flex items-center gap-1" title={exp.receiptName}>
                            <Paperclip size={12} color="#22c55e" />
                            <span className="truncate max-w-24 text-xs text-green">{exp.receiptName}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>

                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            className="btn-icon" 
                            title="Sửa khoản chi"
                            onClick={() => onOpenAddExpense(exp.category, exp)}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            className="btn-icon btn-icon-danger" 
                            title="Xóa khoản chi"
                            onClick={() => handleDeleteExpense(exp.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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

export default ExpenseScreen;
