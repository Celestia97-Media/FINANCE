import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { MediaJobsScreen } from './components/screens/MediaJobsScreen';
import { CreateJobScreen } from './components/screens/CreateJobScreen';
import { ExpenseScreen } from './components/screens/ExpenseScreen';
import { ApprovalScreen } from './components/screens/ApprovalScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { ReceiptViewerModal } from './components/modals/ReceiptViewerModal';

export const App: React.FC = () => {
  const { activeScreen } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950 font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeScreen === 'dashboard' && <DashboardScreen />}
        {activeScreen === 'jobs' && <MediaJobsScreen />}
        {activeScreen === 'create-job' && <CreateJobScreen />}
        {activeScreen === 'expense' && <ExpenseScreen />}
        {activeScreen === 'approval' && <ApprovalScreen />}
        {activeScreen === 'report' && <ReportScreen />}
      </main>

      {/* Global Modals */}
      <QuickAddModal />
      <AddExpenseModal />
      <ReceiptViewerModal />

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 FINANCE MEDIA — Production Cost Management System</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>⚡ Phím tắt On-set: Quick Add</span>
            <span>•</span>
            <span>8 Nhóm Category chuẩn</span>
            <span>•</span>
            <span>Tự động tính & duyệt chi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
