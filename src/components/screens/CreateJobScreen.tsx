import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionType } from '../../types';
import { PRODUCTION_TYPE_PRESETS, CATEGORIES } from '../../data/categories';
import {
  Film,
  Calendar,
  MapPin,
  User,
  Building,
  DollarSign,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Tag,
} from 'lucide-react';
import { formatVNDRaw, formatVND } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

const PRODUCTION_TYPES: ProductionType[] = [
  'Studio Shooting',
  'Outdoor Shooting',
  'Product Shooting',
  'Content Shooting',
  'Lookbook',
  'TVC',
  'On-set',
  'Event',
  'Livestream',
  'Other',
];

const CAMPAIGN_PRESETS = [
  'Summer Campaign 2026',
  'Fall In Love 2026',
  'Super Brand Day',
  'Tet Holiday Launching',
  'Back To School',
  'Mega Sale Livestream',
  'Brand Refresh 2026',
];

const DEPARTMENT_PRESETS = [
  'Media Production',
  'Video Creative',
  'Fashion Media',
  'Social Media',
  'Live Commerce',
  'Marketing Department',
  'Agency Producer Team',
];

export const CreateJobScreen: React.FC = () => {
  const { addJob, setActiveScreen } = useApp();

  const [projectName, setProjectName] = useState('');
  const [campaign, setCampaign] = useState(CAMPAIGN_PRESETS[0]);
  const [customCampaign, setCustomCampaign] = useState('');
  const [isCustomCampaign, setIsCustomCampaign] = useState(false);
  const [date, setDate] = useState('2026-08-25');
  const [productionType, setProductionType] = useState<ProductionType>('Studio Shooting');
  const [location, setLocation] = useState('ABC Studio, Q.7, TP.HCM');
  const [pic, setPic] = useState('Thanh Thanh');
  const [department, setDepartment] = useState('Media Production');
  const [budget, setBudget] = useState<number>(30000000);
  const [clientBrand, setClientBrand] = useState('');
  const [note, setNote] = useState('');

  // Selected preset metadata
  const currentPreset = PRODUCTION_TYPE_PRESETS[productionType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Vui lòng nhập tên Media Job');
      return;
    }

    const finalCampaign = isCustomCampaign ? customCampaign : campaign;

    // Calculate auto category budgets
    const category_budgets: Record<string, number> = {};
    if (currentPreset?.defaultBudgetRatio) {
      Object.entries(currentPreset.defaultBudgetRatio).forEach(([catId, ratio]) => {
        category_budgets[catId] = Math.round((budget * ratio) / 100);
      });
    }

    addJob({
      project_name: projectName.trim(),
      campaign: finalCampaign || 'Default Campaign',
      production_type: productionType,
      date,
      location: location.trim() || 'Studio / Hiện trường',
      pic: pic.trim() || 'Media Producer',
      department,
      client_brand: clientBrand.trim() || 'Internal Brand',
      budget: Number(budget) || 0,
      status: 'Planning',
      note: note.trim(),
      category_budgets,
    });

    // Navigate to Expense screen
    setActiveScreen('expense');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">03 — Khởi Tạo Media Job Mới</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              CREATE MEDIA JOB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Thiết lập buổi shooting, chỉ định ngân sách và tự động nạp cấu trúc hạng mục chi phí chuẩn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Film className="w-5 h-5 text-teal-400" />
              <span>Thông tin cơ bản (Basic Information)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Project Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Name (Tên Buổi Shooting / Dự Án) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="VD: SUMMER CAMPAIGN 2026 — KEY VISUAL SHOOTING"
                className="w-full px-4 py-3 bg-slate-850 border border-slate-700 rounded-xl text-slate-100 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Campaign */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Campaign (Chiến Dịch)</span>
                <button
                  type="button"
                  onClick={() => setIsCustomCampaign(!isCustomCampaign)}
                  className="text-teal-400 text-xs font-normal hover:underline"
                >
                  {isCustomCampaign ? 'Chọn từ danh sách' : '+ Nhập chiến dịch mới'}
                </button>
              </label>
              {isCustomCampaign ? (
                <input
                  type="text"
                  value={customCampaign}
                  onChange={(e) => setCustomCampaign(e.target.value)}
                  placeholder="Nhập tên Campaign mới..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CAMPAIGN_PRESETS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Client / Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Client / Brand (Khách hàng / Nhãn hàng)
              </label>
              <input
                type="text"
                value={clientBrand}
                onChange={(e) => setClientBrand(e.target.value)}
                placeholder="VD: AquaFresh, VinFast, Coolmate, Unilever..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Date (Ngày quay / chụp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Location (Địa điểm shooting) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: ABC Studio - Phòng A, Q.7..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Production Type (Dropdown - Crucial feature) */}
            <div className="sm:col-span-2 bg-slate-850 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Production Type (Loại hình sản xuất) <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ⚡ Tự động nạp bộ danh mục & phân bổ chi phí phù hợp
                </span>
              </label>
              <select
                value={productionType}
                onChange={(e) => setProductionType(e.target.value as ProductionType)}
                className="w-full px-4 py-3 bg-slate-900 border-2 border-teal-500/40 rounded-xl text-teal-300 font-bold text-base focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
              >
                {PRODUCTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {currentPreset && (
                <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  <span>{currentPreset.description}</span>
                </p>
              )}
            </div>

            {/* PIC */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                PIC (Người phụ trách chính) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="VD: Thanh Thanh, Hoàng Nam, Quốc Đạt..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Department (Phòng ban)
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {DEPARTMENT_PRESETS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="sm:col-span-2 bg-gradient-to-r from-teal-950/40 via-slate-850 to-slate-900 p-4 rounded-2xl border border-teal-500/30">
              <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider mb-1.5">
                Budget (Tổng Ngân Sách Phê Duyệt) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500000"
                  min="0"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-teal-500/40 rounded-xl text-teal-300 font-extrabold text-2xl tracking-wide focus:outline-none focus:border-teal-400 pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  VND
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Bằng chữ: <strong className="text-teal-300 font-bold">{formatVND(budget)}</strong>
              </p>
            </div>

            {/* Note */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Note (Ghi chú shooting)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="VD: Shooting 8:00–18:00. Yêu cầu chuẩn bị trước 5 look trang phục..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Smart Auto-loaded Category Preview Box */}
        {currentPreset && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-slate-200 text-sm">
                  Cấu Trúc Hạng Mục Chi Phí Đề Xuất Cho {productionType}
                </h3>
              </div>
              <span className="text-xs text-teal-400 font-medium">Tự động kích hoạt</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isRecommended = currentPreset.recommendedCategories.includes(cat.id);
                const ratio = currentPreset.defaultBudgetRatio[cat.id] || 0;
                const estimatedAmount = Math.round((budget * ratio) / 100);

                return (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      isRecommended
                        ? 'bg-slate-850 border-teal-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <CategoryIcon name={cat.icon} className="w-4 h-4 text-teal-400" />
                        {cat.name}
                      </span>
                      {ratio > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-semibold">
                          {ratio}%
                        </span>
                      )}
                    </div>
                    {ratio > 0 ? (
                      <p className="font-bold text-teal-300 text-xs mt-1">
                        ~{formatVND(estimatedAmount)}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">Tùy chọn bổ sung</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveScreen('jobs')}
            className="px-6 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-2xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-500/25 active:scale-95 transition-all"
          >
            <span>TẠO MEDIA JOB & VÀO EXPENSE SCREEN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
