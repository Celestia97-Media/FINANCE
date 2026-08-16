import { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Paperclip, 
  DollarSign, 
  Check, 
  FileText,
  Upload,
  AlertCircle
} from 'lucide-react';
import { 
  CATEGORY_DATABASE, 
  PAID_BY_OPTIONS, 
  PAYMENT_STATUSES 
} from '../data/categories';
import { formatCurrency } from '../utils/storage';

const UNITS = ['Day', 'Set', 'Trip', 'Person', 'Pax', 'Item', 'Package', 'Hour', 'Photo', 'Month', 'Project', 'Phase'];

const AddExpenseModal = ({ isOpen, onClose, onSaveExpense, editingExpense, defaultCategory }) => {
  const [formData, setFormData] = useState({
    category: defaultCategory || 'LOCATION',
    subCategory: '',
    description: '',
    vendor: '',
    quantity: 1,
    unit: 'Day',
    unitPrice: '',
    total: 0,
    paidBy: 'Company',
    paymentStatus: 'Pending',
    receiptName: '',
    note: ''
  });

  // Keep subCategories synced when category changes
  const activeCategoryObj = CATEGORY_DATABASE.find(c => c.id === formData.category) || CATEGORY_DATABASE[0];
  const subCategoryList = activeCategoryObj.subCategories || [];

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        ...editingExpense,
        unitPrice: editingExpense.unitPrice || 0
      });
    } else {
      setFormData({
        category: defaultCategory || 'LOCATION',
        subCategory: (CATEGORY_DATABASE.find(c => c.id === (defaultCategory || 'LOCATION'))?.subCategories[0]) || '',
        description: '',
        vendor: '',
        quantity: 1,
        unit: 'Day',
        unitPrice: '',
        total: 0,
        paidBy: 'Company',
        paymentStatus: 'Pending',
        receiptName: '',
        note: ''
      });
    }
  }, [editingExpense, isOpen, defaultCategory]);

  // If category changed by user and subCategory is not in current list, select first subCategory
  const handleCategoryChange = (newCat) => {
    const catObj = CATEGORY_DATABASE.find(c => c.id === newCat);
    const firstSub = catObj?.subCategories[0] || '';
    setFormData(prev => ({
      ...prev,
      category: newCat,
      subCategory: firstSub
    }));
  };

  // Auto calculate total
  useEffect(() => {
    const qty = Number(formData.quantity) || 0;
    const price = Number(formData.unitPrice) || 0;
    setFormData(prev => ({
      ...prev,
      total: qty * price
    }));
  }, [formData.quantity, formData.unitPrice]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      handleCategoryChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUploadMock = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receiptName: file.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description) {
      alert('Vui lòng nhập mô tả khoản chi!');
      return;
    }

    const expensePayload = {
      ...formData,
      id: editingExpense ? editingExpense.id : `exp_${Date.now()}`,
      quantity: Number(formData.quantity) || 1,
      unitPrice: Number(formData.unitPrice) || 0,
      total: (Number(formData.quantity) || 1) * (Number(formData.unitPrice) || 0)
    };

    onSaveExpense(expensePayload);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-container glass-panel animate-scale-up" style={{ maxWidth: '720px' }}>
        <div className="modal-header flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="modal-icon-box">
              <Plus size={20} color="#818cf8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {editingExpense ? 'Chỉnh Sửa Khoản Chi' : 'Thêm Khoản Chi Mới (Add Expense)'}
              </h2>
              <p className="text-sm text-muted">Nhập đầy đủ thông tin chứng từ & nhà cung cấp</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body mt-4 flex-col gap-4">
          {/* Section 1: Basic Information */}
          <div className="form-section-title text-sm font-bold text-gradient uppercase tracking-wider">
            1. Basic Information
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category (Nhóm chi phí) <span className="text-red">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="font-semibold">
                {CATEGORY_DATABASE.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Sub-category (Hạng mục chi tiết) <span className="text-red">*</span></label>
              <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                {subCategoryList.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label>Description (Mô tả chi tiết) <span className="text-red">*</span></label>
              <input
                type="text"
                name="description"
                required
                placeholder="VD: Studio ABC – 10 hours, Aputure 600d..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Vendor (Nhà cung cấp)</label>
              <input
                type="text"
                name="vendor"
                placeholder="VD: ABC Studio, Red Rental..."
                value={formData.vendor}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2: Cost Calculation */}
          <div className="form-section-title text-sm font-bold text-gradient uppercase tracking-wider mt-2">
            2. Cost Calculation
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Quantity (Số lượng)</label>
              <input
                type="number"
                name="quantity"
                min="1"
                step="any"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Unit (Đơn vị tính)</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="form-group flex-2">
              <label>Unit Price (Đơn giá - VND) <span className="text-red">*</span></label>
              <input
                type="number"
                name="unitPrice"
                min="0"
                step="1000"
                required
                placeholder="VD: 8000000"
                value={formData.unitPrice}
                onChange={handleChange}
                className="font-mono font-bold"
              />
            </div>
          </div>

          {/* Auto Total Display Box */}
          <div className="total-display-card glass p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-muted">
              TỔNG THÀNH TIỀN (Quantity × Unit Price):
            </span>
            <span className="text-xl font-bold font-mono text-purple">
              {formatCurrency(formData.total)}
            </span>
          </div>

          {/* Section 3: Payment Details */}
          <div className="form-section-title text-sm font-bold text-gradient uppercase tracking-wider mt-2">
            3. Payment Details & Status
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Paid By (Người / Nguồn thanh toán)</label>
              <select name="paidBy" value={formData.paidBy} onChange={handleChange}>
                {PAID_BY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Payment Status (Trạng thái) <span className="text-red">*</span></label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
                {PAYMENT_STATUSES.map(st => (
                  <option key={st.id} value={st.id}>{st.dot} {st.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 4: Attachment & Note */}
          <div className="form-section-title text-sm font-bold text-gradient uppercase tracking-wider mt-2">
            4. Attachment & Note
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Upload Receipt / Chứng từ / Hóa đơn</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="receipt-file"
                  onChange={handleFileUploadMock}
                  style={{ display: 'none' }}
                />
                <label htmlFor="receipt-file" className="btn btn-secondary w-full cursor-pointer flex items-center justify-center gap-2">
                  <Upload size={16} />
                  {formData.receiptName ? formData.receiptName : '+ Chọn file hóa đơn/chứng từ'}
                </label>
              </div>
              {formData.receiptName && (
                <div className="text-xs text-green mt-1 flex items-center gap-1">
                  <Check size={12} /> Đã đính kèm: {formData.receiptName}
                </div>
              )}
            </div>

            <div className="form-group flex-1">
              <label>Note (Ghi chú)</label>
              <input
                type="text"
                name="note"
                placeholder="VD: Shooting 8:00 - 18:00, đã cọc 50%..."
                value={formData.note}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer flex items-center justify-end gap-3 mt-4 pt-4 border-t">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary shadow-glow">
              <Save size={18} /> {editingExpense ? 'Cập Nhật Khoản Chi' : 'SAVE EXPENSE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
