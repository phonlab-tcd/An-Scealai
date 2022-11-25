import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslationService } from '../../translation.service';
import { EngagementService } from '../../engagement.service';
import { EventType } from '../../event';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-feature-stats',
  templateUrl: './feature-stats.component.html',
  styleUrls: ['./feature-stats.component.scss']
})
export class FeatureStatsComponent implements OnInit {
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  previousFeatures: any[] = [];
  selectDateRange: boolean = true;
  dataLoaded: boolean = true;
  featureCounts:Object = {};

  constructor(private statsService : StatsService, public ts: TranslationService, private engagement: EngagementService) { }

  /* See if previous feature data logs are stored in the database */
  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("FEATURE-STATS").subscribe( (res) => {
      this.previousFeatures = res.sort((a, b) => b.date - a.date);
    });
  }
  
  /* Sort feature counts in descending order */
  valueOrder = (a: KeyValue<number,number>, b: KeyValue<number,number>): number => {
    return a.value > b.value ? -1 : (b.value > a.value ? 1 : 0);
  }
  
  /*
  * Get all events from the engagement collection in the DB that occured in the date range specified
  * If no date range specified, get all events in the DB
  */
  async getFeatureData() {
    this.dataLoaded = false;
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "empty";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "empty";

    return new Promise<void>( (resolve, reject) => {
      this.statsService.getFeatureDataByDate(startDate, endDate).subscribe( async (res:Object) => {
        this.featureCounts = res;
        this.dataLoaded = true;
        resolve();
      });
    }); 
  }
  
  // Create a log of total feature data from a certain period of time
  // and save it to the engagement collection of the DB 
  // If no log yet exists, the first one is made of all feature data available.
  // If a previous log does exist,
  // the new data is calculated up from the previous log
  // to speed up calculations
  async addNewFeatureData() {
  
    // previous feature log exists
    if(this.previousFeatures.length > 0) {
      let mostRecentLog = this.previousFeatures[this.previousFeatures.length-1];
  
      new Promise<void>( (resolve, reject) => {
        this.statsService.getFeatureDataSinceLog(mostRecentLog.date).subscribe( async (res) => {
          let newCounts = res;

          if(Object.keys(newCounts).length != 0 ) {
            Object.entries(mostRecentLog.statsData).forEach(([key, value]) => {
              if(newCounts[key])
                newCounts[key] = value + newCounts[key];
              else 
                newCounts[key] = value
            });
            this.engagement.addAnalysisEvent(EventType["FEATURE-STATS"], newCounts);
          }
          resolve();
        });
      }); 
    }
    // previous feature log does not exist
    else {
      await this.getFeatureData();
      this.engagement.addAnalysisEvent(EventType["FEATURE-STATS"], this.featureCounts);
    }
    this.ngOnInit();
  }
  
  displayLog(log) {
    this.featureCounts = log;
  }
  
}
