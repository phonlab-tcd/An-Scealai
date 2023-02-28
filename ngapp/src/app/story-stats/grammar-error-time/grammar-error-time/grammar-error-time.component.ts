import { Component, OnInit, Input } from '@angular/core';
import { Chart } from "chart.js";
import { TranslationService } from '../../../translation.service';
import { ERROR_INFO} from '../../../lib/grammar-engine/types';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-grammar-error-time',
  templateUrl: './grammar-error-time.component.html',
  styleUrls: ['./grammar-error-time.component.scss']
})
export class GrammarErrorTimeComponent implements OnInit {

  constructor(private ts: TranslationService) { }
  
  @Input() grammarErrorTimeCounts: Object[];
  chart: Chart;
  legendItems: any[] = [];
  dates: string[] = [];

  async ngOnInit() {
    this.calculateDateArray()
    this.createDateArray({});
  }

  /**
   * Create an array of dates for today - 30 days
   */
  calculateDateArray() {
    const NUM_OF_DAYS = 30; // get last 30 dates.
    
    for (let i = 0; i < NUM_OF_DAYS; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      this.dates.push(date.toISOString().split('T')[0]);
    }
  }
  
  ngOnChanges(_) {
    if(this.grammarErrorTimeCounts) {
      this.makeCharts();
    }
  }
  
  // create a time series chart for a student's grammar erros
  private async makeCharts() {
    if (this.chart) { this.chart.destroy(); }
    let labels = new Set<Date>();
    let datasets = [];

    // loop through each error and create data structures for chart
    for(let entry of this.grammarErrorTimeCounts) {
      for (let [key, value] of Object.entries(entry)) { // one dataset for each error type
        Object.keys(value).forEach((item) => labels.add(new Date(item))); // loop through each timestamp
        let dict = {
          label: this.ts.currentLanguage? ERROR_INFO[key].nameGA : ERROR_INFO[key].nameEN , // Error name
          data: this.createDateArray(value),  // {timestamp: count}
          borderColor: ERROR_INFO[key].color,
          backgroundColor: ERROR_INFO[key].color,
          fill: false,
        };
        datasets.push(dict);
      }
    }

    // if (this.chart) { this.chart.destroy(); } 

    let canvasElem = document.getElementById("grammar-errors-time-chart") as HTMLCanvasElement;
    let ctx = canvasElem.getContext("2d");
    console.log(datasets)
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: datasets,
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'left',
          },
        },
        scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  stepSize: 1
              }
          },
          x: {
            type: 'time',
            time: {
                unit: 'day'
            }
          }
        },
      }
    });
    
    this.legendItems = this.chart['legend']['legendItems'];
  }

  /**
   * Takes an error with a certain number of dates and counts and padds the object by
   * filling in the gaps where the object doesn't have a particular date
   * i.e. every returned object will have 30 entries for 30 days, no matter the starting size
   * @param error object with dates and error counts
   * @returns an object of dates and error counts for the past 30 days
   */
  createDateArray(error) {
  let finalResult = {};
  this.dates.reverse().forEach(date => {
      // error does not have a count from this date
      if(!error.hasOwnProperty(date)) {
          finalResult[date] = 0;  // can either use null or 0, but 0 makes the graph look messy
      } 
      // error does have a count from this date
      else {
          finalResult[date] = error[date];
      }
  });
  return finalResult;
  }

}
