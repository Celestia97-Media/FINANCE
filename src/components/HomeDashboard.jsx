import { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Film, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  ArrowRight,
  Search,
  DollarSign,
  Layers
} from 'lucide-react';
import { formatCurrency, formatShortCurrency } from '../utils/storage';
import { WorkflowStatusBadge } from './StatusBadge';

const HomeDashboard = ({ jobs, onSelectJob, onOpenCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Compute Global Metrics
  const metrics = useMemo(() => {
    let totalBudget = 0;
    let totalActual = 0;
    let totalOtherExpenses = 0; // Chi phí phát sinh (Category: OTHER)
    let overBudgetJobsCount = 0;
    let pendingPaymentsCount = 0;
    let waitingApprovalCount = 0;

    jobs.forEach(job => {
      totalBudget += Number(job.budget || 0);
      
      let jobActual = 0;
      (job.expenses || []).forEach(exp => {
        if (exp.paymentStatus !== 'Rejected') {
          const cost = Number(exp.total || 0);
          jobActual += cost;
          
          if (exp.category === 'OTHER') {
            totalOtherExpenses += cost;
          }

          if (exp.paymentStatus === 'Pending' || exp.paymentStatus === 'Reimbursement') {
            pendingPaymentsCount++;
          }
          if (exp.paymentStatus === 'Waiting Approval') {
            waitingApprovalCount++;
          }
        }
      });

      totalActual += jobActual;
      if (jobActual > Number(job.budget || 0)) {
        overBudgetJobsCount++;
      }
    });

    const totalJobs = jobs.length;
    const remainingBudget = totalBudget - totalActual;
    const utilizationRate = totalBudget > 0 ? ((totalActual / totalBudget) * 100).toFixed(1) : 0;

    return {
      totalJobs,
      totalBudget,
      totalActual,
      remainingBudget,
      utilizationRate,
      totalOtherExpenses,
      overBudgetJobsCount,
      pendingPaymentsCount,
      waitingApprovalCount
    };
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = 
        j.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.client && j.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (j.pic && j.pic.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchType = filterType === 'ALL' || j.productionType === filterType;
      return matchSearch && matchType;
    });
  }, [jobs, searchTerm, filterType]);

  return (
    <div className="dashboard-wrapper animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="hero-banner glass-panel">
        <div className="hero-content">
          <div>
            <span className="badge-highlight">OVERVIEW DASHBOARD</span>
            <h1 className="hero-title mt-2">
              Media Production <span className="text-gradient">Financial Hub</span>
            </h1>
            <p className="hero-description">
              Hệ thống theo dõi ngân sách, quản lý dòng tiền và kiểm soát chi phí sản xuất Media thời gian thực.
            </p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg shadow-glow" onClick={onOpenCreate}>
              <PlusCircle size={20} /> CREATE NEW MEDIA JOB
            </button>
          </div>
        </div>
      </div>

      {/* Global Metrics Cards Grid */}
      <div className="metrics-grid mt-6">
        {/* Metric 1: Total Jobs */}
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Media Jobs Tháng Này</span>
            <div className="metric-icon-box" style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8' }}>
              <Film size={20} />
            </div>
          </div>
          <div className="metric-value">{metrics.totalJobs} <span className="metric-unit">buổi</span></div>
          <div className="metric-footer text-muted">
            <span>Tất cả các dự án đang kích hoạt</span>
          </div>
        </div>

        {/* Metric 2: Total Budget */}
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Tổng Budget Được Duyệt</span>
            <div className="metric-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="metric-value font-mono">{formatCurrency(metrics.totalBudget)}</div>
          <div className="metric-footer text-muted">
            <span>Hạn mức tổng cho toàn team</span>
          </div>
        </div>

        {/* Metric 3: Total Actual Cost */}
        <div className="metric-card glass-panel highlight-border">
          <div className="metric-header">
            <span className="metric-title">Tổng Actual Cost (Thực chi)</span>
            <div className="metric-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value font-mono text-purple">{formatCurrency(metrics.totalActual)}</div>
          <div className="metric-footer flex items-center justify-between">
            <span className="text-muted">Utilization Rate:</span>
            <span className="font-bold" style={{ color: metrics.utilizationRate > 100 ? '#ef4444' : '#22c55e' }}>
              {metrics.utilizationRate}%
            </span>
          </div>
        </div>

        {/* Metric 4: Total Other Expenses */}
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="metric-title">Chi Phí Phát Sinh (Other)</span>
            <div className="metric-icon-box" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-value font-mono text-yellow">{formatCurrency(metrics.totalOtherExpenses)}</div>
          <div className="metric-footer text-muted">
            <span>Các khoản mua gấp & phát sinh</span>
          </div>
        </div>
      </div>

      {/* Secondary Status Alert Bar */}
      <div className="status-kpis-grid mt-4">
        <div className="status-kpi-item glass">
          <div className="kpi-bullet bg-red"></div>
          <div>
            <div className="kpi-num font-mono">{metrics.overBudgetJobsCount}</div>
            <div className="kpi-label">Job Vượt Ngân Sách</div>
          </div>
        </div>

        <div className="status-kpi-item glass">
          <div className="kpi-bullet bg-yellow"></div>
          <div>
            <div className="kpi-num font-mono">{metrics.pendingPaymentsCount}</div>
            <div className="kpi-label">Khoản Chờ Thanh Toán/Hoàn</div>
          </div>
        </div>

        <div className="status-kpi-item glass">
          <div className="kpi-bullet bg-blue"></div>
          <div>
            <div className="kpi-num font-mono">{metrics.waitingApprovalCount}</div>
            <div className="kpi-label">Khoản Chờ Duyệt (Waiting)</div>
          </div>
        </div>

        <div className="status-kpi-item glass">
          <div className="kpi-bullet bg-green"></div>
          <div>
            <div className="kpi-num font-mono" style={{ color: metrics.remainingBudget >= 0 ? '#22c55e' : '#ef4444' }}>
              {formatShortCurrency(metrics.remainingBudget)}
            </div>
            <div className="kpi-label">Tổng Ngân Sách Còn Lại</div>
          </div>
        </div>
      </div>

      {/* Jobs List Section */}
      <div className="jobs-section mt-8">
        <div className="section-header flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers size={22} color="#818cf8" />
              Danh Sách Media Jobs ({filteredJobs.length})
            </h2>
            <p className="text-sm text-muted">Chọn một buổi Shooting để quản lý các khoản chi tiết</p>
          </div>

          <div className="search-filter-box flex items-center gap-3">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm job, campaign, PIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-search"
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid Cards */}
        {filteredJobs.length === 0 ? (
          <div className="empty-state glass-panel text-center py-12">
            <Film size={48} className="empty-icon mx-auto mb-3" />
            <h3 className="text-lg font-bold">Chưa có Media Job nào phù hợp</h3>
            <p className="text-muted text-sm mt-1 mb-4">Hãy tạo mới buổi Media đầu tiên để bắt đầu theo dõi ngân sách.</p>
            <button className="btn btn-primary" onClick={onOpenCreate}>
              <PlusCircle size={16} /> Tạo Media Job Ngay
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map(job => {
              const actualCost = (job.expenses || [])
                .filter(e => e.paymentStatus !== 'Rejected')
                .reduce((sum, e) => sum + Number(e.total || 0), 0);
              
              const budget = Number(job.budget || 0);
              const remaining = budget - actualCost;
              const isOver = actualCost > budget;
              const pct = budget > 0 ? Math.min(100, Math.round((actualCost / budget) * 100)) : 0;

              return (
                <div 
                  key={job.id} 
                  className={`job-card glass-panel ${isOver ? 'job-card-over' : ''}`}
                  onClick={() => onSelectJob(job.id)}
                >
                  <div className="job-card-header flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="production-pill">{job.productionType}</span>
                        {isOver && <span className="badge-alert">🔴 OVER BUDGET</span>}
                      </div>
                      <h3 className="job-title font-bold text-lg">{job.projectName}</h3>
                      <p className="job-campaign text-sm text-gradient font-medium">{job.campaign}</p>
                    </div>
                    <WorkflowStatusBadge status={job.status || 'Shooting in Progress'} />
                  </div>

                  <div className="job-meta-grid mt-4">
                    <div className="meta-item">
                      <Calendar size={14} className="text-muted" />
                      <span>{job.date}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={14} className="text-muted" />
                      <span className="truncate">{job.location || 'N/A'}</span>
                    </div>
                    <div className="meta-item">
                      <User size={14} className="text-muted" />
                      <span>{job.pic || 'PIC'}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="budget-progress-box mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Đã chi: <strong className="text-main">{formatShortCurrency(actualCost)}</strong></span>
                      <span className="text-muted">Budget: <strong className="text-main">{formatShortCurrency(budget)}</strong></span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${isOver ? 'fill-red' : pct > 85 ? 'fill-yellow' : 'fill-primary'}`} 
                        style={{ width: `${Math.min(100, (actualCost / (budget || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="job-card-footer flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="expense-counter text-xs text-muted">
                      <span>{(job.expenses || []).length} khoản chi</span>
                    </div>
                    <div className="view-link flex items-center gap-1 font-semibold text-sm">
                      <span>Quản lý chi phí</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeDashboard;
