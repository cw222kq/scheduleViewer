import { Component, effect, input, viewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import enGbLocale from '@fullcalendar/core/locales/en-gb'; 

export type CalendarEvent = {
  title:  string;
  start:  string;
  end:    string;
  color?: string;
};

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  // access the full calendar component
  private readonly _fullCalendar = viewChild(FullCalendarComponent);

  // input parameters to be passed using the component's selector
  public readonly initialDate = input.required<string | null>();
  public readonly events      = input.required<CalendarEvent[]>();

  // static calendar options
  protected readonly calendarOptions: CalendarOptions = {
    // the calendar view to be used
    plugins: [ timeGridPlugin ],
    initialView: 'timeGridWeek',
    locale: enGbLocale,

    // some customizations
    headerToolbar: false,
    allDaySlot: false,
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },

    // monday is the first day of the week
    firstDay: 1,

    // hide saturday and sunday
    hiddenDays: [0, 6],

    // what timezone to display the calendar in, for example 'local' or 'UTC'
    timeZone: 'local'
  };

  constructor () {
    // update the calendar's chosen week
    effect(() => {
      const initialDate = this.initialDate();
      if ( ! initialDate) return;
      this._fullCalendar()?.getApi().gotoDate(initialDate);
    });
  }
}