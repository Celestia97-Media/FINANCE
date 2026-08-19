import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { MediaJob, Expense, Approval } from '../types';

export const COLLECTIONS = {
  JOBS: 'media_jobs',
  EXPENSES: 'expenses',
  APPROVALS: 'approvals',
};

// Listen to Media Jobs collection
export function subscribeToJobs(
  onUpdate: (jobs: MediaJob[]) => void,
  onError: (error: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.JOBS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const jobs: MediaJob[] = [];
        snapshot.forEach((doc) => {
          jobs.push(doc.data() as MediaJob);
        });
        // Sort newest first
        jobs.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        onUpdate(jobs);
      },
      onError
    );
  } catch (err) {
    onError(err);
    return () => {};
  }
}

// Listen to Expenses collection
export function subscribeToExpenses(
  onUpdate: (expenses: Expense[]) => void,
  onError: (error: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.EXPENSES);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const expenses: Expense[] = [];
        snapshot.forEach((doc) => {
          expenses.push(doc.data() as Expense);
        });
        expenses.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        onUpdate(expenses);
      },
      onError
    );
  } catch (err) {
    onError(err);
    return () => {};
  }
}

// Listen to Approvals collection
export function subscribeToApprovals(
  onUpdate: (approvals: Approval[]) => void,
  onError: (error: any) => void
) {
  try {
    const colRef = collection(db, COLLECTIONS.APPROVALS);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const approvals: Approval[] = [];
        snapshot.forEach((doc) => {
          approvals.push(doc.data() as Approval);
        });
        approvals.sort(
          (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        );
        onUpdate(approvals);
      },
      onError
    );
  } catch (err) {
    onError(err);
    return () => {};
  }
}

// Save or Update Job
export async function saveJobToFirestore(job: MediaJob) {
  try {
    await setDoc(doc(db, COLLECTIONS.JOBS, job.job_id), job, { merge: true });
  } catch (e) {
    console.warn('Firebase save job error (offline fallback active):', e);
  }
}

// Delete Job
export async function deleteJobFromFirestore(job_id: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.JOBS, job_id));
  } catch (e) {
    console.warn('Firebase delete job error:', e);
  }
}

// Save or Update Expense
export async function saveExpenseToFirestore(expense: Expense) {
  try {
    await setDoc(doc(db, COLLECTIONS.EXPENSES, expense.expense_id), expense, { merge: true });
  } catch (e) {
    console.warn('Firebase save expense error:', e);
  }
}

// Delete Expense
export async function deleteExpenseFromFirestore(expense_id: string) {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EXPENSES, expense_id));
  } catch (e) {
    console.warn('Firebase delete expense error:', e);
  }
}

// Save or Update Approval
export async function saveApprovalToFirestore(approval: Approval) {
  try {
    await setDoc(doc(db, COLLECTIONS.APPROVALS, approval.approval_id), approval, { merge: true });
  } catch (e) {
    console.warn('Firebase save approval error:', e);
  }
}

// Upload receipt image to Firebase Storage
export async function uploadReceiptToStorage(
  base64Data: string,
  fileName: string
): Promise<string> {
  try {
    const storageRef = ref(storage, `receipts/${Date.now()}_${fileName}`);
    await uploadString(storageRef, base64Data, 'data_url');
    return await getDownloadURL(storageRef);
  } catch (e) {
    console.warn('Firebase storage upload error, using local base64:', e);
    return base64Data;
  }
}
