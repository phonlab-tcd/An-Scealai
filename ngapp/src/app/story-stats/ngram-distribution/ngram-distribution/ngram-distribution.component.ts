import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { map } from 'lodash';

const LIGHT_BLUE = 'rgba(54, 162, 235, 0.2)';
const BLUE = 'rgba(54, 162, 235, 1)';

@Component({
  selector: 'app-ngram-distribution',
  templateUrl: './ngram-distribution.component.html',
  styleUrls: ['./ngram-distribution.component.scss']
})
export class NgramDistributionComponent implements OnInit {

  constructor() { }

  X_DATA = [1, 2, 3, 4, 5];
  Y_DATA = [5, 4, 3, 2, 1];

  ngOnInit(): void {
    const canvasElem = document.getElementById('ngram-chart') as HTMLCanvasElement;
    const ctx = canvasElem.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: this.X_DATA,
            datasets: [{
                label: '# of times X happened',
                data: this.Y_DATA,
                backgroundColor: this.Y_DATA.map(_ => LIGHT_BLUE),
                borderColor: this.Y_DATA.map(_ => BLUE),
                borderWidth: 1
            }]
        },
        options: {
          scales: {
            yAxes: [{
                display: true,
                stacked: true,
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }]
          }
        }
    });
  }
}
