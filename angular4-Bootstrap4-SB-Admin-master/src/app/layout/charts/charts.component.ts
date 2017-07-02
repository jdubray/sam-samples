import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { State } from '../../state/state';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {

    constructor(public _state: State) {

        this._state.subscribe('dashboard.chartData' , (data) => { this.bind(data) } )
    }

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [];
    // Doughnut
    public doughnutChartLabels: string[] = [];
    public doughnutChartData: number[] = [];
    public doughnutChartType: string = 'doughnut';
    // Radar
    public radarChartLabels: string[] = [];
    public radarChartData: any = [];
    public radarChartType: string = 'radar';
    // Pie
    public pieChartLabels: string[] = [];
    public pieChartData: number[] = [];
    public pieChartType: string = 'pie';
    // PolarArea
    public polarAreaChartLabels: string[] = [];
    public polarAreaChartData: number[] = [];
    public polarAreaLegend: boolean = true;

    public polarAreaChartType: string = 'polarArea';
    // lineChart
    public lineChartData: Array<any> =  [];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40
        ];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

    public bind(stateRepresentation: any) {
        
        let data = stateRepresentation.dataProvider ;

        if (data) {

           
            if (data.barChartData) {
                this.barChartData = data.barChartData;
            }

            if (data.doughnutChartData) {
                this.doughnutChartData = data.doughnutChartData;
            }

            if (data.radarChartData) {
                this.radarChartData = data.radarChartData;
            }

            if (data.polarAreaChartData) {
                this.polarAreaChartData = data.polarAreaChartData;
            }

            if (data.barChartLabels) {
                this.barChartLabels = data.barChartLabels;
            }

            if (data.radarChartLabels) {
                this.radarChartLabels = data.radarChartLabels;
            }

            if (data.doughnutChartLabels) {
                this.doughnutChartLabels = data.doughnutChartLabels;
            }

            if (data.polarAreaChartLabels) {
                this.polarAreaChartLabels = data.polarAreaChartLabels;
            }

            if (data.lineChartData) {
                this.lineChartData = data.lineChartData;
            }

            if (data.lineChartLabels) {
                this.lineChartLabels = data.lineChartLabels;
            }

            if (data.pieChartData) {
                this.pieChartData = data.pieChartData;
            }

            if (data.pieChartLabels) {
                this.pieChartLabels = data.pieChartLabels;
            }
        }
    }

    
    ngOnInit() {
        // There at least three ways the component could be initialized

        // 1/ The state representation could be ready, but that's an optimization
        //this.bind(this._state.stateRepresentation("dashboard.charts")) ;

        // But we recommend triggering an "init" action which will update the the component's properties
        
        // 2/ These actions could be statically defined in the Actions class
        //this._state.actions().chartsInit({}) ;

        // 3/ Or they can be dispatched to the chart.actions module
        this._state.actions().dispatch({__event: 'charts.initCharts', chartService: this._state.getService('Chart')})
    }
}
