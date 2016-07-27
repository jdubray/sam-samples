import {Component, ViewEncapsulation} from '@angular/core';

import {PopularApp} from './popularApp';
import {PieChart} from './pieChart';
import {TrafficChart} from './trafficChart';
import {UsersMap} from './usersMap';
import {LineChart} from './lineChart';
import {Feed} from './feed';
import {Todo} from './todo';
import {Calendar} from './calendar';
import {BaCard} from '../../theme/components';

declare var actionsMount: any;

@Component({
  selector: 'dashboard',
  pipes: [],
  directives: [PopularApp, PieChart, TrafficChart, UsersMap, LineChart, Feed, Todo, Calendar, BaCard],
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
