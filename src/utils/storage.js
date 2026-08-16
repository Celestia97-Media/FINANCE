import { INITIAL_SAMPLE_JOBS } from '../data/categories';

const STORAGE_KEY = 'media_finance_jobs_v2';

export const loadJobs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_JOBS));
      return INITIAL_SAMPLE_JOBS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading jobs from localStorage:', err);
    return INITIAL_SAMPLE_JOBS;
  }
};

export const saveJobs = (jobs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (err) {
    console.error('Error saving jobs to localStorage:', err);
  }
};

export const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return num.toLocaleString('vi-VN') + ' VND';
};

export const formatShortCurrency = (val) => {
  const num = Number(val) || 0;
  if (Math.abs(num) >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace('.0', '') + 'B';
  }
  if (Math.abs(num) >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};
