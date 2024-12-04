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
  ApiCalendarEvent,
} from './data.service';


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
  protected readonly weeks = signal<string[]>(this.generateMondays(8));
  protected readonly events = signal<CalendarEvent[]>([]);
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

  constructor(private dataService: DataService) {
    this.setupEffect();
  }

  ngOnInit(): void {
    this.fetchSchedules();
  }

  private generateMondays(numWeeks: number): string[] {
    const mondays: string[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - distanceToMonday);
    currentMonday.setHours(0, 0, 0, 0);

    for (let i = 0; i < numWeeks; i++) {
      const monday = new Date(currentMonday);
      monday.setDate(currentMonday.getDate() + i * 7);
      const yyyy = monday.getFullYear();
      const mm = String(monday.getMonth() + 1).padStart(2, '0');
      const dd = String(monday.getDate()).padStart(2, '0');
      mondays.push(`${yyyy}-${mm}-${dd}`);
    }
    console.log ('Mondays:', mondays);
    return mondays
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

      if (scheduleId && filterType && filterId) {
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
        next: (data: ApiCalendarEvent[]) => {
          console.log('Fetched calenderEvents:', data);
          const mappedEvents: CalendarEvent[] = data.map((event) => ({
            title: event.course?.displayName || event.type?.toString() || '',
            start: event.start,
            end: event.end,
            color: event.color,
          }));
          this.events.set(mappedEvents);
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
