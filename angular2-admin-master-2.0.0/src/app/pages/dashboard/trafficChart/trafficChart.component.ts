import {Component, ViewEncapsulation, ElementRef} from '@angular/core';

import {Chart} from '../../../services/trafficChart.loader.ts';
import {TrafficChartService} from '../../../services/trafficChart.service';

import {State} from "../../../state/state";

@Component({
  selector: 'traffic-chart',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./trafficChart.scss')],
  template: require('./trafficChart.html')
})

// TODO: move chart.js to it's own component
export class TrafficChart {

  public doughnutData: Array<Object>;
  public initialized: boolean = false;

  constructor(private trafficChartService:TrafficChartService, private _state:State) {
    // this.doughnutData = trafficChartService.getData();
    // console.log('TrafficChart',doughnutData);
    // //console.log('TrafficChart', this._state); 
     
    this._state.subscribe('dashboard.doughnutData', (doughnutData) => {
        if (doughnutData) { 
          this.doughnutData = doughnutData; 
          console.log('TrafficChart',doughnutData);
          }
          if (!this.initialized) {
            this._loadDoughnutCharts();
            this.initialized = true;
          }
        //this.ref.detectChanges() ;
    }); 

    
  }

  ngAfterViewInit() {
     this._loadDoughnutCharts();
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
