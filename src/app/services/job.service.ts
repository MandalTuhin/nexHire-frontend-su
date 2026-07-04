import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, CreateJobRequest, JobFilter } from '../models/job.model';
import { ApiResponse } from '../models/api-response.model';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

const MOCK_JOBS: Job[] = [
  { jobId: 1, jobTitle: 'Java Backend Developer', jobDescription: 'Develop and maintain Java Spring Boot microservices', companyName: 'NexHire', clientName: 'TechCorp', location: 'Bangalore', requiredSkills: 'Java, Spring Boot, Microservices, MySQL', experienceLevel: 'JUNIOR', minExperience: 0, maxExperience: 2, jobType: 'FULL_TIME', salaryMin: 500000, salaryMax: 800000, currency: 'INR', postedDate: '2026-06-01', deadline: '2026-08-01', status: 'ACTIVE', domain: 'JAVA', openings: 10 },
  { jobId: 2, jobTitle: 'Angular Frontend Developer', jobDescription: 'Build responsive enterprise Angular applications', companyName: 'NexHire', location: 'Mumbai', requiredSkills: 'Angular, TypeScript, HTML, SCSS, REST APIs', experienceLevel: 'JUNIOR', minExperience: 0, maxExperience: 2, jobType: 'FULL_TIME', salaryMin: 450000, salaryMax: 750000, currency: 'INR', postedDate: '2026-06-05', deadline: '2026-08-05', status: 'ACTIVE', domain: 'ANGULAR', openings: 8 },
  { jobId: 3, jobTitle: 'Python Data Scientist', jobDescription: 'Work on ML models and data pipelines', companyName: 'NexHire', location: 'Hyderabad', requiredSkills: 'Python, Pandas, TensorFlow, SQL', experienceLevel: 'MID', minExperience: 1, maxExperience: 3, jobType: 'FULL_TIME', salaryMin: 600000, salaryMax: 900000, currency: 'INR', postedDate: '2026-06-10', deadline: '2026-09-01', status: 'ACTIVE', domain: 'PYTHON', openings: 5 },
  { jobId: 4, jobTitle: 'DevOps Engineer', jobDescription: 'CI/CD, Docker, Kubernetes deployment management', companyName: 'NexHire', location: 'Pune', requiredSkills: 'Docker, Kubernetes, Jenkins, AWS, Linux', experienceLevel: 'MID', minExperience: 1, maxExperience: 3, jobType: 'FULL_TIME', salaryMin: 700000, salaryMax: 1000000, currency: 'INR', postedDate: '2026-06-15', deadline: '2026-09-15', status: 'ACTIVE', domain: 'DEVOPS', openings: 4 },
  { jobId: 5, jobTitle: 'React Frontend Developer', jobDescription: 'Build modern UI with React and Redux', companyName: 'NexHire', location: 'Chennai', requiredSkills: 'React, Redux, JavaScript, CSS, REST APIs', experienceLevel: 'JUNIOR', minExperience: 0, maxExperience: 2, jobType: 'FULL_TIME', salaryMin: 480000, salaryMax: 720000, currency: 'INR', postedDate: '2026-06-20', deadline: '2026-08-20', status: 'ACTIVE', domain: 'REACT', openings: 6 },
];

@Injectable({ providedIn: 'root' })
export class JobService extends BaseService {
  constructor(http: HttpClient) { super(http); }

  getAll(filters?: JobFilter): Observable<Job[]> {
    if (environment.useMockData) {
      let jobs = [...MOCK_JOBS];
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        jobs = jobs.filter(j => j.jobTitle.toLowerCase().includes(s) || j.requiredSkills.toLowerCase().includes(s));
      }
      if (filters?.status) jobs = jobs.filter(j => j.status === filters.status);
      if (filters?.location) jobs = jobs.filter(j => j.location.toLowerCase().includes(filters.location!.toLowerCase()));
      if (filters?.domain) jobs = jobs.filter(j => j.domain === filters.domain);
      return of(jobs).pipe(delay(400));
    }
    const params = filters ? this.buildParams(filters as any) : undefined;
    return this.http.get<ApiResponse<Job[]> | Job[]>(API_ENDPOINTS.JOBS.BASE, { params }).pipe(
      map(r => this.unwrap(r) as Job[])
    );
  }

  getById(id: number): Observable<Job> {
    if (environment.useMockData) {
      const job = MOCK_JOBS.find(j => j.jobId === id);
      return of(job!).pipe(delay(300));
    }
    return this.http.get<ApiResponse<Job> | Job>(API_ENDPOINTS.JOBS.BY_ID(id)).pipe(
      map(r => this.unwrap(r) as Job)
    );
  }

  create(request: CreateJobRequest): Observable<Job> {
    if (environment.useMockData) {
      const newJob: Job = { ...request, jobId: Date.now(), status: 'ACTIVE', postedDate: new Date().toISOString() };
      return of(newJob).pipe(delay(600));
    }
    return this.http.post<ApiResponse<Job> | Job>(API_ENDPOINTS.JOBS.CREATE, request).pipe(
      map(r => this.unwrap(r) as Job)
    );
  }

  update(id: number, request: Partial<CreateJobRequest>): Observable<Job> {
    if (environment.useMockData) return of({ ...MOCK_JOBS[0], jobId: id }).pipe(delay(400));
    return this.http.put<ApiResponse<Job> | Job>(API_ENDPOINTS.JOBS.UPDATE(id), request).pipe(
      map(r => this.unwrap(r) as Job)
    );
  }

  delete(id: number): Observable<void> {
    if (environment.useMockData) return of(undefined).pipe(delay(300));
    return this.http.delete<void>(API_ENDPOINTS.JOBS.DELETE(id));
  }
}
