import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import  { Observable } from 'rxjs';

export interface Schedule {
  id: string;
  displayName: string;
}

export interface ScheduleDetail {
  id: string;
  displayName: string;
  start: string;
  end: string;
  teachers: Teacher[];
  groups: Group[];
  locations: Location[];  
}

export interface Teacher {
  id: string;
  displayName: string;
}

export interface Group {
  id: string;
  displayName: string;  
}

export interface Location {
  id: string;
  displayName: string;    
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://dev-backend.royalschedule.com/schedules'

  constructor(private http: HttpClient) { }

  getData<T>(apiUrl: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(apiUrl, { params });
  }

  getSchedules(): Observable<Schedule[]> {
    return this.getData<Schedule[]>(this.baseUrl);
  }

  getScheduleDetails(scheduleId: string): Observable<ScheduleDetail> {
    return this.getData<ScheduleDetail>(`${this.baseUrl}/${scheduleId}`);
  }

}
