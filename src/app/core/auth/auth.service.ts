import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';

import { API_ENDPOINTS } from '../../config/api-endpoints';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { CurrentUserService } from './current-user.service';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LoggedInUser,
  User
} from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

// ─── Mock Data ────────────────────────────────────────────────────────────────
import { of, delay } from 'rxjs';

const MOCK_USERS: Record<string, { password: string; user: LoggedInUser }> = {
  'admin@nexhire.com': {
    password: 'Admin@123',
    user: {
      userId: 1, employeeId: 101, fullName: 'System Admin',
      email: 'admin@nexhire.com', role: 'ADMIN', permissions: [],
    }
  },
  'hr@nexhire.com': {
    password: 'Hr@123',
    user: {
      userId: 2, employeeId: 102, fullName: 'Sarah HR',
      email: 'hr@nexhire.com', role: 'HR', permissions: [],
    }
  },
  'training@nexhire.com': {
    password: 'Training@123',
    user: {
      userId: 3, employeeId: 103, fullName: 'Tom Trainer',
      email: 'training@nexhire.com', role: 'TRAINING_MANAGER', permissions: [],
    }
  },
  'candidate@nexhire.com': {
    password: 'Candidate@123',
    user: {
      userId: 4, fullName: 'John Candidate',
      email: 'candidate@nexhire.com', role: 'CANDIDATE', permissions: [],
    }
  },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private currentUserService: CurrentUserService,
    private router: Router,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────────────────

  register(request: RegisterRequest): Observable<any> {
    if (environment.useMockData) {
      return of({ success: true, message: 'Registered successfully' }).pipe(delay(800));
    }
    return this.http.post(API_ENDPOINTS.AUTH.REGISTER, request);
  }

  // ─── Login ────────────────────────────────────────────────────────────────────

  login(request: LoginRequest): Observable<LoggedInUser> {
    if (environment.useMockData) {
      const mockEntry = MOCK_USERS[request.email];
      if (mockEntry && mockEntry.password === request.password) {
        const user = { ...mockEntry.user };
        this.tokenService.setToken('mock-jwt-token-' + Date.now());
        this.currentUserService.setUser(user);
        return of(user).pipe(
          delay(500),
          tap(u => this.navigateToPortal(u.role))
        );
      }
      throw new Error('Invalid credentials');
    }

    return this.http.post<ApiResponse<AuthResponse> | AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN, request
    ).pipe(
      map(response => this.normalizeAuthResponse(response)),
      tap(user => {
        this.currentUserService.setUser(user);
        this.navigateToPortal(user.role);
      })
    );
  }

  /** Redirect user to their designated portal based on role. */
  navigateToPortal(role: string): void {
    const r = role?.toUpperCase();
    if (r === 'CANDIDATE') {
      this.router.navigate(['/candidate']);
    } else if (r === 'HR' || r === 'TRAINING_MANAGER') {
      this.router.navigate(['/hr']);
    } else if (r === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  // ─── Logout ───────────────────────────────────────────────────────────────────

  logout(): void {
    if (!environment.useMockData) {
      this.http.post(API_ENDPOINTS.AUTH.LOGOUT, {}).subscribe({ error: () => {} });
    }
    this.currentUserService.clearUser();
    this.router.navigate(['/auth/login']);
  }

  // ─── Current User ─────────────────────────────────────────────────────────────

  isLoggedIn(): boolean {
    return this.currentUserService.isLoggedIn();
  }

  getRole(): string | null {
    return this.currentUserService.getRole();
  }

  isCandidate(): boolean {
    const role = this.getRole();
    return role === 'CANDIDATE' || role === null;
  }

  isManagement(): boolean {
    const role = this.getRole();
    return role !== null && role !== 'CANDIDATE';
  }

  // ─── Helper: Normalize varying backend response shapes ────────────────────────

  private normalizeAuthResponse(response: any): LoggedInUser {
    // Wrapped response: { success, message, data: { token, user } }
    if (response?.success !== undefined && response?.data) {
      const data = response.data;
      if (data.token) {
        this.tokenService.setToken(data.token);
      }
      const user = data.user ?? data;
      return this.buildLoggedInUser(user, data.token);
    }
    // Direct response: { token, user } or flat { token, userId, email, role }
    if (response?.token) {
      this.tokenService.setToken(response.token);
    }
    return this.buildLoggedInUser(response, response?.token);
  }

  private buildLoggedInUser(data: any, token?: string): LoggedInUser {
    return {
      userId: data.userId ?? data.id,
      employeeId: data.employeeId,
      fullName: data.fullName ?? data.name ?? '',
      email: data.email ?? '',
      role: data.role ?? 'CANDIDATE',
      permissions: data.permissions ?? [],
      profilePhotoUrl: data.profilePhotoUrl,
      active: data.active ?? true,
    };
  }
}
