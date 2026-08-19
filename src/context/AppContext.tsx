import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaJob, Expense, Approval, ActiveScreen, ExpenseDocument } from '../types';
import { INITIAL_JOBS, INITIAL_EXPENSES, INITIAL_APPROVALS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  jobs: MediaJob[];
  expenses: Expense[];
  approvals: Approval[];
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  selectedJob: MediaJob | undefined;

  // Modals
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  quickAddDefaultPresetId: string | null;
  setQuickAddDefaultPresetId: (id: string | null) => void;
  viewingDocument: ExpenseDocument | null;
  setViewingDocument: (doc: ExpenseDocument | null) => void;

  // Metrics
  stats: {
    totalJobsThisMonth: number;
    totalBudget: number;
    totalActualCost: number;
    totalIncurredCost: number;
    overBudgetJobCount: number;
    pendingPaymentCount: number;
    waitingApprovalCount: number;
  };

  // Job Actions
  addJob: (jobData: Omit<MediaJob, 'job_id' | 'created_at'>) => MediaJob;
  updateJob: (job_id: string, updates: Partial<MediaJob>) => void;
  deleteJob: (job_id: string) => void;

  // Expense Actions
  addExpense: (expenseData: Omit<Expense, 'expense_id' | 'created_at'>) => Expense;
  updateExpense: (expense_id: string, updates: Partial<Expense>) => void;
  deleteExpense: (expense_id: string) => void;

  // Approval Actions
  approveItem: (approval_id: string, approverName?: string, comment?: string) => void;
  rejectItem: (approval_id: string, approverName?: string, comment?: string) => void;
  batchApprove: (approval_ids: string[]) => void;

  // Helper Computations
  getJobExpenses: (job_id: string) => Expense[];
  getJobActualCost: (job_id: string) => number;
  getJobCategoryCost: (job_id: string, category_id: string) => number;
  getJobCategoryBreakdown: (job_id: string) => Record<string, number>;

  // Data Reset & Persistence
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'finance_media_jobs_v1',
  EXPENSES: 'finance_media_expenses_v1',
  APPROVALS: 'finance_media_approvals_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<MediaJob[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse jobs from localStorage', e);
      }
    }
    return INITIAL_JOBS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse expenses from localStorage', e);
      }
    }
    return INITIAL_EXPENSES;
  });

  const [approvals, setApprovals] = useState<Approval[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse approvals from localStorage', e);
      }
    }
    return INITIAL_APPROVALS;
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-summer-2026');

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [quickAddDefaultPresetId, setQuickAddDefaultPresetId] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<ExpenseDocument | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  const selectedJob = jobs.find((j) => j.job_id === selectedJobId) || jobs[0];

  // Helper Computations
  const getJobExpenses = (job_id: string) => {
    return expenses.filter((e) => e.job_id === job_id);
  };

  const getJobActualCost = (job_id: string) => {
    return expenses
      .filter((e) => e.job_id === job_id && e.payment_status !== 'Rejected')
      .reduce((sum, e) => sum + (Number(e.total) || 0), 0);
  };

  const getJobCategoryCost = (job_id: string, category_id: string) => {
    return expenses
      .filter(
        (e) =>
          e.job_id === job_id &&
          e.category_id === category_id &&
          e.payment_status !== 'Rejected'
      )
      .reduce((sum, e) => sum + (Number(e.total) || 0), 0);
  };

  const getJobCategoryBreakdown = (job_id: string) => {
    const breakdown: Record<string, number> = {};
    expenses
      .filter((e) => e.job_id === job_id && e.payment_status !== 'Rejected')
      .forEach((e) => {
        breakdown[e.category_id] = (breakdown[e.category_id] || 0) + (Number(e.total) || 0);
      });
    return breakdown;
  };

  // Compute Overall Stats
  const computeStats = () => {
    const totalJobsThisMonth = jobs.length;
    const totalBudget = jobs.reduce((sum, j) => sum + (Number(j.budget) || 0), 0);
    const totalActualCost = expenses
      .filter((e) => e.payment_status !== 'Rejected')
      .reduce((sum, e) => sum + (Number(e.total) || 0), 0);

    let totalIncurredCost = 0;
    let overBudgetJobCount = 0;

    jobs.forEach((job) => {
      const actual = getJobActualCost(job.job_id);
      if (actual > job.budget) {
        overBudgetJobCount++;
        totalIncurredCost += actual - job.budget;
      }
    });

    const pendingPaymentCount = expenses.filter(
      (e) =>
        e.payment_status === 'Pending' ||
        e.payment_status === 'Reimbursement' ||
        e.payment_status === 'Waiting Approval'
    ).length;

    const waitingApprovalCount = approvals.filter(
      (a) => a.status === 'Waiting Approval'
    ).length;

    return {
      totalJobsThisMonth,
      totalBudget,
      totalActualCost,
      totalIncurredCost,
      overBudgetJobCount,
      pendingPaymentCount,
      waitingApprovalCount,
    };
  };

  const stats = computeStats();

  // Actions
  const addJob = (jobData: Omit<MediaJob, 'job_id' | 'created_at'>) => {
    const newJob: MediaJob = {
      ...jobData,
      job_id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.job_id);
    return newJob;
  };

  const updateJob = (job_id: string, updates: Partial<MediaJob>) => {
    setJobs((prev) =>
      prev.map((job) => (job.job_id === job_id ? { ...job, ...updates } : job))
    );
  };

  const deleteJob = (job_id: string) => {
    setJobs((prev) => prev.filter((job) => job.job_id !== job_id));
    setExpenses((prev) => prev.filter((exp) => exp.job_id !== job_id));
    setApprovals((prev) => prev.filter((appr) => appr.job_id !== job_id));
    if (selectedJobId === job_id && jobs.length > 1) {
      const remaining = jobs.filter((j) => j.job_id !== job_id);
      setSelectedJobId(remaining[0]?.job_id || '');
    }
  };

  const addExpense = (expenseData: Omit<Expense, 'expense_id' | 'created_at'>) => {
    const expense_id = `exp-${Date.now()}`;
    const newExpense: Expense = {
      ...expenseData,
      expense_id,
      created_at: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // If expense requires approval (e.g. Reimbursement or Waiting Approval)
    if (
      newExpense.payment_status === 'Waiting Approval' ||
      newExpense.payment_status === 'Reimbursement'
    ) {
      const newApproval: Approval = {
        approval_id: `appr-${Date.now()}`,
        job_id: newExpense.job_id,
        expense_id: newExpense.expense_id,
        expense_desc: `${newExpense.sub_category} - ${newExpense.description || newExpense.vendor}`,
        amount: newExpense.total,
        requested_by: newExpense.created_by || 'Nhân viên Media',
        approval_type:
          newExpense.payment_status === 'Reimbursement' ? 'Reimbursement' : 'Payment',
        status: 'Waiting Approval',
        comment: newExpense.note,
        submitted_at: new Date().toISOString(),
      };
      setApprovals((prev) => [newApproval, ...prev]);
    }

    return newExpense;
  };

  const updateExpense = (expense_id: string, updates: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.expense_id === expense_id ? { ...exp, ...updates } : exp))
    );
  };

  const deleteExpense = (expense_id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.expense_id !== expense_id));
    setApprovals((prev) => prev.filter((appr) => appr.expense_id !== expense_id));
  };

  const approveItem = (
    approval_id: string,
    approverName = 'Finance Director',
    comment = 'Đã kiểm tra chứng từ hợp lệ'
  ) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.approval_id === approval_id) {
          // Also update corresponding expense status to Approved / Paid
          setExpenses((prevExp) =>
            prevExp.map((exp) =>
              exp.expense_id === appr.expense_id
                ? { ...exp, payment_status: 'Approved' }
                : exp
            )
          );
          return {
            ...appr,
            status: 'Approved',
            approver: approverName,
            comment,
            approved_at: new Date().toISOString(),
          };
        }
        return appr;
      })
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if canvas isn't supported
    }
  };

  const rejectItem = (
    approval_id: string,
    approverName = 'Finance Director',
    comment = 'Chứng từ không hợp lệ / Chưa có hóa đơn'
  ) => {
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.approval_id === approval_id) {
          // Also update corresponding expense status to Rejected
          setExpenses((prevExp) =>
            prevExp.map((exp) =>
              exp.expense_id === appr.expense_id
                ? { ...exp, payment_status: 'Rejected' }
                : exp
            )
          );
          return {
            ...appr,
            status: 'Rejected',
            approver: approverName,
            comment,
            approved_at: new Date().toISOString(),
          };
        }
        return appr;
      })
    );
  };

  const batchApprove = (approval_ids: string[]) => {
    approval_ids.forEach((id) => approveItem(id));
  };

  const resetToDefault = () => {
    setJobs(INITIAL_JOBS);
    setExpenses(INITIAL_EXPENSES);
    setApprovals(INITIAL_APPROVALS);
    setSelectedJobId('job-summer-2026');
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        expenses,
        approvals,
        activeScreen,
        setActiveScreen,
        selectedJobId,
        setSelectedJobId,
        selectedJob,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        quickAddDefaultPresetId,
        setQuickAddDefaultPresetId,
        viewingDocument,
        setViewingDocument,
        stats,
        addJob,
        updateJob,
        deleteJob,
        addExpense,
        updateExpense,
        deleteExpense,
        approveItem,
        rejectItem,
        batchApprove,
        getJobExpenses,
        getJobActualCost,
        getJobCategoryCost,
        getJobCategoryBreakdown,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
