import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { StatsService } from '../../stats.service';
import { TranslationService } from '../../translation.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private statsService : StatsService, public ts: TranslationService) { }

  chart: any;
  statsLoaded : boolean = true;
  netErrors : number = 0;
  selectedStat: string;
  profiles;
  graphGenerated: boolean = false;

  ngOnInit() {
    /*
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
    */
  }
  
  statsSelection(type: string) {
    switch(type) {  
      case "profileSelected": { 
          console.log("profileSelected")
          this.getProfileData();
          break;
       }
       case "grammarSelected": { 
         console.log("grammarSelected")
         break;
      }
    }
  }
  
  async getProfileData() {
    this.statsLoaded = false;
    console.log("getting profile data");
    //this.profiles = await this.statsService.getProfileDataByDate().toPromise();
    this.statsLoaded = true;

    let ages = new Map<string, number>()

    for(let i = 0; i < this.profiles.length; i++) {
      if(ages.get(this.profiles[i]["age"]) >= 0) {
        ages.set(this.profiles[i]["age"], ages.get(this.profiles[i]["age"]) + 1);
      }
      else {
        ages.set(this.profiles[i]["age"], 0);
      }
    }
    console.log(ages.keys());
    console.log(ages.values());
    this.generateChart(Array.from(ages.keys()), Array.from(ages.values()));
    
  }

  generateChart(labelArray, dataArray) {
    console.log("label array: ", labelArray);
    console.log("data array: ", dataArray);
    const canvas = document.getElementById('statChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {  
      type: 'doughnut',  
      data: {  
        labels: labelArray,  
        datasets: [  
          {  
            data: dataArray,   
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
    }); 
    this.graphGenerated = true;
  }


}
