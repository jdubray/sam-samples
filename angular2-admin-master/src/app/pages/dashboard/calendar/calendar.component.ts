import {Component, ViewEncapsulation} from '@angular/core';
import {State} from "../../../state/app.state";

import {BaFullCalendar} from '../../../theme/components';
import {CalendarService} from '../../../services/calendar.service';

@Component({
  selector: 'calendar',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./calendar.scss')],
  template: require('./calendar.html'),
  directives: [BaFullCalendar],
  providers: [CalendarService]
})
export class Calendar {

  public calendarConfiguration:any;
  private _calendar:Object;

  constructor(private _calendarService:CalendarService, private _state:State) {
    this.calendarConfiguration = this._calendarService.getData();
    this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);

    this._state.subscribe('dashboard.calendar', (calendar) => {
        this._calendar = calendar;
        //this.ref.detectChanges() ;
      });  
  }

  public onCalendarReady(calendar):void {
    //this._calendar = calendar;
  }

  private _onSelect(start, end):void {

    if (this._calendar != null) {
      var title = prompt('Event Title:');
      var eventData;
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
