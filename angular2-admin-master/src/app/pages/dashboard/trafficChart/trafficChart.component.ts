import {Component, ViewEncapsulation, ElementRef} from '@angular/core';
import {State} from "../../../state/app.state";

import {Chart} from './trafficChart.loader.ts';
import {TrafficChartService} from '../../../services/trafficChart.service';

@Component({
  selector: 'traffic-chart',
  encapsulation: ViewEncapsulation.None,
  providers: [TrafficChartService],
  styles: [require('./trafficChart.scss')],
  template: require('./trafficChart.html')
})

// TODO: move chart.js to it's own component
export class TrafficChart {

  public doughnutData: Array<Object>;

  constructor(private trafficChartService:TrafficChartService, private _state:State) {
    this.doughnutData = trafficChartService.getData();

     this._state.subscribe('dashboard.doughnutData', (doughnutData) => {
        this.doughnutData = doughnutData;
        this._loadDoughnutCharts();
        //this.ref.detectChanges() ;
      }); 
  }

  ngAfterViewInit() {
    //this._loadDoughnutCharts();
  }

  private _loadDoughnutCharts() {
    let el = jQuery('.chart-area').get(0);
    new Chart(el.getContext('2d')).Doughnut(this.doughnutData, {
      segmentShowStroke: false,
      percentageInnerCutout : 64,
      responsive: true
    });
  }
}
