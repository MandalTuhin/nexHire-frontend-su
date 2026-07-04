import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackgroundVerification, UpdateBgvStatusRequest } from '../models/background-verification.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_BGV: BackgroundVerification[] = [
  { bgvId: 1, offerId: 1, candidateName: 'Rahul Singh', candidateEmail: 'rahul@example.com', status: 'PENDING', initiatedDate: '2026-07-20' },
];

@Injectable({ providedIn: 'root' })
export class BackgroundVerificationService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<BackgroundVerification[]> {
    if (environment.useMockData) return of(MOCK_BGV).pipe(delay(400));
    return this.http.get<ApiResponse<BackgroundVerification[]> | BackgroundVerification[]>(API_ENDPOINTS.BGV.BASE).pipe(map(r => this.unwrap(r) as BackgroundVerification[]));
  }

  getById(id: number): Observable<BackgroundVerification> {
    if (environment.useMockData) return of(MOCK_BGV.find(b => b.bgvId === id)!).pipe(delay(300));
    return this.http.get<ApiResponse<BackgroundVerification> | BackgroundVerification>(API_ENDPOINTS.BGV.BY_ID(id)).pipe(map(r => this.unwrap(r) as BackgroundVerification));
  }

  updateStatus(id: number, request: UpdateBgvStatusRequest): Observable<BackgroundVerification> {
    if (environment.useMockData) return of({ ...MOCK_BGV[0], status: request.status }).pipe(delay(400));
    return this.http.patch<ApiResponse<BackgroundVerification> | BackgroundVerification>(API_ENDPOINTS.BGV.UPDATE_STATUS(id), request).pipe(map(r => this.unwrap(r) as BackgroundVerification));
  }
}
