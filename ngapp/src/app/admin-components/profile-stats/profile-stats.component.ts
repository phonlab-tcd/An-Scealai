import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../stats.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslationService } from '../../translation.service';
import { EngagementService } from '../../engagement.service';
import { EventType } from '../../event';


@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.css']
})
export class ProfileStatsComponent implements OnInit {
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  
  previousProfiles: any[] = [];
  profileToDisplay: any = {};
  selectDateRange: boolean = true;
  dataLoaded: boolean = true;
  
  constructor(private statsService : StatsService, public ts: TranslationService, private engagement: EngagementService) { }

  /* 
  * Set array of any profile data logs in the database
  */
  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("PROFILE-STATS").subscribe( (res) => {
      this.previousProfiles = res.sort((a, b) => b.date - a.date);
      console.log("previous profiles: ", this.previousProfiles);
      //this.previousProfiles = this.previousProfiles.sort((a, b) => b.date - a.date);
    });
  }
  
  /*
  * Get all profiles from users that have activated accounts in the date range specified
  * If no date range specified, get profiles from all activated accounts
  */
  async getProfileData() {
    this.dataLoaded = false;
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "empty";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "empty";
    
    return new Promise( (resolve, reject) => {
      this.statsService.getProfileDataByDate(startDate, endDate).subscribe( async (res) => {
        console.log("Profiles returned for given dates: ", res);
        await this.calculateStats(res);
        this.dataLoaded = true;
        resolve();
      });
    }); 
  }
  
  /*
  * For each profile, add the answer to each question in its cooresponding array
  * For each array, count the number of times unique answers appear
  */
  async calculateStats(profiles) {
    let totals = {};
    profiles.forEach( profile => {
      profile = profile[0];
      if (profile !== undefined) {
        if(profile.age) {if (!totals["age"]) totals["age"] = []; totals["age"].push(profile.age);}
        if(profile.country) {if (!totals["country"]) totals["country"] = []; totals["country"].push(profile.country);}
        if(profile.county) {if (!totals["county"]) totals["county"] = []; totals["county"].push(profile.county);}
        if(profile.dialectPreference) {if (!totals["dialectPreference"]) totals["dialectPreference"] = []; totals["dialectPreference"].push(profile.dialectPreference);}
        if(profile.gender) {if (!totals["gender"]) totals["gender"] = []; totals["gender"].push(profile.gender);}
        if(profile.fatherNativeTongue) {if (!totals["fatherNativeTongue"]) totals["fatherNativeTongue"] = []; totals["fatherNativeTongue"].push(profile.fatherNativeTongue);}
        if (profile.irishMedia) {
          if (!totals["irishMedia"]) totals["irishMedia"] = [];
          for(let key in profile.irishMedia) {
            if(profile.irishMedia[key]) totals["irishMedia"].push(key);
          }
        }
        if(profile.howOftenMedia) {if (!totals["howOftenMedia"]) totals["howOftenMedia"] = []; totals["howOftenMedia"].push(profile.howOftenMedia);}
        if (profile.irishReading) {
          if (!totals["irishReading"]) totals["irishReading"] = [];
          for(let key in profile.irishMedia) {
            if(profile.irishReading[key]) totals["irishReading"].push(key);
          }
        }
        if(profile.howOftenReading) {if (!totals["howOftenReading"]) totals["howOftenReading"] = []; totals["howOftenReading"].push(profile.howOftenReading);}
        if (profile.irishWriting) {
          if (!totals["irishWriting"]) totals["irishWriting"] = [];
          for(let key in profile.irishWriting) {
            if(profile.irishWriting[key]) totals["irishWriting"].push(key);
          }
        }
        if(profile.howOftenWriting) {if (!totals["howOftenWriting"]) totals["howOftenWriting"] = []; totals["howOftenWriting"].push(profile.howOftenWriting);}
        if(profile.immersionCourse) {if (!totals["immersionCourse"]) totals["immersionCourse"] = []; totals["immersionCourse"].push(profile.immersionCourse);}
        if(profile.motherNativeTongue) {if (!totals["motherNativeTongue"]) totals["motherNativeTongue"] = []; totals["motherNativeTongue"].push(profile.motherNativeTongue);}
        if(profile.nativeSpeakerStatus) {if (!totals["nativeSpeakerStatus"]) totals["nativeSpeakerStatus"] = []; totals["nativeSpeakerStatus"].push(profile.nativeSpeakerStatus);}
        if(profile.notFromIreland) {if (!totals["notFromIreland"]) totals["notFromIreland"] = []; totals["notFromIreland"].push(profile.notFromIreland);}
        if(profile.otherCountryOfStudy) {if (!totals["otherCountryOfStudy"]) totals["otherCountryOfStudy"] = []; totals["otherCountryOfStudy"].push(profile.otherCountryOfStudy);}
        if(profile.otherLanguageProficiency) {if (!totals["otherLanguageProficiency"]) totals["otherLanguageProficiency"] = []; totals["otherLanguageProficiency"].push(profile.otherLanguageProficiency);}
        if(profile.otherLanguages) {if (!totals["otherLanguages"]) totals["otherLanguages"] = []; totals["otherLanguages"].push(profile.otherLanguages);}
        if(profile.otherPostgradStudies) {if (!totals["otherPostgradStudies"]) totals["otherPostgradStudies"] = []; totals["otherPostgradStudies"].push(profile.otherPostgradStudies);}
        if(profile.otherStudies) {if (!totals["otherStudies"]) totals["otherStudies"] = []; totals["otherStudies"].push(profile.otherStudies);}
        if(profile.postgradYear) {if (!totals["postgradYear"]) totals["postgradYear"] = []; totals["postgradYear"].push(profile.postgradYear);}
        if(profile.primaryYear) {if (!totals["primaryYear"]) totals["primaryYear"] = []; totals["primaryYear"].push(profile.primaryYear);}
        if(profile.secondaryYear) {if (!totals["secondaryYear"]) totals["secondaryYear"] = []; totals["secondaryYear"].push(profile.secondaryYear);}
        if(profile.speakWith) {if (!totals["speakWith"]) totals["speakWith"] = []; totals["speakWith"].push(profile.speakWith);}
        if(profile.speakingFrequency) {if (!totals["speakingFrequency"]) totals["speakingFrequency"] = []; totals["speakingFrequency"].push(profile.speakingFrequency);}
        if(profile.spokenComprehensionLevel) {if (!totals["spokenComprehensionLevel"]) totals["spokenComprehensionLevel"] = []; totals["spokenComprehensionLevel"].push(profile.spokenComprehensionLevel);}
        if(profile.studentSchoolLevel) {if (!totals["studentSchoolLevel"]) totals["studentSchoolLevel"] = []; totals["studentSchoolLevel"].push(profile.studentSchoolLevel);}
        if(profile.studentSchoolType) {if (!totals["studentSchoolType"]) totals["studentSchoolType"] = []; totals["studentSchoolType"].push(profile.studentSchoolType);}
        if(profile.synthOpinion) {if (!totals["synthOpinion"]) totals["synthOpinion"] = []; totals["synthOpinion"].push(profile.synthOpinion);}
        if(profile.teacherPrimaryType) {if (!totals["teacherPrimaryType"]) totals["teacherPrimaryType"] = []; totals["teacherPrimaryType"].push(profile.teacherPrimaryType);}
        if(profile.teacherSecondaryType) {if (!totals["teacherSecondaryType"]) totals["teacherSecondaryType"] = []; totals["teacherSecondaryType"].push(profile.teacherSecondaryType);}
        if (profile.teacherSchoolTypes) {
          if (!totals["teacherSchoolTypes"]) totals["teacherSchoolTypes"] = [];
          for(let key in profile.teacherSchoolTypes) {
            if(profile.teacherSchoolTypes[key]) totals["teacherSchoolTypes"].push(key);
          }
        }
        if(profile.thirdLevelOption) {if (!totals["thirdLevelOption"]) totals["thirdLevelOption"] = []; totals["thirdLevelOption"].push(profile.thirdLevelOption);}
        if(profile.thirdLevelYear) {if (!totals["thirdLevelYear"]) totals["thirdLevelYear"] = []; totals["thirdLevelYear"].push(profile.thirdLevelYear);}
        if(profile.usaOption) {if (!totals["usaOption"]) totals["usaOption"] = []; totals["usaOption"].push(profile.usaOption);}
        if(profile.yearsOfIrish) {if (!totals["yearsOfIrish"]) totals["yearsOfIrish"] = []; totals["yearsOfIrish"].push(profile.yearsOfIrish);}
      }
    });
    let profile = {};
    console.log("totals: ", totals);
    profile["age"] = await this.getTotals(totals["age"]);
    profile["country"] = await this.getTotals(totals["country"]);
    profile["county"] = await this.getTotals(totals["county"]);
    profile["dialectPreference"] = await this.getTotals(totals["dialectPreference"]);
    profile["gender"] = await this.getTotals(totals["gender"]);
    profile["fatherNativeTongue"] = await this.getTotals(totals["fatherNativeTongue"]);
    profile["irishMedia"] = await this.getTotals(totals["irishMedia"]);
    profile["howOftenMedia"] = await this.getTotals(totals["howOftenMedia"]);
    profile["irishReading"] = await this.getTotals(totals["irishReading"]);
    profile["howOftenReading"] = await this.getTotals(totals["howOftenReading"]);
    profile["irishWriting"] = await this.getTotals(totals["irishWriting"]);
    profile["howOftenWriting"] = await this.getTotals(totals["howOftenWriting"]);
    profile["immersionCourse"] = await this.getTotals(totals["immersionCourse"]);
    profile["motherNativeTongue"] = await this.getTotals(totals["motherNativeTongue"]);
    profile["nativeSpeakerStatus"] = await this.getTotals(totals["nativeSpeakerStatus"]);
    profile["notFromIreland"] = await this.getTotals(totals["notFromIreland"]);
    profile["otherCountryOfStudy"] = await this.getTotals(totals["otherCountryOfStudy"]);
    profile["otherLanguageProficiency"] = await this.getTotals(totals["otherLanguageProficiency"]);
    profile["otherLanguages"] = await this.getTotals(totals["otherLanguages"]);
    profile["otherPostgradStudies"] = await this.getTotals(totals["otherPostgradStudies"]);
    profile["otherStudies"] = await this.getTotals(totals["otherStudies"]);
    profile["postgradYear"] = await this.getTotals(totals["postgradYear"]);
    profile["primaryYear"] = await this.getTotals(totals["primaryYear"]);
    profile["secondaryYear"] = await this.getTotals(totals["secondaryYear"]);
    profile["speakWith"] = await this.getTotals(totals["speakWith"]);
    profile["speakingFrequency"] = await this.getTotals(totals["speakingFrequency"]);
    profile["spokenComprehensionLevel"] = await await this.getTotals(totals["spokenComprehensionLevel"]);
    profile["studentSchoolLevel"] = await this.getTotals(totals["studentSchoolLevel"]);
    profile["studentSchoolType"] = await this.getTotals(totals["studentSchoolType"]);
    profile["synthOpinion"] = await this.getTotals(totals["synthOpinion"]);
    profile["teacherPrimaryType"] = await this.getTotals(totals["teacherPrimaryType"]);
    profile["teacherSecondaryType"] = await this.getTotals(totals["teacherSecondaryType"]);
    profile["teacherSchoolTypes"] = await this.getTotals(totals["teacherSchoolTypes"]);
    profile["thirdLevelOption"] = await this.getTotals(totals["thirdLevelOption"]);
    profile["usaOption"] = await this.getTotals(totals["usaOption"]);
    profile["yearsOfIrish"] = await this.getTotals(totals["yearsOfIrish"]);

    this.setProfileToDisplay(profile);
    return;
  }
  
  /*
  * Return an object containing the counts of how many times the same items show up in an array. 
  * ex: [1, 2, 2, 3, 4, 4] => {1:1, 2:2, 3:1, 4:2}
  */
  async getTotals(array): Promise<Object> {
    let count = {};
    if(array) {
      array.forEach(val => count[val] = (count[val] || 0) + 1);
    }
    return count;
  }
  
  /*
  * Create a log of total profile data from a certain period of time and save it to the engagement collection of the DB 
  * If no log yet exists, the first one is made of all profile data available.  If a previous log does exist, the new data 
  * is calculated up from the previous log to speed up calculations
  */
  async addNewProfileData() {
    // Previous log exists
    this.dataLoaded = false;
    if(this.previousProfiles.length > 0) {
      let mostRecentLog = this.previousProfiles[this.previousProfiles.length-1];
      console.log("Last log: ", mostRecentLog);
      
      new Promise( (resolve, reject) => {
        this.statsService.getProfileDataByDate(mostRecentLog.date, "empty").subscribe( async (res) => {
          await this.calculateStats(res);
          console.log("Most recent added data: ", this.profileToDisplay);
          let profileToLog = {};
          let fieldValues = {};
          
          // loop through the keys (fields) of the new data (age, gender, ...)
          Object.keys(this.profileToDisplay).forEach(field => {
            // create new field for new log if not included in old log
            if (mostRecentLog.statsData[field]) {
              fieldValues = mostRecentLog.statsData[field];
            }
            else {
              profileToLog[field] = {};
              fieldValues = {};
            }
            // loop through the calculated values of the fields in the new data ({80+:1}, {male:2}, ...), compare with last log
            Object.entries(this.profileToDisplay[field]).forEach(([key, value]) => {
              // last log has the given field
              if (mostRecentLog.statsData[field]) {
                //last log contains the given field and key
                if(mostRecentLog.statsData[field][key]){
                  console.log("[", field, "][", key, "]", (value + mostRecentLog.statsData[field][key]), " = ", value, " + ", mostRecentLog.statsData[field][key]);
                  fieldValues[key] = (value + mostRecentLog.statsData[field][key]);
                }
                // last log does not have the key for given field
                else {
                  console.log("Last log did not have the key [", key, "] for [", field, "]");
                  fieldValues[key] = value;
                }
              }
              //last log does not have the given field
              else {
                console.log("Last log did not have the field [", field, "]");
                fieldValues[key] = value;
              }
              
            });
            profileToLog[field] = fieldValues;
          });
          console.log("Profile to log: ", profileToLog);
          this.setProfileToDisplay(profileToLog);
          resolve();
        });
      }); 
      
    }
    // Previous log does not exist, create one from all data
    else {
      await this.getProfileData();
      this.engagement.addAnalysisEvent(EventType["PROFILE-STATS"], this.profileToDisplay);
    }
    this.dataLoaded = true;
  }
  
  /* Set the html to display specific profile calculations */
  setProfileToDisplay(profile) {
    this.profileToDisplay = profile;
    console.log("Profile to display: ", this.profileToDisplay);
  }

}
