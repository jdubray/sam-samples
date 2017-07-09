import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {
    getData() {
        return {
            dataProvider: {
                barChartData: [
                    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
                ],
                barChartLabels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
                // Doughnut
                doughnutChartLabels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
                doughnutChartData: [350, 450, 100],
                doughnutChartType: 'doughnut',
                // Radar
                radarChartLabels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
                radarChartData: [
                    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
                    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
                ],

                pieChartLabels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
                pieChartData: [300, 500, 100],

                polarAreaChartLabels: ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'],
                polarAreaChartData: [300, 500, 100, 40, 120],

                lineChartData: [
                    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
                    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
                ],
                lineChartLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            },
            // bar chart
            barChartOptions: {
                scaleShowVerticalLines: false,
                responsive: true
            },
            barChartType: 'bar',
            barChartLegend: true,

            // radar
            radarChartType: 'radar',
            // Pie
            pieChartType: 'pie',

            // PolarArea

            polarAreaLegend: true,

            polarAreaChartType: 'polarArea',

            // lineChart

            lineChartOptions: {
                responsive: true
            },
            lineChartColors: [
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
            ],
            lineChartLegend: true,
            lineChartType: 'line'
        }
    }
}
