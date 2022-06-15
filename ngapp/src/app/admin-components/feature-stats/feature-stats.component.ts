import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslationService } from '../../translation.service';
import { EngagementService } from '../../engagement.service';
import { EventType } from '../../event';

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
  
  features: any[] = [];
  previousFeatures: any[] = [];
  selectDateRange: boolean = true;
  dataLoaded: boolean = true;
  
  // hold total counts for unique feature types
  totalFeatureCounts = {};
  sortedFeatureCounts: any[] = [];

  constructor(private statsService : StatsService, public ts: TranslationService, private engagement: EngagementService) { }

  /* See if previous feature data logs are stored in the database */
  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("FEATURE-STATS").subscribe( (res) => {
      this.previousFeatures = res.sort((a, b) => b.date - a.date);
      //this.previousFeatures = this.previousFeatures.sort((a, b) => b.date - a.date);
    });
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
      this.statsService.getFeatureDataByDate(startDate, endDate).subscribe( async (res) => {
        this.features = res;
        await this.calculateStats();
        this.dataLoaded = true;
        resolve();
      });
    }); 
  }
  
  /*
  * For each feature (event), add the type of event to an array
  * Count the number of times each unique type shows up in the array
  */
  async calculateStats() {
    let types = [];
    this.features.forEach(feature => {
      if(feature.type){
        types.push(feature.type)
      }
    });
    this.totalFeatureCounts = this.getTotals(types);
    console.log(this.totalFeatureCounts);
    await this.sortData(this.totalFeatureCounts);

    return;
  }

  // Return an object containing the counts of
  // how many times the same items show up in an array.
  // ex: [1, 2, 2, 3, 4, 4] => {1:1, 2:2, 3:1, 4:2}
  getTotals(array): Object {
    let count = {};
    if(array)
      array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
  }

  // Create a log of total feature data from a certain period of time
  // and save it to the engagement collection of the DB 
  // If no log yet exists, the first one is made of all feature data available.
  // If a previous log does exist,
  // the new data is calculated up from the previous log
  // to speed up calculations
  async addNewFeatureData() {
    let feature = {};

    // previous feature log exists
    if(this.previousFeatures.length > 0) {
      console.log("Previous feature data exists in DB");
      let mostRecentLog = this.previousFeatures[this.previousFeatures.length-1];
      console.log("Last log: ", mostRecentLog.statsData);

      new Promise<void>( (resolve, reject) => {
        this.statsService.getFeatureDataSinceLog(mostRecentLog.date).subscribe( async (res) => {
          this.features = res;
          await this.calculateStats();

          Object.entries(mostRecentLog.statsData).forEach(([key, value]) => {
            if(this.totalFeatureCounts[key])
              feature[key] = value + this.totalFeatureCounts[key];
            else
              feature[key] = value
          });
    
          console.log("New feature log", feature);
          this.engagement.addAnalysisEvent(EventType["FEATURE-STATS"], feature);
          await this.sortData(feature);
          resolve();
        });
      }); 
    }
    // previous feature log does not exist
    else {
      await this.getFeatureData();
      feature = {
        "SAVE-STORY": this.totalFeatureCounts["SAVE-STORY"],
        "GRAMMAR-CHECK-STORY": this.totalFeatureCounts["GRAMMAR-CHECK-STORY"],
        "CREATE-STORY": this.totalFeatureCounts["CREATE-STORY"],
        "VIEW-FEEDBACK": this.totalFeatureCounts["VIEW-FEEDBACK"],
        "USE-DICTIONARY": this.totalFeatureCounts["USE-DICTIONARY"],
        "LOGIN": this.totalFeatureCounts["LOGIN"],
        "LOGOUT": this.totalFeatureCounts["LOGOUT"],
        "SYNTHESISE-STORY": this.totalFeatureCounts["SYNTHESISE-STORY"],
        "DELETE-STORY": this.totalFeatureCounts["DELETE-STORY"],
        "REGISTER": this.totalFeatureCounts["REGISTER"],
        "CREATE-MESSAGE": this.totalFeatureCounts["CREATE-MESSAGE"],
        "RECORD-STORY": this.totalFeatureCounts["RECORD-STORY"],
        "FEATURE-STATS": this.totalFeatureCounts["FEATURE-STATS"],
        "PROFILE-STATS": this.totalFeatureCounts["PROFILE-STATS"]
      }
      console.log(feature);
      this.engagement.addAnalysisEvent(EventType["FEATURE-STATS"], feature);
      await this.sortData(feature);
    }
    this.ngOnInit();
  }
  
  async sortData(data) {
    this.sortedFeatureCounts = [];
    for (var x in data ) {
        this.sortedFeatureCounts.push([x, data[x]]);
    }

    this.sortedFeatureCounts.sort(function(a, b) {
        return b[1] - a[1];
    });
    console.log(this.sortedFeatureCounts);
  }

}
