import {Component, ViewEncapsulation} from '@angular/core';

declare var actionsMount: any;

@Component({
  selector: 'dashboard',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./dashboard.scss')],
  template: require('./dashboard.html')
})
export class Dashboard {

  constructor() {
  }

  ngOnInit() {
      actionsMount.actions.compose(
        [
          {__event: 'feedNeedsRefresh'}, 
          {__event: 'chartNeedsRefresh'},
          {__event: 'piechartNeedsRefresh'},
          {__event: 'trafficchartNeedsRefresh'},
          {__event: 'calendarNeedsRefresh'},
          {__event: 'todoNeedsRefresh'},
          {__event: 'usersMapNeedsRefresh'}
        ]) ;
  }
}
