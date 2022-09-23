import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Chart } from 'chart.js';

const LIGHT_RED = 'rgba(255, 204, 203, 1)';
const RED = 'rgba(255, 114, 111, 1)';


@Component({
  selector: 'app-word-counts',
  templateUrl: './word-counts.component.html',
  encapsulation: ViewEncapsulation.None, // to override the bootstrap image carousel css
  styleUrls: ['./word-counts.component.scss']
})

export class WordCountsComponent implements OnInit {
  
  @Input() data:any;

  constructor() { }
  
  charts:any[] = [];

  async ngOnInit() {
    console.log(this.data);
    await this.makeCharts();
  }
  
  private async makeCharts() {
    // wait for HTML to render before adding charts (need dynamically created ids)
    setTimeout(() => {
      for (let entry in this.data) {
        let canvasElem = document.getElementById(this.data[entry].chartId) as HTMLCanvasElement;
        let ctx = canvasElem.getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data[entry].studentNames,
                datasets: [{
                    label: 'Average Word Counts For ' + this.data[entry].classroomTitle,
                    data: this.data[entry].averageWordCounts,
                    backgroundColor: this.data[entry].averageWordCounts.map(_ => LIGHT_RED),
                    borderColor: this.data[entry].averageWordCounts.map(_ => RED),
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
                        stepSize: 40
                    }
                }]
              }
            }
        });
      }
    }, 1)
  }
  
}
