import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface ApiCalendarEvent {
  id: string;
  type?: 'LUNCH';
  course?: {
    displayName: string;
  };
  teachers: {
    to: Teacher;
  }[];
  groups: {
    to: Group;
  }[];
  inLocations: Location[];
  start: string;
  end: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'https://dev-backend.royalschedule.com/schedules';

  constructor(private http: HttpClient) {}

  getData<T>(apiUrl: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(apiUrl, { params });
  }

  getSchedules(): Observable<Schedule[]> {
    return this.getData<Schedule[]>(this.baseUrl);
  }

  getScheduleDetails(scheduleId: string): Observable<ScheduleDetail> {
    return this.getData<ScheduleDetail>(`${this.baseUrl}/${scheduleId}`);
  }

  getCalendarEvents(
    scheduleId: string,
    filterType: 'teacher' | 'group' | 'location',
    filterId: string
  ): Observable<ApiCalendarEvent[]> {
    const url = `${this.baseUrl}/${scheduleId}/calendar_events`;
    let params = new HttpParams();

    if (filterType && filterId) {
      if (filterType === 'teacher') {
        params = params.set('teachers', filterId);
      } else if (filterType === 'group') {
        params = params.set('groups', filterId);
      } else if (filterType === 'location') {
        params = params.set('inLocations', filterId);
      }
    }
    return this.getData<ApiCalendarEvent[]>(url, params);
  }
}
