import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfferLetter, UpdateOfferStatusRequest } from '../models/offer-letter.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_OFFERS: OfferLetter[] = [
  { offerId: 1, assessmentId: 1, candidateName: 'Rahul Singh', candidateEmail: 'rahul@example.com', jobTitle: 'Java Backend Developer', designation: 'Junior Java Developer', ctc: 600000, joiningDate: '2026-08-01', status: 'SENT', issuedDate: '2026-07-15', expiryDate: '2026-07-29' },
];

@Injectable({ providedIn: 'root' })
export class OfferLetterService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  getAll(): Observable<OfferLetter[]> {
    if (environment.useMockData) return of(MOCK_OFFERS).pipe(delay(400));
    return this.http.get<ApiResponse<OfferLetter[]> | OfferLetter[]>(API_ENDPOINTS.OFFERS.BASE).pipe(map(r => this.unwrap(r) as OfferLetter[]));
  }

  getById(id: number): Observable<OfferLetter> {
    if (environment.useMockData) return of(MOCK_OFFERS.find(o => o.offerId === id)!).pipe(delay(300));
    return this.http.get<ApiResponse<OfferLetter> | OfferLetter>(API_ENDPOINTS.OFFERS.BY_ID(id)).pipe(map(r => this.unwrap(r) as OfferLetter));
  }

  getByUser(userId: number): Observable<OfferLetter[]> {
    if (environment.useMockData) return of(MOCK_OFFERS).pipe(delay(400));
    return this.http.get<ApiResponse<OfferLetter[]> | OfferLetter[]>(API_ENDPOINTS.OFFERS.BY_USER(userId)).pipe(map(r => this.unwrap(r) as OfferLetter[]));
  }

  updateStatus(id: number, request: UpdateOfferStatusRequest): Observable<OfferLetter> {
    if (environment.useMockData) return of({ ...MOCK_OFFERS[0], status: request.status }).pipe(delay(400));
    return this.http.patch<ApiResponse<OfferLetter> | OfferLetter>(API_ENDPOINTS.OFFERS.UPDATE_STATUS(id), request).pipe(map(r => this.unwrap(r) as OfferLetter));
  }
}
