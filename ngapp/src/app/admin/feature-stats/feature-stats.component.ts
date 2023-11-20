import { Component, OnInit } from "@angular/core";
import { StatsService } from "app/core/services/stats.service";
import { UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { TranslationService } from "app/core/services/translation.service";
import { EngagementService } from "app/core/services/engagement.service";
import { EventType } from "../../core/models/event";
import { KeyValue } from "@angular/common";
import { Event } from "app/core/models/event";

@Component({
  selector: "app-feature-stats",
  templateUrl: "./feature-stats.component.html",
  styleUrls: ["./feature-stats.component.scss"],
})
export class FeatureStatsComponent implements OnInit {
  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });

  previousFeatures: Event[] = [];
  selectDateRange: boolean = true;
  dataLoaded: boolean = true;
  featureCounts: Object = {};

  constructor(
    private statsService: StatsService,
    public ts: TranslationService,
    private engagement: EngagementService
  ) {}

  /* See if previous feature data logs are stored in the database */
  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("FEATURE-STATS").subscribe((res: Event[]) => {
      this.previousFeatures = res;
    });
  }

  /* Sort feature counts in descending order by total count */
  valueOrder = ( a: KeyValue<number, number>, b: KeyValue<number, number> ): number => {
    return a.value > b.value ? -1 : b.value > a.value ? 1 : 0;
  };

  /*
   * Get all events from the engagement collection in the DB that occured in the date range specified
   * If no date range specified, get all events in the DB
   */
  async getFeatureData() {
    this.dataLoaded = false;
    const startDate = this.range.get("start")?.value ? this.range.get("start").value : "empty";
    const endDate = this.range.get("end")?.value ? this.range.get("end").value : "empty";

    return new Promise<void>((resolve, reject) => {
      this.statsService.getFeatureDataByDate(startDate, endDate).subscribe({
        next: (res) => {
          this.featureCounts = res;
          this.dataLoaded = true;
          resolve();
        },
        error: () => {
          reject();
        },
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
    if (this.previousFeatures.length > 0) {
      const mostRecentLog =
        this.previousFeatures[this.previousFeatures.length - 1];

      new Promise<void>((resolve, reject) => {
        this.statsService.getFeatureDataSinceLog(mostRecentLog.updatedAt).subscribe({
            next: (res) => {
              let newCounts = res;

              if (Object.keys(newCounts).length != 0) {
                const prevStatsData: any = mostRecentLog.data!;
                Object.entries(prevStatsData.statsData).forEach(
                  ([key, value]) => {
                    if (newCounts[key]) newCounts[key] = value + newCounts[key];
                    else newCounts[key] = value;
                  }
                );
                this.engagement.addEvent(EventType["FEATURE-STATS"], {
                  statsData: newCounts,
                });
              }
              resolve();
            },
            error: (error) => {
              reject(error);
            },
          });
      });
    }
    // previous feature log does not exist
    else {
      await this.getFeatureData();
      this.engagement.addEvent(EventType["FEATURE-STATS"], {
        statsData: this.featureCounts,
      });
    }
    this.ngOnInit();
  }

  displayLog(log) {
    this.featureCounts = log.statsData;
  }
}
