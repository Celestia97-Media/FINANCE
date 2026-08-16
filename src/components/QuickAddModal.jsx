import { useState } from 'react';
import { 
  X, 
  Zap, 
  Upload, 
  Check, 
  Car, 
  Coffee, 
  Utensils, 
  Camera, 
  Clock, 
  Package, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/storage';

const QUICK_PRESETS = [
  { id: 'grab', label: 'Grab / Taxi', icon: Car, category: 'TRANSPORT', subCategory: 'Grab', defaultDesc: 'Grab di chuyển shooting' },
  { id: 'parking', label: 'Parking (Gửi xe)', icon: Car, category: 'TRANSPORT', subCategory: 'Parking', defaultDesc: 'Phí gửi xe shooting' },
  { id: 'coffee', label: 'Coffee & Drinks', icon: Coffee, category: 'FB', subCategory: 'Coffee', defaultDesc: 'Cà phê & nước uống onsite' },
  { id: 'food', label: 'Food / Cơm đoàn', icon: Utensils, category: 'FB', subCategory: 'Lunch', defaultDesc: 'Cơm trưa / Ăn nhẹ đoàn' },
  { id: 'props', label: 'Props (Đạo cụ gấp)', icon: Package, category: 'SET_ART', subCategory: 'Props', defaultDesc: 'Mua đạo cụ & vật dụng gấp' },
  { id: 'equipment', label: 'Equipment Thuê ngoài', icon: Camera, category: 'EQUIPMENT', subCategory: 'Other', defaultDesc: 'Thiết bị phụ kiện phát sinh' },
  { id: 'overtime', label: 'Overtime Onset', icon: Clock, category: 'OTHER', subCategory: 'Overtime', defaultDesc: 'Phí Overtime quay muộn' },
  { id: 'other', label: 'Other (Khác)', icon: HelpCircle, category: 'OTHER', subCategory: 'Miscellaneous', defaultDesc: 'Chi phí khẩn cấp khác' }
];

const QuickAddModal = ({ isOpen, onClose, onSaveExpense }) => {
  const [selectedPreset, setSelectedPreset] = useState(QUICK_PRESETS[0]);
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('Employee');
  const [description, setDescription] = useState(QUICK_PRESETS[0].defaultDesc);
  const [receiptName, setReceiptName] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setDescription(preset.defaultDesc);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ!');
      return;
    }

    const newExpense = {
      id: `exp_quick_${Date.now()}`,
      category: selectedPreset.category,
      subCategory: selectedPreset.subCategory,
      description: description || selectedPreset.defaultDesc,
      vendor: selectedPreset.label,
      quantity: 1,
      unit: 'Trip/Item',
      unitPrice: Number(amount),
      total: Number(amount),
      paidBy: paidBy,
      paymentStatus: paidBy === 'Employee' ? 'Reimbursement' : 'Paid',
      receiptName: receiptName,
      note: 'Quick Add On-set'
    };

    onSaveExpense(newExpense);
    onClose();
    setAmount('');
    setReceiptName('');
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-container glass-panel animate-scale-up" style={{ maxWidth: '580px' }}>
        <div className="modal-header flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="modal-icon-box" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
              <Zap size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Quick Add Expense
                <span className="badge-highlight">3 SECONDS</span>
              </h2>
              <p className="text-sm text-muted">Nhập nhanh các khoản phát sinh khi đang đi shooting</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body mt-4 flex-col gap-4">
          {/* Quick Preset Buttons Grid */}
          <div className="form-group">
            <label className="text-xs font-semibold uppercase text-muted">1. Chọn nhanh hạng mục</label>
            <div className="quick-presets-grid mt-2">
              {QUICK_PRESETS.map(preset => {
                const IconComponent = preset.icon;
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`quick-preset-btn ${isSelected ? 'preset-active' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <IconComponent size={18} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label className="text-xs font-semibold uppercase text-muted">2. Số tiền thanh toán (VND) <span className="text-red">*</span></label>
            <input
              type="number"
              required
              autoFocus
              min="1000"
              step="1000"
              placeholder="VD: 350000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="quick-amount-input font-mono font-bold"
              style={{ fontSize: '1.4rem', color: '#818cf8', textAlign: 'center' }}
            />
            {amount > 0 && (
              <div className="text-center font-bold text-sm text-gradient mt-1">
                = {formatCurrency(amount)}
              </div>
            )}
          </div>

          {/* Payer and Description */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Mô tả ngắn</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Grab chở đồ 2 chiều..."
              />
            </div>
            <div className="form-group flex-1">
              <label>Người trả tiền</label>
              <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                <option value="Employee">Employee (Cần Hoàn Tiền)</option>
                <option value="Company">Company (Thẻ/TK Công ty)</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>
          </div>

          {/* Receipt Attachment */}
          <div className="form-group">
            <label>Upload hóa đơn / ảnh bill (Chụp ngay)</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="quick-receipt-file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="quick-receipt-file" className="btn btn-secondary flex-1 cursor-pointer flex items-center justify-center gap-2">
                <Upload size={16} />
                {receiptName ? receiptName : '+ Chụp / Chọn ảnh hóa đơn'}
              </label>
            </div>
            {receiptName && (
              <span className="text-xs text-green flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> Đã chọn: {receiptName}
              </span>
            )}
          </div>

          <div className="modal-footer flex items-center justify-end gap-3 mt-4 pt-4 border-t">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary shadow-glow">
              <Zap size={18} /> Lưu Khoản Chi Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
