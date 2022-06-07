import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { StatsService } from 'app/services/stats';
import { TranslationService } from 'app/services/translation';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private statsService : StatsService, public ts: TranslationService) { }

  chart: any;
  graphGenerated : boolean = false;
  netErrors : number = 0;

  ngOnInit() {

    this.statsService.getSynthesisData().subscribe((data) => {

      let labelArray = [];
      let dataArray = [];

      for (const key of Object.keys(data)) {
        this.netErrors += data[key];
        if(data[key] > 0) {
          labelArray.push(key);
          dataArray.push(data[key]);
        }
      }

      this.generateChart(labelArray, dataArray);
    });

     
  }

  generateChart(labelArray: any, dataArray: any) {
    this.graphGenerated = true;
    this.chart = new Chart('canvas', {  
      type: 'doughnut',  
      data: {  
        labels: labelArray,  
        datasets: [  
          {  
            data: dataArray,   
            backgroundColor: [  
              "#003f5c",
              "#2f4b7c",  
              "#665191",  
              "#a05195",  
              "#d45087",  
              "#f95d6a",  
              "#ff7c43",  
              "#ffa600", 
            ],  
            fill: true  
          }  
        ]  
      },  
      options: {  
        legend: {  
          display: true  
        },  
        scales: {  
          xAxes: [{  
            display: false  
          }],  
          yAxes: [{  
            display: false  
          }],  
        }  
      },
      responsive: true,
      maintainAspectRatio: false
    } as any); // TODO don't use any
  }

}
