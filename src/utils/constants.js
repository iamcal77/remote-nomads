export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const JOB_TYPES = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

export const JOB_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'filled', label: 'Filled' },
  { value: 'archived', label: 'Archived' },
];

export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'candidate', label: 'Candidate' },
];

export const APPLICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'reviewed', label: 'Reviewed', color: 'blue' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
];