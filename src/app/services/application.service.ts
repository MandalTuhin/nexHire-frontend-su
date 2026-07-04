import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Application, ApplyRequest, UpdateApplicationStatusRequest, ApplicationFilter } from '../models/application.model';
import { ApiResponse } from '../models/api-response.model';
import { JobService } from './job.service';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_APPLICATIONS: Application[] = [
  { applicationId: 1, userId: 4, jobId: 1, userFullName: 'John Candidate', userEmail: 'john@example.com', userPhone: '9876543210', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'APPLIED', appliedDate: '2026-06-15' },
  { applicationId: 2, userId: 5, jobId: 1, userFullName: 'Priya Sharma', userEmail: 'priya@example.com', userPhone: '9876543211', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'SHORTLISTED', appliedDate: '2026-06-16' },
  { applicationId: 3, userId: 6, jobId: 2, userFullName: 'Arjun Kumar', userEmail: 'arjun@example.com', userPhone: '9876543212', jobTitle: 'Angular Frontend Developer', jobLocation: 'Mumbai', status: 'APPLIED', appliedDate: '2026-06-17' },
  { applicationId: 4, userId: 7, jobId: 3, userFullName: 'Meena Patel', userEmail: 'meena@example.com', userPhone: '9876543213', jobTitle: 'Python Data Scientist', jobLocation: 'Hyderabad', status: 'REJECTED', appliedDate: '2026-06-18' },
  { applicationId: 5, userId: 8, jobId: 1, userFullName: 'Rahul Singh', userEmail: 'rahul@example.com', userPhone: '9876543214', jobTitle: 'Java Backend Developer', jobLocation: 'Bangalore', status: 'APPLIED', appliedDate: '2026-06-19', assessmentId: 1, assessmentStatus: 'PASSED' },
];

@Injectable({ providedIn: 'root' })
export class ApplicationService extends BaseService {
  constructor(http: HttpClient, private jobService: JobService) { super(http); }

  getAll(filters?: ApplicationFilter): Observable<Application[]> {
    if (environment.useMockData) {
      let apps = [...MOCK_APPLICATIONS];
      if (filters?.jobId) apps = apps.filter(a => a.jobId === filters.jobId);
      if (filters?.status) apps = apps.filter(a => a.status === filters.status);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        apps = apps.filter(a => a.userFullName?.toLowerCase().includes(s) || a.userEmail?.toLowerCase().includes(s));
      }
      return of(apps).pipe(delay(400));
    }
    const params = filters ? this.buildParams(filters as any) : undefined;
    return this.http.get<ApiResponse<Application[]> | Application[]>(API_ENDPOINTS.APPLICATIONS.BASE, { params }).pipe(
      map(r => this.unwrap(r) as Application[])
    );
  }

  getById(id: number): Observable<Application> {
    if (environment.useMockData) return of(MOCK_APPLICATIONS.find(a => a.applicationId === id)!).pipe(delay(300));
    return this.http.get<ApiResponse<Application> | Application>(API_ENDPOINTS.APPLICATIONS.BY_ID(id)).pipe(
      map(r => this.unwrap(r) as Application)
    );
  }

  getByUser(userId: number): Observable<Application[]> {
    if (environment.useMockData) return of(MOCK_APPLICATIONS.filter(a => a.userId === userId)).pipe(delay(400));
    return this.http.get<ApiResponse<Application[]> | Application[]>(API_ENDPOINTS.APPLICATIONS.BY_USER(userId)).pipe(
      map(r => this.unwrap(r) as Application[])
    );
  }

  apply(request: ApplyRequest): Observable<Application> {
    if (environment.useMockData) {
      return this.jobService.getById(request.jobId).pipe(
        map(job => {
          const newApp: Application = {
            applicationId: Date.now(),
            userId: request.userId,
            jobId: request.jobId,
            jobTitle: job?.jobTitle,
            jobLocation: job?.location,
            status: 'APPLIED',
            appliedDate: new Date().toISOString(),
            coverLetter: request.coverLetter
          };
          return newApp;
        }),
        delay(600)
      );
    }
    return this.http.post<ApiResponse<Application> | Application>(API_ENDPOINTS.APPLICATIONS.APPLY, request).pipe(
      map(r => this.unwrap(r) as Application)
    );
  }

  updateStatus(id: number, request: UpdateApplicationStatusRequest): Observable<Application> {
    if (environment.useMockData) {
      const app = MOCK_APPLICATIONS.find(a => a.applicationId === id);
      if (app) app.status = request.status;
      return of({ ...MOCK_APPLICATIONS[0], status: request.status }).pipe(delay(400));
    }
    return this.http.patch<ApiResponse<Application> | Application>(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), request).pipe(
      map(r => this.unwrap(r) as Application)
    );
  }
}
