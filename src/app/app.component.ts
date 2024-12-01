import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CalendarComponent, CalendarEvent } from './calendar/calendar.component';
import { MatFormFieldModule } from '@angular/material/form-field';

const dummyWeeks: string[] = [
  '2024-11-18', '2024-11-25', '2024-12-02'
];

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
export class AppComponent {
  // some dummy calendar data
  protected readonly weeks  = signal<string[]>(dummyWeeks);
  protected readonly events = signal<CalendarEvent[]>(dummyEvents);

  // the selected week
  protected readonly selectedWeek = signal<string | null>(null);
}
