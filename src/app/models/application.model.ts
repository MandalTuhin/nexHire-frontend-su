// ─── Application Models ───────────────────────────────────────────────────────

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'WITHDRAWN';

export interface Application {
  applicationId: number;
  userId: number;
  jobId: number;
  // Populated joins
  userFullName?: string;
  userEmail?: string;
  userPhone?: string;
  userResumeUrl?: string;
  coverLetter?: string;
  jobTitle?: string;
  jobLocation?: string;
  status: ApplicationStatus;
  appliedDate: string;
  updatedAt?: string;
  remarks?: string;
  // Assessment info (if exists)
  assessmentId?: number;
  assessmentStatus?: string;
  // Offer info (if exists)
  offerId?: number;
  offerStatus?: string;
}

export interface ApplyRequest {
  jobId: number;
  userId: number;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  remarks?: string;
}

export interface ApplicationFilter {
  jobId?: number;
  status?: ApplicationStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
