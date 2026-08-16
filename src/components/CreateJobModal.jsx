import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  Briefcase, 
  Layers,
  FileText
} from 'lucide-react';
import { 
  PRODUCTION_TYPES, 
  CAMPAIGNS, 
  DEPARTMENTS, 
  TEMPLATE_PRESETS 
} from '../data/categories';

const CreateJobModal = ({ isOpen, onClose, onCreateJob }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    campaign: CAMPAIGNS[0],
    date: new Date().toISOString().split('T')[0],
    productionType: 'Studio Shooting',
    location: '',
    pic: '',
    department: DEPARTMENTS[0],
    budget: '',
    client: '',
    note: '',
    autoLoadTemplate: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.budget) {
      alert('Vui lòng điền tên dự án và hạn mức ngân sách!');
      return;
    }

    let initialExpenses = [];
    if (formData.autoLoadTemplate) {
      const preset = TEMPLATE_PRESETS[formData.productionType] || TEMPLATE_PRESETS['Studio Shooting'] || [];
      initialExpenses = preset.map((item, idx) => ({
        ...item,
        id: `exp_init_${Date.now()}_${idx}`,
        total: Number(item.quantity || 1) * Number(item.unitPrice || 0),
        receiptName: '',
        note: item.note || 'Tự động tạo từ Preset'
      }));
    }

    const newJob = {
      id: `job_${Date.now()}`,
      ...formData,
      budget: Number(formData.budget),
      status: 'Draft',
      createdAt: new Date().toISOString(),
      expenses: initialExpenses
    };

    onCreateJob(newJob);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-container glass-panel animate-scale-up" style={{ maxWidth: '780px' }}>
        <div className="modal-header flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="modal-icon-box">
              <Sparkles size={20} color="#818cf8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Tạo Buổi Media Mới (New Job)</h2>
              <p className="text-sm text-muted">Thiết lập thông tin sản xuất & tự động tải mẫu dự toán phù hợp</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body mt-4 flex-col gap-4">
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Project Name <span className="text-red">*</span></label>
              <input
                type="text"
                name="projectName"
                required
                placeholder="VD: Summer Lookbook 2026, TVC Tet..."
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Campaign</label>
              <select name="campaign" value={formData.campaign} onChange={handleChange}>
                {CAMPAIGNS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Ngày thực hiện (Date) <span className="text-red">*</span></label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Production Type <span className="text-red">*</span></label>
              <select 
                name="productionType" 
                value={formData.productionType} 
                onChange={handleChange}
                style={{ borderColor: 'var(--primary)', fontWeight: 600 }}
              >
                {PRODUCTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Địa điểm (Location)</label>
              <input
                type="text"
                name="location"
                placeholder="VD: Studio ABC, Q4 / Bến Bạch Đằng..."
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Client / Brand</label>
              <input
                type="text"
                name="client"
                placeholder="VD: Brand X, Agency Y..."
                value={formData.client}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>PIC (Người phụ trách) <span className="text-red">*</span></label>
              <input
                type="text"
                name="pic"
                required
                placeholder="VD: Ho Thanh Thanh (Producer)"
                value={formData.pic}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Phòng ban (Department)</label>
              <select name="department" value={formData.department} onChange={handleChange}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Budget Được Duyệt (VND) <span className="text-red">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  name="budget"
                  required
                  min="0"
                  step="100000"
                  placeholder="VD: 25000000"
                  value={formData.budget}
                  onChange={handleChange}
                  className="font-mono font-bold"
                  style={{ color: '#22c55e', fontSize: '1.1rem' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú (Note)</label>
            <textarea
              name="note"
              rows="2"
              placeholder="Yêu cầu đặc thù, concept, quy định trang phục hoặc lưu ý quan trọng..."
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Auto template checkbox banner */}
          <div className="template-auto-card glass p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="checkbox-wrap">
                <input
                  type="checkbox"
                  id="autoLoadTemplate"
                  name="autoLoadTemplate"
                  checked={formData.autoLoadTemplate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="autoLoadTemplate" className="font-semibold cursor-pointer text-sm text-main">
                  Tự động nạp mẫu chi phí chuẩn cho loại <span className="text-gradient">"{formData.productionType}"</span>
                </label>
                <p className="text-xs text-muted">Hệ thống sẽ tự động khởi tạo các mục Studio, Lighting, Crew, Props dự kiến.</p>
              </div>
            </div>
          </div>

          <div className="modal-footer flex items-center justify-end gap-3 mt-4 pt-4 border-t">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary shadow-glow">
              <Check size={18} /> Tạo Media Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
