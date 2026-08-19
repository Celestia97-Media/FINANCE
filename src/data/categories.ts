import { CategoryDefinition, ProductionType } from '../types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'LOCATION',
    name: 'Location',
    icon: 'MapPin',
    color: '#3b82f6', // blue
    bgLight: 'rgba(59, 130, 246, 0.15)',
    subCategories: [
      'Studio Rental',
      'Outdoor Location',
      'Permit',
      'Electricity',
      'Parking',
      'Overtime',
      'Other',
    ],
    suggestedUnits: ['Day', 'Hour', 'Slot', 'Item', 'Package'],
  },
  {
    id: 'EQUIPMENT',
    name: 'Equipment',
    icon: 'Camera',
    color: '#8b5cf6', // purple
    bgLight: 'rgba(139, 92, 246, 0.15)',
    subCategories: [
      'Camera',
      'Lens',
      'Lighting',
      'Flash',
      'Grip',
      'Other',
    ],
    suggestedUnits: ['Day', 'Set', 'Package', 'Item', 'Hour'],
  },
  {
    id: 'CREW',
    name: 'Crew',
    icon: 'Users',
    color: '#10b981', // emerald
    bgLight: 'rgba(16, 185, 129, 0.15)',
    subCategories: [
      'Photographer',
      'Videographer',
      'Director',
      'DOP',
      'Camera Assistant',
      'Lighting',
      'BTS',
      'Other',
    ],
    suggestedUnits: ['Day', 'Shift', 'Project', 'Person', 'Hour'],
  },
  {
    id: 'TALENT',
    name: 'Talent',
    icon: 'Sparkles',
    color: '#ec4899', // pink
    bgLight: 'rgba(236, 72, 153, 0.15)',
    subCategories: [
      'Model',
      'Actor',
      'KOL',
      'KOC',
      'Extra',
      'MC',
      'Talent Overtime',
      'Other',
    ],
    suggestedUnits: ['Day', 'Shift', 'Look', 'Post/Video', 'Hour'],
  },
  {
    id: 'STYLING',
    name: 'Styling',
    icon: 'Scissors',
    color: '#f59e0b', // amber
    bgLight: 'rgba(245, 158, 11, 0.15)',
    subCategories: [
      'Makeup',
      'Hair',
      'Stylist',
      'Other',
    ],
    suggestedUnits: ['Look', 'Day', 'Person', 'Package', 'Item'],
  },
  {
    id: 'SET_ART',
    name: 'Set / Art',
    icon: 'Palette',
    color: '#6366f1', // indigo
    bgLight: 'rgba(99, 102, 241, 0.15)',
    subCategories: [
      'Set Design',
      'Props',
      'Furniture',
      'Decoration',
      'Backdrop',
      'Other',
    ],
    suggestedUnits: ['Item', 'Set', 'Day', 'Package', 'Project'],
  },
  {
    id: 'TRANSPORT',
    name: 'Transport',
    icon: 'Truck',
    color: '#06b6d4', // cyan
    bgLight: 'rgba(6, 182, 212, 0.15)',
    subCategories: [
      'Car',
      'Taxi',
      'Grab',
      'Truck',
      'Equipment Transport',
      'Product Transport',
      'Parking',
      'Toll',
      'Fuel',
      'Shipping',
      'Other',
    ],
    suggestedUnits: ['Trip', 'Day', 'Car', 'Turn', 'Km'],
  },
  {
    id: 'FB',
    name: 'F&B',
    icon: 'Coffee',
    color: '#f97316', // orange
    bgLight: 'rgba(249, 115, 22, 0.15)',
    subCategories: [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snack',
      'Coffee',
      'Water',
      'Catering',
      'Other',
    ],
    suggestedUnits: ['Pax', 'Cup', 'Meal', 'Pack', 'Bottle'],
  },
];

export interface QuickAddPreset {
  id: string;
  label: string;
  category_id: string;
  sub_category: string;
  defaultUnit: string;
  icon: string;
  suggestedVendors: string[];
  suggestedAmounts: number[];
  color: string;
}

export const QUICK_ADD_PRESETS: QuickAddPreset[] = [
  {
    id: 'grab',
    label: 'Grab / Di chuyển',
    category_id: 'TRANSPORT',
    sub_category: 'Grab',
    defaultUnit: 'Trip',
    icon: 'Car',
    suggestedVendors: ['Grab Express', 'GrabCar', 'Be Group', 'Xanh SM'],
    suggestedAmounts: [150000, 250000, 350000, 500000],
    color: '#06b6d4',
  },
  {
    id: 'parking',
    label: 'Parking / Gửi xe',
    category_id: 'LOCATION',
    sub_category: 'Parking',
    defaultUnit: 'Turn',
    icon: 'MapPin',
    suggestedVendors: ['Bãi xe Studio', 'Bãi xe TTTM', 'Bảo vệ tòa nhà'],
    suggestedAmounts: [20000, 50000, 100000, 200000],
    color: '#3b82f6',
  },
  {
    id: 'coffee',
    label: 'Coffee / Nước uống',
    category_id: 'FB',
    sub_category: 'Coffee',
    defaultUnit: 'Cup',
    icon: 'Coffee',
    suggestedVendors: ['Highlands Coffee', 'Phúc Long', 'The Coffee House', 'Starbucks'],
    suggestedAmounts: [150000, 300000, 500000, 800000],
    color: '#f97316',
  },
  {
    id: 'food',
    label: 'Cơm đoàn / Food',
    category_id: 'FB',
    sub_category: 'Lunch',
    defaultUnit: 'Pax',
    icon: 'Utensils',
    suggestedVendors: ['Cơm tấm Calmette', 'Quán Cơm Niêu', 'Bánh mì Huỳnh Hoa', 'Catering Đoàn Phim'],
    suggestedAmounts: [350000, 700000, 1200000, 2500000],
    color: '#eab308',
  },
  {
    id: 'props',
    label: 'Props / Đạo cụ gấp',
    category_id: 'SET_ART',
    sub_category: 'Props',
    defaultUnit: 'Item',
    icon: 'Palette',
    suggestedVendors: ['Cửa hàng hoa', 'Miniso', 'Tiệm tạp hóa', 'Shopee Express Hỏa Tốc'],
    suggestedAmounts: [200000, 500000, 1000000, 2000000],
    color: '#6366f1',
  },
  {
    id: 'equipment',
    label: 'Thiết bị phụ trợ',
    category_id: 'EQUIPMENT',
    sub_category: 'Other',
    defaultUnit: 'Item',
    icon: 'Camera',
    suggestedVendors: ['Saigon Camera Rental', 'Hà Nội Lens', 'Mayanhvn'],
    suggestedAmounts: [300000, 600000, 1500000, 3000000],
    color: '#8b5cf6',
  },
  {
    id: 'overtime',
    label: 'Overtime / Giờ phụ trội',
    category_id: 'LOCATION',
    sub_category: 'Overtime',
    defaultUnit: 'Hour',
    icon: 'Clock',
    suggestedVendors: ['Studio ABC', 'Đoàn ánh sáng', 'Bảo vệ'],
    suggestedAmounts: [500000, 1000000, 1500000, 2500000],
    color: '#ec4899',
  },
  {
    id: 'other',
    label: 'Khoản chi khác',
    category_id: 'LOCATION',
    sub_category: 'Other',
    defaultUnit: 'Item',
    icon: 'PlusCircle',
    suggestedVendors: ['Tạp hóa', 'In ấn nhanh', 'Dịch vụ'],
    suggestedAmounts: [100000, 200000, 500000, 1000000],
    color: '#94a3b8',
  },
];

// Production Type presets for auto loading recommended categories & budget weighting
export const PRODUCTION_TYPE_PRESETS: Record<
  ProductionType,
  {
    recommendedCategories: string[];
    defaultBudgetRatio: Record<string, number>; // in percentage
    description: string;
  }
> = {
  'Studio Shooting': {
    recommendedCategories: ['LOCATION', 'EQUIPMENT', 'CREW', 'TALENT', 'STYLING', 'FB'],
    defaultBudgetRatio: {
      LOCATION: 30,
      EQUIPMENT: 20,
      CREW: 25,
      TALENT: 10,
      STYLING: 5,
      FB: 5,
      TRANSPORT: 5,
    },
    description: 'Chụp hình/quay tại Studio (Trọng tâm: Thuê studio, ánh sáng, ekip & makeup)',
  },
  'Outdoor Shooting': {
    recommendedCategories: ['LOCATION', 'TRANSPORT', 'CREW', 'TALENT', 'FB', 'EQUIPMENT'],
    defaultBudgetRatio: {
      LOCATION: 15,
      TRANSPORT: 20,
      CREW: 30,
      TALENT: 15,
      FB: 10,
      EQUIPMENT: 10,
    },
    description: 'Quay chụp ngoại cảnh (Trọng tâm: Giấy phép, di chuyển, hậu cần F&B & ekip)',
  },
  'Product Shooting': {
    recommendedCategories: ['SET_ART', 'EQUIPMENT', 'CREW', 'LOCATION', 'STYLING'],
    defaultBudgetRatio: {
      SET_ART: 35,
      EQUIPMENT: 25,
      CREW: 25,
      LOCATION: 10,
      FB: 5,
    },
    description: 'Chụp ảnh sản phẩm thương mại / Food (Trọng tâm: Đạo cụ, set design & ánh sáng)',
  },
  'Content Shooting': {
    recommendedCategories: ['CREW', 'TALENT', 'FB', 'TRANSPORT', 'SET_ART'],
    defaultBudgetRatio: {
      CREW: 35,
      TALENT: 30,
      FB: 15,
      TRANSPORT: 10,
      SET_ART: 10,
    },
    description: 'Sản xuất video TikTok / Reels / Shorts số lượng lớn',
  },
  'Lookbook': {
    recommendedCategories: ['TALENT', 'STYLING', 'LOCATION', 'CREW', 'FB'],
    defaultBudgetRatio: {
      TALENT: 35,
      STYLING: 20,
      LOCATION: 20,
      CREW: 20,
      FB: 5,
    },
    description: 'Chụp bộ sưu tập thời trang (Trọng tâm: Model chuyên nghiệp, stylist, makeup)',
  },
  'TVC': {
    recommendedCategories: ['CREW', 'TALENT', 'EQUIPMENT', 'LOCATION', 'SET_ART', 'STYLING', 'TRANSPORT', 'FB'],
    defaultBudgetRatio: {
      CREW: 35,
      TALENT: 25,
      EQUIPMENT: 15,
      LOCATION: 10,
      SET_ART: 10,
      FB: 5,
    },
    description: 'Phim quảng cáo quy mô lớn (Đầy đủ Director, DOP, Lighting, Talent chính phụ)',
  },
  'On-set': {
    recommendedCategories: ['CREW', 'EQUIPMENT', 'TRANSPORT', 'FB', 'LOCATION'],
    defaultBudgetRatio: {
      CREW: 40,
      EQUIPMENT: 25,
      FB: 15,
      TRANSPORT: 10,
      LOCATION: 10,
    },
    description: 'Tác nghiệp trực tiếp tại hiện trường/sự kiện',
  },
  'Event': {
    recommendedCategories: ['CREW', 'EQUIPMENT', 'TALENT', 'FB', 'TRANSPORT'],
    defaultBudgetRatio: {
      CREW: 40,
      EQUIPMENT: 30,
      TALENT: 15,
      FB: 10,
      TRANSPORT: 5,
    },
    description: 'Ghi hình sự kiện, hội nghị, khai trương, gala',
  },
  'Livestream': {
    recommendedCategories: ['EQUIPMENT', 'CREW', 'TALENT', 'LOCATION', 'FB'],
    defaultBudgetRatio: {
      EQUIPMENT: 35,
      TALENT: 30,
      CREW: 20,
      LOCATION: 10,
      FB: 5,
    },
    description: 'Livestream bán hàng / Talkshow / Launching',
  },
  'Other': {
    recommendedCategories: ['LOCATION', 'EQUIPMENT', 'CREW', 'TALENT', 'STYLING', 'SET_ART', 'TRANSPORT', 'FB'],
    defaultBudgetRatio: {
      CREW: 25,
      LOCATION: 20,
      EQUIPMENT: 15,
      TALENT: 15,
      SET_ART: 10,
      TRANSPORT: 10,
      FB: 5,
    },
    description: 'Các dự án sản xuất Media tùy chỉnh khác',
  },
};
