import { Component, signal, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CalendarComponent, CalendarEvent } from './calendar/calendar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService, Schedule } from './data.service';

const dummyWeeks: string[] = [
  '2024-11-18', '2024-11-25', '2024-12-02' // Add each monday of the week
]; // TODO: Modify the dates in the browser to be in the correct format

const dummyEvents: CalendarEvent[] = [
  {
    title: 'Event 1',
    start: '2024-11-18T09:00:00',
    end:   '2024-11-18T10:00:00',
    color: 'red'
  },
  {
    title: 'Event 2',
    start: '2024-11-21T14:00:00',
    end:   '2024-11-21T14:15:00',
    color: 'blue'
  },
  {
    title: 'Event 3',
    start: '2024-11-26T10:00:00',
    end:   '2024-11-26T11:00:00',
    color: 'green'
  },
  {
    title: 'Event 4',
    start: '2024-11-28T16:00:00',
    end:   '2024-11-28T17:30:00',
    color: 'yellow'
  },
  {
    title: 'Event 5',
    start: '2024-12-03T12:00:00',
    end:   '2024-12-03T15:00:00',
    color: 'purple'
  }
];

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    CalendarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // some dummy calendar data
  protected readonly weeks  = signal<string[]>(dummyWeeks);
  protected readonly events = signal<CalendarEvent[]>(dummyEvents);
  protected readonly schedules = signal<Schedule[]>([]);

  // the selected week
  protected readonly selectedWeek = signal<string | null>(null);
  protected readonly selectedSchedule = signal<string | null>(null);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  private fetchSchedules(): void {
    this.dataService.getSchedules().subscribe({
      next: (data) => {
        console.log('Fetched schedules:', data);
        this.schedules.set(data);
      }, 
      error: (err) => {
        console.error('Error fetching schedules:', err);
      }
    });
  } 

  onScheduleChange(scheduleId: string): void {
    console.log('Selected schedule ID:', scheduleId);
    this.selectedSchedule.set(scheduleId);
  }
}
