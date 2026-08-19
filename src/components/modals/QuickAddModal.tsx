import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QUICK_ADD_PRESETS, QuickAddPreset } from '../../data/categories';
import { PaidByType, PaymentStatus, ExpenseDocument } from '../../types';
import {
  Zap,
  X,
  Camera,
  Upload,
  Check,
  Building2,
  User,
  Sparkles,
} from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND } from '../../utils/formatters';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddDefaultPresetId,
    setQuickAddDefaultPresetId,
    jobs,
    selectedJobId,
    addExpense,
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<QuickAddPreset>(
    QUICK_ADD_PRESETS[0]
  );
  const [targetJobId, setTargetJobId] = useState<string>(selectedJobId);
  const [amount, setAmount] = useState<number>(350000);
  const [description, setDescription] = useState<string>('');
  const [vendor, setVendor] = useState<string>('GrabCar');
  const [paidBy, setPaidBy] = useState<PaidByType>('Employee');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string>('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  useEffect(() => {
    if (isQuickAddOpen) {
      setTargetJobId(selectedJobId || (jobs[0]?.job_id ?? ''));
      if (quickAddDefaultPresetId) {
        const found = QUICK_ADD_PRESETS.find((p) => p.id === quickAddDefaultPresetId);
        if (found) {
          handleSelectPreset(found);
        }
      } else {
        handleSelectPreset(QUICK_ADD_PRESETS[0]);
      }
    }
  }, [isQuickAddOpen, quickAddDefaultPresetId, selectedJobId, jobs]);

  const handleSelectPreset = (preset: QuickAddPreset) => {
    setSelectedPreset(preset);
    setAmount(preset.suggestedAmounts[0] || 150000);
    setVendor(preset.suggestedVendors[0] || '');
    setDescription(`${preset.label}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    const documents: ExpenseDocument[] = [];
    if (receiptImage) {
      documents.push({
        document_id: `doc-${Date.now()}`,
        expense_id: '',
        document_type: 'Photo hóa đơn',
        file_name: receiptName || 'Receipt_QuickAdd.jpg',
        file_url: receiptImage,
        uploaded_by: paidBy === 'Employee' ? 'Nhân viên (Hoàn ứng)' : 'Team Media',
        uploaded_at: new Date().toISOString(),
      });
    }

    const paymentStatus: PaymentStatus =
      paidBy === 'Employee' ? 'Reimbursement' : 'Paid';

    addExpense({
      job_id: targetJobId,
      category_id: selectedPreset.category_id,
      sub_category: selectedPreset.sub_category,
      description: description || `${selectedPreset.label} - ${vendor}`,
      vendor: vendor || 'Tại chỗ',
      quantity: 1,
      unit: selectedPreset.defaultUnit,
      unit_price: amount,
      total: amount,
      paid_by: paidBy,
      payment_status: paymentStatus,
      note: 'Thêm nhanh On-set via Quick Add',
      created_by: paidBy === 'Employee' ? 'Nhân viên Media' : 'Công ty',
      documents,
    });

    setIsSuccessAnim(true);
    setTimeout(() => {
      setIsSuccessAnim(false);
      setIsQuickAddOpen(false);
      setReceiptImage(null);
      setReceiptName('');
      setQuickAddDefaultPresetId(null);
    }, 600);
  };

  if (!isQuickAddOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient badge */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Quick Add Expense</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  ⚡ 5-Second Entry
                </span>
              </div>
              <p className="text-xs text-slate-400">Nhập nhanh chi phí phát sinh khi đi shooting</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsQuickAddOpen(false);
              setQuickAddDefaultPresetId(null);
            }}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleQuickSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Target Job Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dự Án / Media Job
            </label>
            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.project_name} ({job.production_type})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Preset Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Chọn nhanh loại chi phí
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_ADD_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md shadow-teal-500/10 scale-[1.02]'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="p-2 rounded-lg mb-1"
                      style={{ backgroundColor: `${preset.color}25`, color: preset.color }}
                    >
                      <CategoryIcon name={preset.icon} className="w-4 h-4" />
                    </div>
                    <span className="truncate w-full text-center text-[11px]">
                      {preset.label.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount input & Quick Amount Pills */}
          <div className="bg-slate-850/80 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Số tiền chi (VND)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1000"
                min="0"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="VD: 350000"
                className="w-full px-4 py-3 bg-slate-900 border-2 border-teal-500/50 rounded-xl text-teal-400 font-bold text-2xl tracking-wide focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30 text-right pr-14"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                VND
              </span>
            </div>

            {/* Quick Amount Suggestion Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {selectedPreset.suggestedAmounts.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setAmount(sug)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    amount === sug
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatVND(sug)}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Vendor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Mô tả chi phí
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Grab chở đồ gấp qua studio"
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nhà cung cấp / Nơi mua
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="VD: GrabCar, Highlands..."
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Paid By Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Người thanh toán
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaidBy('Employee')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  paidBy === 'Employee'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Nhân viên trả (Hoàn ứng)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaidBy('Company')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  paidBy === 'Company'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Công ty chi trực tiếp</span>
              </button>
            </div>
          </div>

          {/* Fast Receipt / Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Đính kèm Bill / Chụp Hóa Đơn</span>
              {receiptName && (
                <span className="text-teal-400 font-normal text-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã chọn ảnh
                </span>
              )}
            </label>

            {receiptImage ? (
              <div className="relative group border border-teal-500/40 rounded-xl overflow-hidden bg-slate-850 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={receiptImage}
                    alt="Receipt preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                  />
                  <div className="text-xs">
                    <p className="font-medium text-slate-200 truncate max-w-[200px]">
                      {receiptName}
                    </p>
                    <p className="text-slate-400 text-[11px]">Hóa đơn / Chứng từ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptImage(null);
                    setReceiptName('');
                  }}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-700 hover:border-teal-500/50 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-all">
                <div className="p-2 bg-slate-700/80 text-teal-400 rounded-lg">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-200">
                    Chụp hoặc Tải ảnh hóa đơn / bill
                  </p>
                  <p className="text-[11px] text-slate-400">PNG, JPG, PDF (Mở camera trên đt)</p>
                </div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSuccessAnim}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
                isSuccessAnim
                  ? 'bg-emerald-600 text-white scale-[0.98]'
                  : 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 shadow-teal-500/25 active:scale-[0.98]'
              }`}
            >
              {isSuccessAnim ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>ĐÃ LƯU THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>LƯU CHI PHÍ NGAY (SAVE)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
