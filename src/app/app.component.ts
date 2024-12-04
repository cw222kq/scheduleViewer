import { Component, signal, OnInit, effect } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import {
  CalendarComponent,
  CalendarEvent,
} from './calendar/calendar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DataService,
  Schedule,
  Teacher,
  Group,
  Location,
  CalendarEvent as ApiCalendarEvent,
} from './data.service';

const dummyWeeks: string[] = [
  '2024-11-18',
  '2024-11-25',
  '2024-12-02', // Add each monday of the week
]; // TODO: Modify the dates in the browser to be in the correct format

const dummyEvents: CalendarEvent[] = [
  {
    title: 'Event 1',
    start: '2024-11-18T09:00:00',
    end: '2024-11-18T10:00:00',
    color: 'red',
  },
  {
    title: 'Event 2',
    start: '2024-11-21T14:00:00',
    end: '2024-11-21T14:15:00',
    color: 'blue',
  },
  {
    title: 'Event 3',
    start: '2024-11-26T10:00:00',
    end: '2024-11-26T11:00:00',
    color: 'green',
  },
  {
    title: 'Event 4',
    start: '2024-11-28T16:00:00',
    end: '2024-11-28T17:30:00',
    color: 'yellow',
  },
  {
    title: 'Event 5',
    start: '2024-12-03T12:00:00',
    end: '2024-12-03T15:00:00',
    color: 'purple',
  },
];

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    CalendarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // some dummy calendar data
  protected readonly weeks = signal<string[]>(dummyWeeks);
  protected readonly events = signal<CalendarEvent[]>(dummyEvents);
  protected readonly schedules = signal<Schedule[]>([]);
  protected readonly teachers = signal<Teacher[]>([]);
  protected readonly groups = signal<Group[]>([]);
  protected readonly locations = signal<Location[]>([]);

  // the selected week
  protected readonly selectedWeek = signal<string | null>(null);
  protected readonly selectedSchedule = signal<string | null>(null);
  protected readonly selectedFilterType = signal<
    'teacher' | 'group' | 'location' | null
  >(null);
  protected readonly selectedFilterId = signal<string | null>(null);

  protected readonly apiEvents = signal<ApiCalendarEvent[]>([]);

  constructor(private dataService: DataService) {
    this.setupEffect();
  }

  ngOnInit(): void {
    this.fetchSchedules();
  }

  private setupEffect(): void {
    effect(() => {
      const scheduleId = this.selectedSchedule();
      const filterType = this.selectedFilterType();
      const filterId = this.selectedFilterId();

      console.log('Effect triggered with values:', {
        scheduleId,
        filterType,
        filterId,
      });

      if (scheduleId && filterType === 'teacher' && filterId) {
        this.fetchCalendarEvents(scheduleId, filterType, filterId);
        this.selectedFilterType.set(null);
        this.selectedFilterId.set(null);
      }

      if (scheduleId && filterType === 'group' && filterId) {
        this.fetchCalendarEvents(scheduleId, filterType, filterId);
        this.selectedFilterType.set(null);
        this.selectedFilterId.set(null);
      }

      if (scheduleId && filterType === 'location' && filterId) {
        this.fetchCalendarEvents(scheduleId, filterType, filterId);
        this.selectedFilterType.set(null);
        this.selectedFilterId.set(null);
      }
    });
  }

  private fetchSchedules(): void {
    this.dataService.getSchedules().subscribe({
      next: (data) => {
        console.log('Fetched schedules:', data);
        this.schedules.set(data);
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
      },
    });
  }

  private fetchScheduleDetails(scheduleId: string): void {
    this.dataService.getScheduleDetails(scheduleId).subscribe({
      next: (data) => {
        console.log('Fetched schedules:', data);
        this.teachers.set(data.teachers);
        this.groups.set(data.groups);
        this.locations.set(data.locations);
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
      },
    });
  }

  fetchCalendarEvents(
    scheduleId: string,
    filterType: 'teacher' | 'group' | 'location',
    filterId: string
  ): void {
    this.dataService
      .getCalenderEvents(scheduleId, filterType, filterId)
      .subscribe({
        next: (data) => {
          console.log('Fetched calenderEvents:', data);
        },
        error: (err) => {
          console.error('Error fetching calenderEvents:', err);
        },
      });
  }

  onScheduleChange(scheduleId: string): void {
    console.log('Selected schedule ID:', scheduleId);
    this.selectedSchedule.set(scheduleId);
    this.fetchScheduleDetails(scheduleId);
  }

  onFilterTypeChange(
    filterType: 'teacher' | 'group' | 'location' | null
  ): void {
    console.log('Selected filter type:', filterType);
    this.selectedFilterType.set(filterType);
  }

  onFilterIdChange(filterId: string | null): void {
    console.log('Selected filter ID:', filterId);
    this.selectedFilterId.set(filterId);
  }
}
