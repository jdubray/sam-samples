import {Component, ViewEncapsulation} from '@angular/core';

import {CalendarService} from '../../../services/calendar.service';

import {State} from "../../../state/state";

@Component({
  selector: 'calendar',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./calendar.scss')],
  template: require('./calendar.html')
})
export class Calendar {

  public calendarConfiguration:any;
  private _calendar:Object;

  constructor(private _calendarService:CalendarService, private _state:State) {
    this.calendarConfiguration = this._calendarService.getData();
    this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);

    this._state.subscribe('dashboard.calendar', (calendar) => {
        this._calendar = calendar;
    }); 
  }

  public onCalendarReady(calendar):void {
    //this._calendar = calendar;
  }

  private _onSelect(start, end):void {

    if (this._calendar != null) {
      let title = prompt('Event Title:');
      let eventData;
      if (title) {
        eventData = {
          title: title,
          start: start,
          end: end
        };
        jQuery(this._calendar).fullCalendar('renderEvent', eventData, true);
      }
      jQuery(this._calendar).fullCalendar('unselect');
    }
  }
}
