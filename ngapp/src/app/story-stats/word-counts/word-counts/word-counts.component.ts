import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { TranslationService } from '../../../translation.service';
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

  @Input() wordCountData: Object;
  wordCountChart: Chart;

  constructor(private ts: TranslationService) { }

  ngOnInit() {
    this.loadWordChart();
  }
  
  ngOnChanges(_) {
    this.loadWordChart();
  }
  
  private loadWordChart() {    
    if (this.wordCountChart) { this.wordCountChart.destroy(); }
    if (!this.wordCountData) return;
    
    let canvasElem = document.getElementById('word-count-chart') as HTMLCanvasElement;
    let ctx = canvasElem.getContext('2d');
    this.wordCountChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(this.wordCountData),
            datasets: [{
                label: this.ts.l.average_word_counts,
                data: Object.values(this.wordCountData),
                backgroundColor: Object.values(this.wordCountData).map(_ => LIGHT_RED),
                borderColor: Object.values(this.wordCountData).map(_ => RED),
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
          },
          responsive: true
        }
    });
  }
  
}
