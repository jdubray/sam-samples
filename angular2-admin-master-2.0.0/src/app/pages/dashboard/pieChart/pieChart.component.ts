import {Component, ViewEncapsulation} from '@angular/core';

import {PieChartService} from '../../../services/pieChart.service';

import '../../../services/pieChart.loader.ts';

import {State} from "../../../state/state";

@Component({
  selector: 'pie-chart',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./pieChart.scss')],
  template: require('./pieChart.html')
})
// TODO: move easypiechart to component
export class PieChart {

  public charts: Array<Object>;
  private _init: boolean = false;

  constructor(private _pieChartService: PieChartService, private _state:State) {
    //this.charts = this._pieChartService.getData();
    //console.log('init pieChart');

    this._state.subscribe('dashboard.piechartData', (charts) => {
        if (charts) { 
          this.charts = charts;
          if (!this._init) {
            this._loadPieCharts();
            this._init = true;
            console.log('init is true');
          }
        }
        this._updatePieCharts();
          
        //this.ref.detectChanges() ;
      }); 
  }

  ngAfterViewInit() {
    // if (!this._init) {
    //   this._loadPieCharts();
    //   this._updatePieCharts();
    //   this._init = true;
    // }
  }

  private _loadPieCharts() {

    jQuery('.chart').each(function () {
      let chart = jQuery(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          jQuery(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: jQuery(this).attr('data-rel'),
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
  }

  private _updatePieCharts() {
    // let getRandomArbitrary = (min, max) => { return Math.random() * (max - min) + min; };

    // jQuery('.pie-charts .chart').each(function(index, chart) {
    //   jQuery(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
    // });
  }
}
