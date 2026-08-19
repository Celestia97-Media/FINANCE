import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { PaidByType, PaymentStatus, DocumentType, ExpenseDocument } from '../../types';
import {
  X,
  Upload,
  FileText,
  Calculator,
  Plus,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { formatVNDRaw } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, selectedJobId, jobs, addExpense } = useApp();

  const [targetJobId, setTargetJobId] = useState(selectedJobId);
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [subCategory, setSubCategory] = useState(CATEGORIES[0].subCategories[0]);
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('Day');
  const [unitPrice, setUnitPrice] = useState<number>(8000000);
  const [paidBy, setPaidBy] = useState<PaidByType>('Company');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [note, setNote] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('Invoice');
  const [documents, setDocuments] = useState<ExpenseDocument[]>([]);

  useEffect(() => {
    if (isAddExpenseOpen) {
      setTargetJobId(selectedJobId || jobs[0]?.job_id || '');
    }
  }, [isAddExpenseOpen, selectedJobId, jobs]);

  // When category changes, update available subcategories and default unit
  const activeCategoryDef = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = CATEGORIES.find((c) => c.id === newCatId);
    if (cat) {
      setSubCategory(cat.subCategories[0] || 'Other');
      setUnit(cat.suggestedUnits[0] || 'Item');
    }
  };

  // Auto total calculation
  const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDoc: ExpenseDocument = {
          document_id: `doc-${Date.now()}`,
          expense_id: '',
          document_type: documentType,
          file_name: file.name,
          file_url: event.target?.result as string,
          file_size: file.size,
          uploaded_by: paidBy === 'Employee' ? 'Nhân viên Media' : 'Kế toán Media',
          uploaded_at: new Date().toISOString(),
        };
        setDocuments((prev) => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.document_id !== docId));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !vendor.trim()) {
      alert('Vui lòng nhập mô tả hoặc nhà cung cấp');
      return;
    }

    addExpense({
      job_id: targetJobId,
      category_id: categoryId,
      sub_category: subCategory,
      description: description.trim() || `${subCategory} - ${vendor}`,
      vendor: vendor.trim() || 'N/A',
      quantity: Number(quantity) || 1,
      unit: unit || 'Item',
      unit_price: Number(unitPrice) || 0,
      total,
      paid_by: paidBy,
      payment_status: paymentStatus,
      note,
      created_by: 'Producer / Media PIC',
      documents,
    });

    // Reset & close
    setDescription('');
    setVendor('');
    setNote('');
    setDocuments([]);
    setIsAddExpenseOpen(false);
  };

  if (!isAddExpenseOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Thêm Khoản Chi Mới (Add Expense)</h3>
              <p className="text-xs text-slate-400">Chi tiết hạng mục sản xuất & chứng từ thanh toán</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Media Job */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Dự Án Áp Dụng (Media Job)
            </label>
            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.project_name} — {job.campaign} ({job.production_type})
                </option>
              ))}
            </select>
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-3 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              1. Phân loại chi phí (Basic Information)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category (Nhóm chi phí) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.subCategories.length} mục con)
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sub-category (Hạng mục chi tiết) <span className="text-rose-400">*</span>
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {activeCategoryDef.subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description & Vendor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description (Mô tả chi tiết) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="VD: Studio ABC – 10 hours trọn gói"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Vendor (Nhà cung cấp / Đối tác)
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="VD: ABC Studio, Alex Lee, Highlands..."
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cost Calculation */}
          <div className="space-y-3 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              2. Tính toán chi phí (Cost Calculation)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {activeCategoryDef.suggestedUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                  <option value="Pax">Pax</option>
                  <option value="Item">Item</option>
                  <option value="Package">Package</option>
                </select>
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Unit Price (VND)</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Total Display */}
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 font-medium">Công thức tự động:</span>
                <p className="text-xs text-teal-300">
                  {quantity} {unit} × {formatVNDRaw(unitPrice)} ₫
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase font-bold tracking-wider text-teal-400">
                  TOTAL AMOUNT
                </span>
                <p className="text-2xl font-black text-teal-300">{formatVNDRaw(total)} VND</p>
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="space-y-3 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              3. Thanh toán (Payment)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Paid by */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Paid by</label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value as PaidByType)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Company">Company (Công ty chi)</option>
                  <option value="Employee">Employee (Nhân viên ứng trước)</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Pending">Pending (Chờ thanh toán)</option>
                  <option value="Paid">Paid (Đã thanh toán)</option>
                  <option value="Reimbursement">Reimbursement (Hoàn ứng nhân viên)</option>
                  <option value="Waiting Approval">Waiting Approval (Chờ duyệt)</option>
                  <option value="Approved">Approved (Đã duyệt)</option>
                  <option value="Rejected">Rejected (Từ chối)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Attachments & Note */}
          <div className="space-y-3 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              4. Chứng từ & Ghi chú (Attachment & Note)
            </h4>

            {/* Document upload box */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="Invoice">Invoice (Hóa đơn VAT)</option>
                  <option value="Receipt">Receipt (Biên nhận)</option>
                  <option value="Contract">Contract (Hợp đồng)</option>
                  <option value="Quotation">Quotation (Báo giá)</option>
                  <option value="Payment proof">Payment proof (Ủy nhiệm chi)</option>
                  <option value="Photo hóa đơn">Photo hóa đơn (Ảnh chụp)</option>
                </select>
                <span className="text-xs text-slate-400">Chọn loại chứng từ trước khi tải</span>
              </div>

              <label className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 bg-slate-800/40 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-teal-400" />
                <span className="text-xs text-slate-300 font-medium">+ Upload Receipt / Invoice / File</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Documents List */}
              {documents.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.document_id}
                      className="flex items-center justify-between p-2 bg-slate-800 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span className="text-slate-200 font-medium truncate">{doc.file_name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-teal-300">
                          {doc.document_type}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoc(doc.document_id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Note (Ghi chú)</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Shooting 8:00–18:00. Bao gồm thêm 2 ly nước MUA..."
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 text-sm font-bold rounded-xl shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              SAVE EXPENSE (LƯU KHOẢN CHI)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
