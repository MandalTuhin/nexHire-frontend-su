import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Assessment, AssignSelectedRequest, AssignAllEligibleRequest, UpdateAssessmentStatusRequest, AssessmentBulkResult, AssessmentSkipRecord } from '../models/assessment.model';
import { Application } from '../models/application.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_ASSESSMENTS: Assessment[] = [
  { assessmentId: 1, applicationId: 5, candidateName: 'Rahul Singh', candidateEmail: 'rahul@example.com', jobTitle: 'Java Backend Developer', assessmentType: 'JAVA', assessmentDate: '2026-07-10', status: 'PASSED', score: 85, maxScore: 100, assignedAt: '2026-06-25' },
  { assessmentId: 2, applicationId: 2, candidateName: 'Priya Sharma', candidateEmail: 'priya@example.com', jobTitle: 'Java Backend Developer', assessmentType: 'JAVA', assessmentDate: '2026-07-10', status: 'ASSIGNED', assignedAt: '2026-06-25' },
];

const MOCK_APPLICATIONS: Application[] = [
  { applicationId: 1, userId: 4, jobId: 1, userFullName: 'John Candidate', userEmail: 'john@example.com', userPhone: '9876543210', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'APPLIED', appliedDate: '2026-06-15' },
  { applicationId: 2, userId: 5, jobId: 1, userFullName: 'Priya Sharma', userEmail: 'priya@example.com', userPhone: '9876543211', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'SHORTLISTED', appliedDate: '2026-06-16' },
  { applicationId: 3, userId: 6, jobId: 2, userFullName: 'Arjun Kumar', userEmail: 'arjun@example.com', userPhone: '9876543212', jobTitle: 'Angular Frontend Developer', jobLocation: 'Mumbai', status: 'SHORTLISTED', appliedDate: '2026-06-17' },
  { applicationId: 4, userId: 7, jobId: 3, userFullName: 'Meena Patel', userEmail: 'meena@example.com', userPhone: '9876543213', jobTitle: 'Python Data Scientist', jobLocation: 'Hyderabad', status: 'REJECTED', appliedDate: '2026-06-18' },
  { applicationId: 5, userId: 8, jobId: 1, userFullName: 'Rahul Singh', userEmail: 'rahul@example.com', userPhone: '9876543214', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'SHORTLISTED', appliedDate: '2026-06-19' },
];

@Injectable({ providedIn: 'root' })
export class AssessmentService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<Assessment[]> {
    if (environment.useMockData) return of(MOCK_ASSESSMENTS).pipe(delay(400));
    return this.http.get<ApiResponse<Assessment[]> | Assessment[]>(API_ENDPOINTS.ASSESSMENTS.BASE).pipe(map(r => this.unwrap(r) as Assessment[]));
  }

  getById(id: number): Observable<Assessment> {
    if (environment.useMockData) return of(MOCK_ASSESSMENTS.find(a => a.assessmentId === id)!).pipe(delay(300));
    return this.http.get<ApiResponse<Assessment> | Assessment>(API_ENDPOINTS.ASSESSMENTS.BY_ID(id)).pipe(map(r => this.unwrap(r) as Assessment));
  }

  assignSelected(request: AssignSelectedRequest): Observable<AssessmentBulkResult> {
    if (environment.useMockData) {
      const uniqueIds = Array.from(new Set(request.applicationIds));
      const skippedRecords: AssessmentSkipRecord[] = [];
      const failedRecords: AssessmentSkipRecord[] = [];
      let assignedCount = 0;

      uniqueIds.forEach(applicationId => {
        const application = MOCK_APPLICATIONS.find(a => a.applicationId === applicationId);
        const alreadyAssigned = MOCK_ASSESSMENTS.some(a => a.applicationId === applicationId);

        if (!application) {
          failedRecords.push({ applicationId, reason: 'Application not found' });
          return;
        }

        if (application.status !== 'SHORTLISTED') {
          skippedRecords.push({
            applicationId,
            candidateName: application.userFullName,
            reason: `Application status is ${application.status} and not eligible for assessment`
          });
          return;
        }

        if (alreadyAssigned) {
          skippedRecords.push({
            applicationId,
            candidateName: application.userFullName,
            reason: 'Assessment is already assigned for this application'
          });
          return;
        }

        const newAssessment: Assessment = {
          assessmentId: Date.now() + assignedCount,
          applicationId: application.applicationId,
          userId: application.userId,
          jobId: application.jobId,
          candidateName: application.userFullName,
          candidateEmail: application.userEmail,
          jobTitle: application.jobTitle,
          assessmentType: request.assessmentType,
          assessmentDate: request.assessmentDate,
          status: 'ASSIGNED',
          assignedAt: new Date().toISOString()
        };

        MOCK_ASSESSMENTS.push(newAssessment);
        assignedCount++;
      });

      const result: AssessmentBulkResult = {
        totalRequested: uniqueIds.length,
        assignedCount,
        skippedCount: skippedRecords.length,
        failedCount: failedRecords.length,
        skippedRecords,
        failedRecords
      };
      return of(result).pipe(delay(800));
    }
    return this.http.post<ApiResponse<AssessmentBulkResult> | AssessmentBulkResult>(API_ENDPOINTS.ASSESSMENTS.ASSIGN_SELECTED, request).pipe(map(r => this.unwrap(r) as AssessmentBulkResult));
  }

  assignAllEligible(jobId: number, request: AssignAllEligibleRequest): Observable<AssessmentBulkResult> {
    if (environment.useMockData) {
      const jobApplications = MOCK_APPLICATIONS.filter(a => a.jobId === jobId);
      const skippedRecords: AssessmentSkipRecord[] = [];
      let assignedCount = 0;

      jobApplications.forEach(application => {
        const alreadyAssigned = MOCK_ASSESSMENTS.some(a => a.applicationId === application.applicationId);
        if (application.status !== 'SHORTLISTED') {
          skippedRecords.push({
            applicationId: application.applicationId,
            candidateName: application.userFullName,
            reason: `Application status is ${application.status}`
          });
          return;
        }

        if (alreadyAssigned) {
          skippedRecords.push({
            applicationId: application.applicationId,
            candidateName: application.userFullName,
            reason: 'Assessment already assigned for this application'
          });
          return;
        }

        const newAssessment: Assessment = {
          assessmentId: Date.now() + assignedCount,
          applicationId: application.applicationId,
          userId: application.userId,
          jobId: application.jobId,
          candidateName: application.userFullName,
          candidateEmail: application.userEmail,
          jobTitle: application.jobTitle,
          assessmentType: request.assessmentType,
          assessmentDate: request.assessmentDate,
          status: 'ASSIGNED',
          assignedAt: new Date().toISOString()
        };

        MOCK_ASSESSMENTS.push(newAssessment);
        assignedCount++;
      });

      const result: AssessmentBulkResult = {
        totalRequested: jobApplications.length,
        assignedCount,
        skippedCount: skippedRecords.length,
        failedCount: 0,
        skippedRecords,
        failedRecords: []
      };
      return of(result).pipe(delay(1000));
    }
    return this.http.post<ApiResponse<AssessmentBulkResult> | AssessmentBulkResult>(API_ENDPOINTS.ASSESSMENTS.ASSIGN_ALL(jobId), request).pipe(map(r => this.unwrap(r) as AssessmentBulkResult));
  }

  updateStatus(id: number, request: UpdateAssessmentStatusRequest): Observable<Assessment> {
    if (environment.useMockData) return of({ ...MOCK_ASSESSMENTS[0], status: request.status }).pipe(delay(400));
    return this.http.patch<ApiResponse<Assessment> | Assessment>(API_ENDPOINTS.ASSESSMENTS.UPDATE_STATUS(id), request).pipe(map(r => this.unwrap(r) as Assessment));
  }
}
