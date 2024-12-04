import { Component, signal, OnInit, effect } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
    CalendarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  // Signals
  
  protected readonly weeks = signal<string[]>(this.generateMondays(8));
  protected readonly events = signal<CalendarEvent[]>([]);
  protected readonly schedules = signal<Schedule[]>([]);
  protected readonly teachers = signal<Teacher[]>([]);
  protected readonly groups = signal<Group[]>([]);
  protected readonly locations = signal<Location[]>([]);

  protected readonly selectedWeek = signal<string | null>(null);
  protected readonly selectedSchedule = signal<string | null>(null);
  protected readonly selectedFilterType = signal<
    'teacher' | 'group' | 'location' | null
  >(null);

  protected readonly selectedTeacherId = signal<string | null>(null);
  protected readonly selectedGroupId = signal<string | null>(null);
  protected readonly selectedLocationId = signal<string | null>(null);

  constructor(private dataService: DataService, private snackBar: MatSnackBar) {
    effect(() => {
      const scheduleId = this.selectedSchedule();
      const filterType = this.selectedFilterType();

      let filterId: string | null = null;

      // Determine which filterId to use based on filterType
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

      // Fetch events if all required data is available
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
    
    // Set currentMonday to the Monday of the current week
    currentMonday.setDate(today.getDate() - distanceToMonday);
    currentMonday.setHours(0, 0, 0, 0);

    // Generate Mondays for the next numWeeks
    for (let i = 0; i < numWeeks; i++) {
      
      // Calculate the date of the next Monday
      const monday = new Date(currentMonday);
      monday.setDate(currentMonday.getDate() + i * 7);
      
      const year = monday.getFullYear();

      // Add leading zero to month and day if needed
      const month = String(monday.getMonth() + 1).padStart(2, '0');
      const day = String(monday.getDate()).padStart(2, '0');
      
      mondays.push(`${year}-${month}-${day}`);
    }
    return mondays;
  }

  // Fetch schedules from the API
  private fetchSchedules(): void {
    this.dataService.getSchedules().subscribe({
      next: (data) => {
        this.schedules.set(data);
      },
      error: (err) => {
        console.error('Error fetching schedules:', err);
        this.snackBar.open('Error fetching schedules, please try again' + err.message, 'Close', { duration: 5000});
      },
    });
  }

  // Fetch schedule details from the API
  private fetchScheduleDetails(scheduleId: string): void {
    this.dataService.getScheduleDetails(scheduleId).subscribe({
      next: (data) => {
        this.teachers.set(data.teachers);
        this.groups.set(data.groups);
        this.locations.set(data.locations);
      },
      error: (err) => {
        console.error('Error fetching schedules details:', err);
        this.snackBar.open('Error fetching schedules details, please try again' + err.message, 'Close', { duration: 5000 });
      },
    });
  }

  // Fetch calendar events from the API
  private fetchCalendarEvents(
    scheduleId: string,
    filterType: 'teacher' | 'group' | 'location',
    filterId: string
  ): void {
    this.dataService
      .getCalendarEvents(scheduleId, filterType, filterId)
      .subscribe({
        next: (data: ApiCalendarEvent[]) => {
          const mappedEvents: CalendarEvent[] = data.map((event) => ({
            title: event.course?.displayName || event.type?.toString() || '',
            start: event.start,
            end: event.end,
            color: event.color,
          }));
          this.events.set(mappedEvents);
        },
        error: (err) => {
          console.error('Error fetching calendarEvents:', err);
          this.snackBar.open('Error fetching schedule events, please try again' + err.message, 'Close', { duration: 5000 });
        },
      });
  }

  // Event handlers
  
  onScheduleChange(scheduleId: string): void {
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
    this.selectedTeacherId.set(filterId);
  }

  onGroupFilterIdChange(filterId: string | null): void {
    this.selectedGroupId.set(filterId);
  }

  onLocationFilterIdChange(filterId: string | null): void {
    this.selectedLocationId.set(filterId);
  }

}
