import {Component, ViewEncapsulation} from '@angular/core';
import {State} from "../../../state/app.state";

import {LineChartService} from '../../../services/lineChart.service';
import {BaAmChart} from '../../../theme/components';

@Component({
  selector: 'line-chart',
  encapsulation: ViewEncapsulation.None,
  providers: [LineChartService],
  directives: [BaAmChart],
  styles: [require('./lineChart.scss')],
  template: require('./lineChart.html')
})
export class LineChart {

  chartData:Object;

  constructor(private _lineChartService:LineChartService, private _state:State) {
    this.chartData = this._lineChartService.getData();

    this._state.subscribe('dashboard.chartData', (chartData) => {
        this.chartData = chartData;
        //this.ref.detectChanges() ;
      });  
  }

  initChart(chart:any) {
    let zoomChart = () => {
      chart.zoomToDates(new Date(2013, 3), new Date(2014, 0));
    };

    chart.addListener('rendered', zoomChart);
    zoomChart();

    if (chart.zoomChart) {
      chart.zoomChart();
    }
  }
}
