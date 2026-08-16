import { Film, PlusCircle, LayoutDashboard, Sparkles, RefreshCw } from 'lucide-react';

const Navbar = ({ currentView, onGoHome, onOpenCreate, onResetData, activeJobTitle }) => {
  return (
    <header className="navbar-container glass">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={onGoHome} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-wrapper">
            <Film size={22} color="#818cf8" />
          </div>
          <div>
            <div className="brand-title flex items-center gap-2">
              <span className="text-gradient font-bold text-xl">MediaFin</span>
              <span className="badge-pro">PRO SYSTEM</span>
            </div>
            <p className="brand-subtitle">Media Production Expense & Budgeting</p>
          </div>
        </div>

        {activeJobTitle && (
          <div className="navbar-breadcrumbs">
            <span className="crumb-home" onClick={onGoHome}>Dashboard</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-active">{activeJobTitle}</span>
          </div>
        )}

        <div className="navbar-actions flex items-center gap-3">
          {currentView !== 'HOME' && (
            <button className="btn btn-secondary btn-sm" onClick={onGoHome}>
              <LayoutDashboard size={16} /> Home Dashboard
            </button>
          )}

          <button className="btn btn-primary btn-sm" onClick={onOpenCreate}>
            <PlusCircle size={16} /> Create Media Job
          </button>

          <button 
            className="btn btn-ghost btn-sm" 
            onClick={onResetData} 
            title="Reset Sample Data"
            style={{ color: 'var(--text-muted)', padding: '6px 10px' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
