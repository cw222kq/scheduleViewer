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

  protected readonly selectedTeacherId = signal<string | null>(null);
  protected readonly selectedGroupId = signal<string | null>(null);
  protected readonly selectedLocationId = signal<string | null>(null);

  constructor(private dataService: DataService) {
    effect(() => {
      const scheduleId = this.selectedSchedule();
      const filterType = this.selectedFilterType();

      let filterId: string | null = null;

      switch (filterType) {
        case 'teacher':
          filterId = this.selectedTeacherId();
          break;
        case 'group':
          filterId = this.selectedGroupId();
          break;
        case 'location':
          filterId = this.selectedLocationId();
          break;
        default:
          filterId = null;
          break;
      }

      console.log('Effect triggered with values:', {
        scheduleId,
        filterType,
        filterId,
      });

      if (scheduleId && filterType && filterId) {
        this.fetchCalendarEvents(scheduleId, filterType, filterId);
      }
      else { 
        this.events.set([]);
      }
    });
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
    console.log('Mondays:', mondays);
    return mondays;
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
      .getCalendarEvents(scheduleId, filterType, filterId)
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

    this.selectedFilterType.set(null);
    this.selectedTeacherId.set(null);
    this.selectedGroupId.set(null);
    this.selectedLocationId.set(null);
  }

  onFilterTypeChange(
    filterType: 'teacher' | 'group' | 'location' | null
  ): void {
    console.log('Selected filter type:', filterType);
    this.selectedFilterType.set(filterType);

    if (filterType !== 'teacher') { 
      this.selectedTeacherId.set(null);
    }
    if (filterType !== 'group') {
      this.selectedGroupId.set(null);
    }
    if (filterType !== 'location') {
      this.selectedLocationId.set(null);
    }
  }

   onTeacherFilterIdChange(filterId: string | null): void {
    console.log('Selected teacher ID:', filterId);
    this.selectedTeacherId.set(filterId);
  }

  onGroupFilterIdChange(filterId: string | null): void {
    console.log('Selected group ID:', filterId);
    this.selectedGroupId.set(filterId);
  }

  onLocationFilterIdChange(filterId: string | null): void {
    console.log('Selected location ID:', filterId);
    this.selectedLocationId.set(filterId);
  }

}
