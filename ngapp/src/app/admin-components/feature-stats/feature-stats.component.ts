import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslationService } from '../../translation.service';
import { EngagementService } from '../../engagement.service';
import { EventType } from '../../event';

@Component({
  selector: 'app-feature-stats',
  templateUrl: './feature-stats.component.html',
  styleUrls: ['./feature-stats.component.css']
})
export class FeatureStatsComponent implements OnInit {
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  features: any[] = [];
  previousFeatures: any[] = [];
  featureToDisplay: any;
  displayAllFeatures: boolean = false;
  displaySelectedFeature: boolean = false;
  selectDateRange: boolean = true;
  dataLoaded: boolean = true;
  
  //hold total counts for unique entry types
  totalFeatureCounts = {};


  constructor(private statsService : StatsService, public ts: TranslationService, private engagement: EngagementService) { }

  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("FEATURE-STATS").subscribe( (res) => {
      this.previousFeatures = res;
      console.log(this.previousFeatures);
    });
  }
  
  async getFeatureData() {
    this.dataLoaded = false;
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "empty";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "empty";
    
    return new Promise( (resolve, reject) => {
      this.statsService.getFeatureDataByDate(startDate, endDate).subscribe( async (res) => {
        this.features = res;
        await this.calculateStats();
        this.dataLoaded = true;
        resolve();
      });
    }); 
  }
  
  async calculateStats() {
    let types = [];
    this.features.forEach(feature => {
      if(feature.type){
        types.push(feature.type)
      }
    });
    this.totalFeatureCounts = this.getTotals(types);
    console.log(this.totalFeatureCounts);
    return;
  }
  
  getTotals(array): Object {
    let count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
  }
  
  async addNewFeatureData() {
    let feature = {};
    this.displayAllFeatures = false;
    
    if(this.previousFeatures.length > 0) {
      console.log("Previous feature data exists in DB");
      let mostRecentLog = this.previousFeatures[this.previousFeatures.length-1];
      console.log("Last log: ", mostRecentLog.statsData);
      
      new Promise( (resolve, reject) => {
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
          this.featureToDisplay = feature;
          this.displaySelectedFeature = true;
          resolve();
        });
      }); 
    }
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
        "RECORD-STORY": this.totalFeatureCounts["RECORD-STORY"]
      }
      console.log(feature);
      this.engagement.addAnalysisEvent(EventType["FEATURE-STATS"], feature);
      this.featureToDisplay = feature;
      this.displaySelectedFeature = true;
    }
  }
  
  setFeatureToDisplay(feature) {
    this.featureToDisplay = feature.statsData;
  }

}
