export type ProductionType =
  | 'Studio Shooting'
  | 'Outdoor Shooting'
  | 'Product Shooting'
  | 'Content Shooting'
  | 'Lookbook'
  | 'TVC'
  | 'On-set'
  | 'Event'
  | 'Livestream'
  | 'Other';

export type JobStatus = 'Planning' | 'In Progress' | 'Completed' | 'Over Budget' | 'Cancelled';

export type PaidByType = 'Company' | 'Employee' | 'Freelancer' | 'Vendor';

export type PaymentStatus =
  | 'Pending'
  | 'Paid'
  | 'Reimbursement'
  | 'Waiting Approval'
  | 'Approved'
  | 'Rejected';

export type DocumentType =
  | 'Invoice'
  | 'Receipt'
  | 'Contract'
  | 'Quotation'
  | 'Payment proof'
  | 'Photo hóa đơn';

export interface ExpenseDocument {
  document_id: string;
  expense_id: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string; // Base64 data or URL
  file_size?: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Expense {
  expense_id: string;
  job_id: string;
  category_id: string;
  sub_category: string;
  description: string;
  vendor: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  paid_by: PaidByType;
  payment_status: PaymentStatus;
  note?: string;
  created_by: string;
  created_at: string;
  documents?: ExpenseDocument[];
}

export interface MediaJob {
  job_id: string;
  project_name: string;
  campaign: string;
  production_type: ProductionType;
  date: string;
  location: string;
  pic: string;
  department: string;
  client_brand: string;
  budget: number;
  status: JobStatus;
  note?: string;
  created_at: string;
  // Category budget allocations (optional overrides)
  category_budgets?: Record<string, number>;
}

export interface Approval {
  approval_id: string;
  job_id: string;
  expense_id: string;
  expense_desc: string;
  amount: number;
  requested_by: string;
  approver?: string;
  approval_type: 'Reimbursement' | 'Payment' | 'Budget Overrun';
  status: 'Waiting Approval' | 'Approved' | 'Rejected';
  comment?: string;
  submitted_at: string;
  approved_at?: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  subCategories: string[];
  suggestedUnits: string[];
  applicableTypes?: ProductionType[];
}

export type ActiveScreen = 'dashboard' | 'jobs' | 'create-job' | 'expense' | 'approval' | 'report';
