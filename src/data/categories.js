export const PRODUCTION_TYPES = [
  'Studio Shooting',
  'Outdoor Shooting',
  'Product Shooting',
  'Content Shooting',
  'Lookbook',
  'TVC',
  'On-set',
  'Event',
  'Livestream',
  'Other'
];

export const CAMPAIGNS = [
  'Summer Campaign 2026',
  'Fall/Winter Collection',
  'Tet Holiday Special',
  'Brand Refresh 2026',
  'Product Launch Q3',
  'Daily Content / Social',
  'Mega Sale 9.9',
  'Internal Event / Corporate'
];

export const DEPARTMENTS = [
  'Media Production',
  'Marketing & Communications',
  'Creative House',
  'Social Media Team',
  'Brand Marketing',
  'E-Commerce Operations'
];

export const PAID_BY_OPTIONS = [
  'Company',
  'Employee',
  'Freelancer',
  'Vendor'
];

export const PAYMENT_STATUSES = [
  { id: 'Pending', label: 'Pending', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', dot: '🟡' },
  { id: 'Paid', label: 'Paid', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', dot: '🟢' },
  { id: 'Reimbursement', label: 'Reimbursement', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', dot: '⚪' },
  { id: 'Waiting Approval', label: 'Waiting Approval', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', dot: '🔵' },
  { id: 'Approved', label: 'Approved', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', dot: '🟣' },
  { id: 'Rejected', label: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', dot: '🔴' }
];

export const JOB_WORKFLOW_STATUSES = [
  { id: 'Draft', label: 'Draft', color: '#94a3b8' },
  { id: 'Waiting Manager Approval', label: 'Waiting Approval', color: '#3b82f6' },
  { id: 'Approved', label: 'Approved (Budget Locked)', color: '#a855f7' },
  { id: 'Shooting in Progress', label: 'Shooting in Progress', color: '#eab308' },
  { id: 'Finance Review', label: 'Finance Review', color: '#06b6d4' },
  { id: 'Completed', label: 'Completed', color: '#22c55e' }
];

export const CATEGORY_DATABASE = [
  {
    id: 'LOCATION',
    name: 'Location',
    subCategories: [
      'Studio Rental',
      'Outdoor Location',
      'Permit',
      'Electricity',
      'Cleaning',
      'Parking',
      'Overtime',
      'Other'
    ]
  },
  {
    id: 'EQUIPMENT',
    name: 'Equipment',
    subCategories: [
      'Camera',
      'Lens',
      'Lighting',
      'Flash',
      'Tripod',
      'Gimbal',
      'Monitor',
      'Microphone',
      'Sound',
      'Grip',
      'Background',
      'Other'
    ]
  },
  {
    id: 'CREW',
    name: 'Crew',
    subCategories: [
      'Photographer',
      'Videographer',
      'Director',
      'DOP',
      'Camera Assistant',
      'Lighting',
      'Grip',
      'Producer',
      'Production Assistant',
      'Soundman',
      'BTS',
      'Other'
    ]
  },
  {
    id: 'TALENT',
    name: 'Talent',
    subCategories: [
      'Model',
      'Actor',
      'KOL',
      'KOC',
      'Extra',
      'MC',
      'Talent Overtime',
      'Usage Fee',
      'Other'
    ]
  },
  {
    id: 'STYLING',
    name: 'Styling',
    subCategories: [
      'Makeup',
      'Hair',
      'Stylist',
      'Wardrobe Rental',
      'Wardrobe Purchase',
      'Shoes',
      'Accessories',
      'Laundry',
      'Alteration',
      'Other'
    ]
  },
  {
    id: 'SET_ART',
    name: 'Set / Art',
    subCategories: [
      'Set Design',
      'Props',
      'Furniture',
      'Decoration',
      'Backdrop',
      'Printing',
      'Construction',
      'Installation',
      'Dismantling',
      'Other'
    ]
  },
  {
    id: 'TRANSPORT',
    name: 'Transportation',
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
      'Other'
    ]
  },
  {
    id: 'FB',
    name: 'F&B',
    subCategories: [
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snack',
      'Coffee',
      'Water',
      'Catering',
      'Other'
    ]
  },
  {
    id: 'POST_PRODUCTION',
    name: 'Post-Production',
    subCategories: [
      'Editing',
      'Retouch',
      'Color Grading',
      'Motion',
      'VFX',
      'Sound',
      'Voice Over',
      'Music License',
      'Subtitle',
      'Translation',
      'Other'
    ]
  },
  {
    id: 'OTHER',
    name: 'Other',
    subCategories: [
      'Overtime',
      'Emergency Purchase',
      'Printing',
      'Office Supplies',
      'Miscellaneous'
    ]
  }
];

export const TEMPLATE_PRESETS = {
  'Studio Shooting': [
    { category: 'LOCATION', subCategory: 'Studio Rental', description: 'Main Studio 10 hours', quantity: 1, unit: 'Day', unitPrice: 8000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'EQUIPMENT', subCategory: 'Lighting', description: 'Aputure 600d + Softbox package', quantity: 1, unit: 'Set', unitPrice: 3500000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'CREW', subCategory: 'Photographer', description: 'Lead Fashion Photographer', quantity: 1, unit: 'Day', unitPrice: 5000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'TALENT', subCategory: 'Model', description: 'Lookbook Main Model', quantity: 1, unit: 'Day', unitPrice: 3000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'STYLING', subCategory: 'Makeup', description: 'MUA 2 looks', quantity: 1, unit: 'Package', unitPrice: 1200000, paidBy: 'Employee', paymentStatus: 'Reimbursement' },
    { category: 'SET_ART', subCategory: 'Props', description: 'Summer props and flowers', quantity: 1, unit: 'Package', unitPrice: 800000, paidBy: 'Employee', paymentStatus: 'Pending' },
    { category: 'TRANSPORT', subCategory: 'Grab', description: 'Transporting props & wardrobe', quantity: 2, unit: 'Trip', unitPrice: 200000, paidBy: 'Employee', paymentStatus: 'Pending' },
    { category: 'FB', subCategory: 'Lunch', description: 'Crew & Talent Bento boxes', quantity: 10, unit: 'Person', unitPrice: 75000, paidBy: 'Company', paymentStatus: 'Approved' }
  ],
  'Outdoor Shooting': [
    { category: 'LOCATION', subCategory: 'Outdoor Location', description: 'Eco Park Location permit', quantity: 1, unit: 'Day', unitPrice: 5000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'LOCATION', subCategory: 'Permit', description: 'Film permit local authority', quantity: 1, unit: 'Package', unitPrice: 1500000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'TRANSPORT', subCategory: 'Car', description: 'Van 16 seats 1 day', quantity: 1, unit: 'Day', unitPrice: 2000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'EQUIPMENT', subCategory: 'Camera', description: 'Sony FX3 + 24-70 GM II', quantity: 1, unit: 'Set', unitPrice: 2500000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'CREW', subCategory: 'Videographer', description: 'Main Cameraman', quantity: 1, unit: 'Day', unitPrice: 4000000, paidBy: 'Freelancer', paymentStatus: 'Pending' },
    { category: 'TALENT', subCategory: 'Model', description: 'Main Talent', quantity: 1, unit: 'Day', unitPrice: 4000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'FB', subCategory: 'Coffee', description: 'Coffee & Drinks onsite', quantity: 12, unit: 'Pax', unitPrice: 45000, paidBy: 'Employee', paymentStatus: 'Pending' }
  ],
  'TVC': [
    { category: 'LOCATION', subCategory: 'Studio Rental', description: 'Soundstage 200m2', quantity: 2, unit: 'Day', unitPrice: 15000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'CREW', subCategory: 'Director', description: 'Commercial Film Director', quantity: 1, unit: 'Project', unitPrice: 30000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'CREW', subCategory: 'DOP', description: 'Director of Photography', quantity: 1, unit: 'Project', unitPrice: 20000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'EQUIPMENT', subCategory: 'Camera', description: 'ARRI Alexa Mini LF package', quantity: 2, unit: 'Day', unitPrice: 18000000, paidBy: 'Vendor', paymentStatus: 'Approved' },
    { category: 'TALENT', subCategory: 'KOL', description: 'Celebrity Brand Ambassador', quantity: 1, unit: 'Talent', unitPrice: 50000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'SET_ART', subCategory: 'Set Design', description: 'Living room custom set build', quantity: 1, unit: 'Package', unitPrice: 25000000, paidBy: 'Vendor', paymentStatus: 'Approved' },
    { category: 'POST_PRODUCTION', subCategory: 'Editing', description: 'Offline + Online edit 30s & 15s TVC', quantity: 1, unit: 'Package', unitPrice: 15000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'POST_PRODUCTION', subCategory: 'VFX', description: 'Product 3D CG integration', quantity: 1, unit: 'Package', unitPrice: 12000000, paidBy: 'Company', paymentStatus: 'Pending' },
    { category: 'FB', subCategory: 'Catering', description: 'Full day catering 30 pax', quantity: 2, unit: 'Day', unitPrice: 6000000, paidBy: 'Company', paymentStatus: 'Approved' }
  ],
  'Product Shooting': [
    { category: 'LOCATION', subCategory: 'Studio Rental', description: 'Tabletop Product Studio', quantity: 1, unit: 'Day', unitPrice: 3500000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'CREW', subCategory: 'Photographer', description: 'Commercial Product Photographer', quantity: 1, unit: 'Day', unitPrice: 4500000, paidBy: 'Freelancer', paymentStatus: 'Approved' },
    { category: 'EQUIPMENT', subCategory: 'Lighting', description: 'Strobe Broncolor Kit', quantity: 1, unit: 'Set', unitPrice: 2000000, paidBy: 'Company', paymentStatus: 'Approved' },
    { category: 'SET_ART', subCategory: 'Props', description: 'Styling props & textures', quantity: 1, unit: 'Package', unitPrice: 1500000, paidBy: 'Employee', paymentStatus: 'Reimbursement' },
    { category: 'POST_PRODUCTION', subCategory: 'Retouch', description: 'High-end product retouch 20 photos', quantity: 20, unit: 'Photo', unitPrice: 150000, paidBy: 'Freelancer', paymentStatus: 'Pending' }
  ]
};

export const INITIAL_SAMPLE_JOBS = [
  {
    id: 'job_sample_1',
    projectName: 'Summer Campaign 2026',
    campaign: 'Summer Campaign 2026',
    date: '2026-08-16',
    productionType: 'Studio Shooting',
    location: 'Studio ABC, Q4, HCM',
    pic: 'Thanh Thanh (Producer)',
    department: 'Media Production',
    budget: 25000000,
    client: 'Glow Fashion Brand',
    note: 'Shooting lookbook & banner for summer debut. Total 12 outfits.',
    status: 'Shooting in Progress',
    createdAt: '2026-08-10T08:00:00.000Z',
    expenses: [
      {
        id: 'exp_101',
        category: 'LOCATION',
        subCategory: 'Studio Rental',
        description: 'Studio ABC – 10 hours with CYC wall',
        vendor: 'ABC Studio Space',
        quantity: 1,
        unit: 'Day',
        unitPrice: 8000000,
        total: 8000000,
        paidBy: 'Company',
        paymentStatus: 'Paid',
        receiptName: 'invoice_studio_abc_082026.pdf',
        note: 'Shooting 08:00 - 18:00'
      },
      {
        id: 'exp_102',
        category: 'EQUIPMENT',
        subCategory: 'Lighting',
        description: '3x Aputure 600c Pro + Lantern + Softbox',
        vendor: 'Red Rental HCM',
        quantity: 1,
        unit: 'Package',
        unitPrice: 3500000,
        total: 3500000,
        paidBy: 'Company',
        paymentStatus: 'Paid',
        receiptName: 'receipt_lighting_redrental.jpg',
        note: 'Delivered at 07:30'
      },
      {
        id: 'exp_103',
        category: 'CREW',
        subCategory: 'Photographer',
        description: 'Lead Editorial Photographer',
        vendor: 'Alex Dang Studio',
        quantity: 1,
        unit: 'Day',
        unitPrice: 5000000,
        total: 5000000,
        paidBy: 'Company',
        paymentStatus: 'Waiting Approval',
        receiptName: 'contract_photographer.pdf',
        note: 'Includes 100 raw previews onsite'
      },
      {
        id: 'exp_104',
        category: 'TALENT',
        subCategory: 'Model',
        description: 'Main Foreign Model (Sarah)',
        vendor: 'Be Talent Agency',
        quantity: 1,
        unit: 'Day',
        unitPrice: 3000000,
        total: 3000000,
        paidBy: 'Company',
        paymentStatus: 'Approved',
        receiptName: 'model_talent_agreement.pdf',
        note: 'Usage: Social & Website 6 months'
      },
      {
        id: 'exp_105',
        category: 'STYLING',
        subCategory: 'Makeup',
        description: 'Hair & Makeup Artist (2 main concepts)',
        vendor: 'Linh Makeup Pro',
        quantity: 1,
        unit: 'Package',
        unitPrice: 1200000,
        total: 1200000,
        paidBy: 'Employee',
        paymentStatus: 'Reimbursement',
        receiptName: 'momo_linh_mua.png',
        note: 'Paid upfront by PIC'
      },
      {
        id: 'exp_106',
        category: 'TRANSPORT',
        subCategory: 'Grab',
        description: '2 Grab Car trips for clothes & props',
        vendor: 'Grab Vietnam',
        quantity: 2,
        unit: 'Trip',
        unitPrice: 400000,
        total: 800000,
        paidBy: 'Employee',
        paymentStatus: 'Pending',
        receiptName: 'grab_e_invoice.pdf',
        note: 'Reimburse to Runner Nam'
      },
      {
        id: 'exp_107',
        category: 'FB',
        subCategory: 'Lunch',
        description: 'Gourmet Bento for 10 crew members',
        vendor: 'Morico Restaurant',
        quantity: 10,
        unit: 'Pax',
        unitPrice: 75000,
        total: 750000,
        paidBy: 'Company',
        paymentStatus: 'Paid',
        receiptName: 'vat_invoice_lunch.pdf',
        note: 'Included drinks'
      },
      {
        id: 'exp_108',
        category: 'OTHER',
        subCategory: 'Emergency Purchase',
        description: 'Extra double-sided tape, pins, steamer water',
        vendor: 'Mini Stop Q4',
        quantity: 1,
        unit: 'Package',
        unitPrice: 400000,
        total: 400000,
        paidBy: 'Employee',
        paymentStatus: 'Pending',
        receiptName: 'receipt_ministop.jpg',
        note: 'Urgent props backup'
      }
    ]
  },
  {
    id: 'job_sample_2',
    projectName: 'TVC Tet 2026 - Master Video',
    campaign: 'Tet Holiday Special',
    date: '2026-08-28',
    productionType: 'TVC',
    location: 'District 2 Outdoor & Set Studio',
    pic: 'Hoang Nam (Line Producer)',
    department: 'Creative House',
    budget: 180000000,
    client: 'VinDrink Beverage',
    note: 'Big scale commercial production, 2 shoot days.',
    status: 'Approved',
    createdAt: '2026-08-12T10:00:00.000Z',
    expenses: [
      {
        id: 'exp_201',
        category: 'CREW',
        subCategory: 'Director',
        description: 'Commercial Director fee (50% upfront)',
        vendor: 'Studio 68',
        quantity: 1,
        unit: 'Phase',
        unitPrice: 40000000,
        total: 40000000,
        paidBy: 'Company',
        paymentStatus: 'Paid',
        receiptName: 'contract_director_part1.pdf',
        note: 'Signed deposit'
      },
      {
        id: 'exp_202',
        category: 'EQUIPMENT',
        subCategory: 'Camera',
        description: 'Alexa Mini LF + Master Anamorphic Kit',
        vendor: 'CineRental Saigon',
        quantity: 2,
        unit: 'Day',
        unitPrice: 22000000,
        total: 44000000,
        paidBy: 'Vendor',
        paymentStatus: 'Waiting Approval',
        receiptName: 'quotation_cine_rental.pdf',
        note: 'Includes camera tech crew'
      }
    ]
  }
];
