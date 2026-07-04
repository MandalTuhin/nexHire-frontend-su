import { environment } from '../../environments/environment';

const BASE = environment.apiBaseUrl;

/**
 * Centralized API endpoint configuration.
 * All backend URL paths are defined here.
 * To adapt to backend changes, only update this file.
 */
export const API_ENDPOINTS = {

  // ─── Auth / Users ────────────────────────────────────────────────────────────
  AUTH: {
    REGISTER: `${BASE}/api/users/register`,
    LOGIN: `${BASE}/api/users/login`,
    LOGOUT: `${BASE}/api/users/logout`,
    REFRESH_TOKEN: `${BASE}/api/auth/refresh`,
    ME: `${BASE}/api/users/me`,
  },

  // ─── Users ───────────────────────────────────────────────────────────────────
  USERS: {
    BASE: `${BASE}/api/users`,
    BY_ID: (id: number) => `${BASE}/api/users/${id}`,
    UPDATE: (id: number) => `${BASE}/api/users/${id}`,
    PROFILE_PHOTO: (id: number) => `${BASE}/api/users/${id}/photo`,
    RESUME: (id: number) => `${BASE}/api/users/${id}/resume`,
  },

  // ─── Jobs ─────────────────────────────────────────────────────────────────────
  JOBS: {
    BASE: `${BASE}/api/jobs`,
    BY_ID: (id: number) => `${BASE}/api/jobs/${id}`,
    CREATE: `${BASE}/api/jobs`,
    UPDATE: (id: number) => `${BASE}/api/jobs/${id}`,
    DELETE: (id: number) => `${BASE}/api/jobs/${id}`,
    ACTIVE: `${BASE}/api/jobs/active`,
  },

  // ─── Applications ─────────────────────────────────────────────────────────────
  APPLICATIONS: {
    BASE: `${BASE}/api/applications`,
    APPLY: `${BASE}/api/applications/apply`,
    BY_ID: (id: number) => `${BASE}/api/applications/${id}`,
    BY_USER: (userId: number) => `${BASE}/api/applications/user/${userId}`,
    BY_JOB: (jobId: number) => `${BASE}/api/applications/job/${jobId}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/applications/${id}/status`,
    WITHDRAW: (id: number) => `${BASE}/api/applications/${id}/withdraw`,
  },

  // ─── Assessments ──────────────────────────────────────────────────────────────
  ASSESSMENTS: {
    BASE: `${BASE}/api/assessments`,
    ASSIGN_SELECTED: `${BASE}/api/assessments/assign-selected`,
    ASSIGN_ALL: (jobId: number) => `${BASE}/api/assessments/assign-all/${jobId}`,
    BY_ID: (id: number) => `${BASE}/api/assessments/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/assessments/${id}/status`,
    BY_APPLICATION: (appId: number) => `${BASE}/api/assessments/application/${appId}`,
  },

  // ─── Offer Letters ────────────────────────────────────────────────────────────
  OFFERS: {
    BASE: `${BASE}/api/offers`,
    BY_ID: (id: number) => `${BASE}/api/offers/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/offers/${id}/status`,
    BY_USER: (userId: number) => `${BASE}/api/offers/user/${userId}`,
    DOWNLOAD: (id: number) => `${BASE}/api/offers/${id}/download`,
  },

  // ─── Background Verification ──────────────────────────────────────────────────
  BGV: {
    BASE: `${BASE}/api/bgv`,
    BY_ID: (id: number) => `${BASE}/api/bgv/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/bgv/${id}/status`,
    BY_EMPLOYEE: (empId: number) => `${BASE}/api/bgv/employee/${empId}`,
  },

  // ─── Employees ────────────────────────────────────────────────────────────────
  EMPLOYEES: {
    BASE: `${BASE}/api/employees`,
    BY_ID: (id: number) => `${BASE}/api/employees/${id}`,
    UPDATE_ROLE: (id: number) => `${BASE}/api/employees/${id}/role`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/employees/${id}/status`,
    SEARCH: `${BASE}/api/employees/search`,
  },

  // ─── Admin ────────────────────────────────────────────────────────────────────
  ADMINS: {
    BASE: `${BASE}/api/admins`,
    BY_ID: (id: number) => `${BASE}/api/admins/${id}`,
    CREATE: `${BASE}/api/admins`,
    STATS: `${BASE}/api/admins/stats`,
  },

  // ─── Roles ────────────────────────────────────────────────────────────────────
  ROLES: {
    BASE: `${BASE}/api/roles`,
    BY_ID: (id: number) => `${BASE}/api/roles/${id}`,
    CREATE: `${BASE}/api/roles`,
    UPDATE: (id: number) => `${BASE}/api/roles/${id}`,
    DELETE: (id: number) => `${BASE}/api/roles/${id}`,
    PERMISSIONS: (roleId: number) => `${BASE}/api/roles/${roleId}/permissions`,
    ASSIGN_PERMISSIONS: (roleId: number) => `${BASE}/api/roles/${roleId}/permissions`,
  },

  // ─── Permissions ──────────────────────────────────────────────────────────────
  PERMISSIONS: {
    BASE: `${BASE}/api/permissions`,
    BY_ID: (id: number) => `${BASE}/api/permissions/${id}`,
    CREATE: `${BASE}/api/permissions`,
    UPDATE: (id: number) => `${BASE}/api/permissions/${id}`,
    DELETE: (id: number) => `${BASE}/api/permissions/${id}`,
  },

  // ─── Selected Candidates ──────────────────────────────────────────────────────
  SELECTED: {
    BASE: `${BASE}/api/selected`,
    BY_ID: (id: number) => `${BASE}/api/selected/${id}`,
    BY_EMPLOYEE: (empId: number) => `${BASE}/api/selected/employee/${empId}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/selected/${id}/status`,
  },

  // ─── City ─────────────────────────────────────────────────────────────────────
  CITIES: {
    BASE: `${BASE}/api/cities`,
    BY_ID: (id: number) => `${BASE}/api/cities/${id}`,
    CREATE: `${BASE}/api/cities`,
    UPDATE: (id: number) => `${BASE}/api/cities/${id}`,
    BUDGET: (id: number) => `${BASE}/api/cities/${id}/budget`,
  },

  // ─── Branches ─────────────────────────────────────────────────────────────────
  BRANCHES: {
    BASE: `${BASE}/api/branches`,
    BY_ID: (id: number) => `${BASE}/api/branches/${id}`,
    BY_CITY: (cityId: number) => `${BASE}/api/branches/city/${cityId}`,
    CREATE: `${BASE}/api/branches`,
    UPDATE: (id: number) => `${BASE}/api/branches/${id}`,
  },

  // ─── Blocks ───────────────────────────────────────────────────────────────────
  BLOCKS: {
    BASE: `${BASE}/api/blocks`,
    BY_ID: (id: number) => `${BASE}/api/blocks/${id}`,
    BY_BRANCH: (branchId: number) => `${BASE}/api/blocks/branch/${branchId}`,
    CREATE: `${BASE}/api/blocks`,
    UPDATE: (id: number) => `${BASE}/api/blocks/${id}`,
    VACANCY: (id: number) => `${BASE}/api/blocks/${id}/vacancy`,
  },

  // ─── Budgets ──────────────────────────────────────────────────────────────────
  BUDGETS: {
    BASE: `${BASE}/api/budgets`,
    BY_CITY: (cityId: number) => `${BASE}/api/budgets/city/${cityId}`,
    UPDATE: (id: number) => `${BASE}/api/budgets/${id}`,
  },

  // ─── Trainings ────────────────────────────────────────────────────────────────
  TRAININGS: {
    BASE: `${BASE}/api/trainings`,
    BY_ID: (id: number) => `${BASE}/api/trainings/${id}`,
    CREATE: `${BASE}/api/trainings`,
    UPDATE: (id: number) => `${BASE}/api/trainings/${id}`,
    ACTIVE: `${BASE}/api/trainings/active`,
  },

  // ─── Training Assignments ─────────────────────────────────────────────────────
  TRAINING_ASSIGNMENTS: {
    BASE: `${BASE}/api/training-assignments`,
    ASSIGN: `${BASE}/api/training-assignments`,
    BULK_ASSIGN: `${BASE}/api/training-assignments/bulk`,
  },

  // ─── Trainees ─────────────────────────────────────────────────────────────────
  TRAINEES: {
    BASE: `${BASE}/api/trainees`,
    BY_ID: (id: number) => `${BASE}/api/trainees/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/trainees/${id}/status`,
    UPDATE_PROGRESS: (id: number) => `${BASE}/api/trainees/${id}/progress`,
    BY_TRAINING: (trainingId: number) => `${BASE}/api/trainees/training/${trainingId}`,
  },

  // ─── Assets ───────────────────────────────────────────────────────────────────
  ASSETS: {
    BASE: `${BASE}/api/assets`,
    BY_ID: (id: number) => `${BASE}/api/assets/${id}`,
    CREATE: `${BASE}/api/assets`,
    UPDATE: (id: number) => `${BASE}/api/assets/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/assets/${id}/status`,
    AVAILABLE: `${BASE}/api/assets/available`,
  },

  // ─── Asset Assignments ────────────────────────────────────────────────────────
  ASSET_ASSIGNMENTS: {
    BASE: `${BASE}/api/asset-assignments`,
    BY_ID: (id: number) => `${BASE}/api/asset-assignments/${id}`,
    ASSIGN: `${BASE}/api/asset-assignments`,
    RETURN: (id: number) => `${BASE}/api/asset-assignments/${id}/return`,
    BY_TRAINEE: (traineeId: number) => `${BASE}/api/asset-assignments/trainee/${traineeId}`,
  },

  // ─── Released Candidates ──────────────────────────────────────────────────────
  RELEASED: {
    BASE: `${BASE}/api/released`,
    BY_ID: (id: number) => `${BASE}/api/released/${id}`,
    BY_DOMAIN: (domain: string) => `${BASE}/api/released/domain/${domain}`,
  },

  // ─── Projects ─────────────────────────────────────────────────────────────────
  PROJECTS: {
    BASE: `${BASE}/api/projects`,
    BY_ID: (id: number) => `${BASE}/api/projects/${id}`,
    CREATE: `${BASE}/api/projects`,
    UPDATE: (id: number) => `${BASE}/api/projects/${id}`,
    UPDATE_STATUS: (id: number) => `${BASE}/api/projects/${id}/status`,
    ACTIVE: `${BASE}/api/projects/active`,
  },

  // ─── Project Allocations ──────────────────────────────────────────────────────
  PROJECT_ALLOCATIONS: {
    BASE: `${BASE}/api/project-allocations`,
    BY_ID: (id: number) => `${BASE}/api/project-allocations/${id}`,
    ALLOCATE: `${BASE}/api/project-allocations`,
    BY_PROJECT: (projectId: number) => `${BASE}/api/project-allocations/project/${projectId}`,
    BY_RELEASED: (releasedId: number) => `${BASE}/api/project-allocations/released/${releasedId}`,
  },

  // ─── Dashboard ────────────────────────────────────────────────────────────────
  DASHBOARD: {
    STATS: `${BASE}/api/dashboard/stats`,
    CHARTS: `${BASE}/api/dashboard/charts`,
    APPLICATION_CHART: `${BASE}/api/dashboard/charts/applications`,
    ASSESSMENT_CHART: `${BASE}/api/dashboard/charts/assessments`,
    BGV_CHART: `${BASE}/api/dashboard/charts/bgv`,
    TRAINING_CHART: `${BASE}/api/dashboard/charts/training`,
    PROJECT_CHART: `${BASE}/api/dashboard/charts/projects`,
    BUDGET_CHART: `${BASE}/api/dashboard/charts/budget`,
  },

} as const;
