import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardStats, ChartData } from '../models/admin.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_STATS: DashboardStats = {
  totalUsers: 245, totalJobs: 12, totalApplications: 186, pendingApplications: 42,
  shortlistedApplications: 78, assessmentsAssigned: 65, assessmentsPassed: 48,
  assessmentsFailed: 12, offersSent: 48, offersAccepted: 39, offersRejected: 9,
  bgvPending: 15, bgvCleared: 28, employeesCreated: 28, selectedCandidates: 28,
  traineesActive: 22, trainingCompleted: 14, assetsAssigned: 38, releasedCandidates: 14,
  projectsActive: 5, candidatesAllocated: 12, totalBudgetUsed: 3500000,
  totalBudgetAvailable: 6500000, totalVacancyUsed: 65, totalVacancyAvailable: 85,
  totalEmployees: 28, totalAdmins: 2,
};

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  getStats(): Observable<DashboardStats> {
    if (environment.useMockData) return of(MOCK_STATS).pipe(delay(500));
    return this.http.get<ApiResponse<DashboardStats> | DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS).pipe(map(r => this.unwrap(r) as DashboardStats));
  }

  getApplicationChart(): Observable<ChartData> {
    if (environment.useMockData) {
      return of({ labels: ['Applied', 'Shortlisted', 'Rejected', 'Withdrawn'], datasets: [{ label: 'Applications', data: [42, 78, 55, 11], backgroundColor: ['#3b82f6','#22c55e','#ef4444','#94a3b8'] }] }).pipe(delay(300));
    }
    return this.http.get<ChartData>(API_ENDPOINTS.DASHBOARD.APPLICATION_CHART);
  }

  getAssessmentChart(): Observable<ChartData> {
    if (environment.useMockData) {
      return of({ labels: ['Assigned', 'In Progress', 'Passed', 'Failed'], datasets: [{ label: 'Assessments', data: [15, 5, 48, 12], backgroundColor: ['#3b82f6','#f59e0b','#22c55e','#ef4444'] }] }).pipe(delay(300));
    }
    return this.http.get<ChartData>(API_ENDPOINTS.DASHBOARD.ASSESSMENT_CHART);
  }

  getBgvChart(): Observable<ChartData> {
    if (environment.useMockData) {
      return of({ labels: ['Pending', 'In Progress', 'Cleared', 'Failed', 'On Hold'], datasets: [{ label: 'BGV', data: [15, 5, 28, 3, 2], backgroundColor: ['#f59e0b','#3b82f6','#22c55e','#ef4444','#f97316'] }] }).pipe(delay(300));
    }
    return this.http.get<ChartData>(API_ENDPOINTS.DASHBOARD.BGV_CHART);
  }

  getTrainingChart(): Observable<ChartData> {
    if (environment.useMockData) {
      return of({ labels: ['Assigned', 'In Progress', 'Completed', 'Failed', 'Dropped'], datasets: [{ label: 'Training', data: [5, 22, 14, 2, 1], backgroundColor: ['#3b82f6','#f59e0b','#22c55e','#ef4444','#6b7280'] }] }).pipe(delay(300));
    }
    return this.http.get<ChartData>(API_ENDPOINTS.DASHBOARD.TRAINING_CHART);
  }
}
