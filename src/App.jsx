import { useState, useEffect } from 'react';
import { loadJobs, saveJobs } from './utils/storage';
import { INITIAL_SAMPLE_JOBS } from './data/categories';
import Navbar from './components/Navbar';
import HomeDashboard from './components/HomeDashboard';
import ExpenseScreen from './components/ExpenseScreen';
import CreateJobModal from './components/CreateJobModal';
import AddExpenseModal from './components/AddExpenseModal';
import QuickAddModal from './components/QuickAddModal';
import JobReportModal from './components/JobReportModal';

function App() {
  const [jobs, setJobs] = useState(() => loadJobs());
  const [activeJobId, setActiveJobId] = useState(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [expenseModalConfig, setExpenseModalConfig] = useState({
    isOpen: false,
    defaultCategory: 'LOCATION',
    editingExpense: null
  });

  // Save whenever jobs change
  useEffect(() => {
    saveJobs(jobs);
  }, [jobs]);

  const activeJob = jobs.find(j => j.id === activeJobId) || null;

  // Job operations
  const handleCreateJob = (newJob) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    setActiveJobId(newJob.id); // Direct to new job
  };

  const handleUpdateJob = (updatedJob) => {
    const updated = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có muốn khôi phục dữ liệu mẫu ban đầu không? (Dữ liệu hiện tại sẽ bị ghi đè)')) {
      setJobs(INITIAL_SAMPLE_JOBS);
      saveJobs(INITIAL_SAMPLE_JOBS);
      setActiveJobId(null);
    }
  };

  // Expense operations for the active job
  const handleSaveExpense = (expense) => {
    if (!activeJob) return;

    const existingIndex = (activeJob.expenses || []).findIndex(e => e.id === expense.id);
    let newExpenses = [...(activeJob.expenses || [])];

    if (existingIndex >= 0) {
      newExpenses[existingIndex] = expense;
    } else {
      newExpenses.unshift(expense);
    }

    const updatedJob = { ...activeJob, expenses: newExpenses };
    handleUpdateJob(updatedJob);
  };

  const handleOpenAddExpense = (defaultCategory = 'LOCATION', editingExpense = null) => {
    setExpenseModalConfig({
      isOpen: true,
      defaultCategory,
      editingExpense
    });
  };

  const handleCloseAddExpense = () => {
    setExpenseModalConfig(prev => ({ ...prev, isOpen: false, editingExpense: null }));
  };

  return (
    <div className="app-root">
      <Navbar
        currentView={activeJobId ? 'EXPENSE' : 'HOME'}
        onGoHome={() => setActiveJobId(null)}
        onOpenCreate={() => setIsCreateOpen(true)}
        onResetData={handleResetData}
        activeJobTitle={activeJob ? activeJob.projectName : null}
      />

      <main className="container">
        {!activeJobId ? (
          <HomeDashboard
            jobs={jobs}
            onSelectJob={(id) => setActiveJobId(id)}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        ) : (
          <ExpenseScreen
            job={activeJob}
            onUpdateJob={handleUpdateJob}
            onBack={() => setActiveJobId(null)}
            onOpenAddExpense={handleOpenAddExpense}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <CreateJobModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateJob={handleCreateJob}
      />

      <AddExpenseModal
        isOpen={expenseModalConfig.isOpen}
        defaultCategory={expenseModalConfig.defaultCategory}
        editingExpense={expenseModalConfig.editingExpense}
        onClose={handleCloseAddExpense}
        onSaveExpense={handleSaveExpense}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSaveExpense={handleSaveExpense}
      />

      <JobReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        job={activeJob}
      />
    </div>
  );
}

export default App;
