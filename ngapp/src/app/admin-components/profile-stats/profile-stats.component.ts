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
    profile["age"] = this.getTotals(totals["age"]);
    profile["country"] = this.getTotals(totals["country"]);
    profile["county"] = this.getTotals(totals["county"]);
    profile["dialectPreference"] = this.getTotals(totals["dialectPreference"]);
    profile["gender"] = this.getTotals(totals["gender"]);
    profile["fatherNativeTongue"] = this.getTotals(totals["fatherNativeTongue"]);
    profile["irishMedia"] = this.getTotals(totals["irishMedia"]);
    profile["howOftenMedia"] = this.getTotals(totals["howOftenMedia"]);
    profile["irishReading"] = this.getTotals(totals["irishReading"]);
    profile["howOftenReading"] = this.getTotals(totals["howOftenReading"]);
    profile["irishWriting"] = this.getTotals(totals["irishWriting"]);
    profile["howOftenWriting"] = this.getTotals(totals["howOftenWriting"]);
    profile["immersionCourse"] = this.getTotals(totals["immersionCourse"]);
    profile["nativeSpeakerStatus"] = this.getTotals(totals["nativeSpeakerStatus"]);
    profile["notFromIreland"] = this.getTotals(totals["notFromIreland"]);
    profile["otherCountryOfStudy"] = this.getTotals(totals["otherCountryOfStudy"]);
    profile["otherLanguageProficiency"] = this.getTotals(totals["otherLanguageProficiency"]);
    profile["otherLanguages"] = this.getTotals(totals["otherLanguages"]);
    profile["otherPostgradStudies"] = this.getTotals(totals["otherPostgradStudies"]);
    profile["otherStudies"] = this.getTotals(totals["otherStudies"]);
    profile["postgradYear"] = this.getTotals(totals["postgradYear"]);
    profile["primaryYear"] = this.getTotals(totals["primaryYear"]);
    profile["secondaryYear"] = this.getTotals(totals["secondaryYear"]);
    profile["speakWith"] = this.getTotals(totals["speakWith"]);
    profile["speakingFrequency"] = this.getTotals(totals["speakingFrequency"]);
    profile["spokenComprehensionLevel"] = this.getTotals(totals["spokenComprehensionLevel"]);
    profile["studentSchoolLevel"] = this.getTotals(totals["studentSchoolLevel"]);
    profile["studentSchoolType"] = this.getTotals(totals["studentSchoolType"]);
    profile["synthOpinion"] = this.getTotals(totals["synthOpinion"]);
    profile["teacherPrimaryType"] = this.getTotals(totals["teacherPrimaryType"]);
    profile["teacherSecondaryType"] = this.getTotals(totals["teacherSecondaryType"]);
    profile["teacherSchoolTypes"] = this.getTotals(totals["teacherSchoolTypes"]);
    profile["thirdLevelOption"] = this.getTotals(totals["thirdLevelOption"]);
    profile["usaOption"] = this.getTotals(totals["usaOption"]);
    profile["yearsOfIrish"] = this.getTotals(totals["yearsOfIrish"]);

    this.setProfileToDisplay(profile);
    return;
  }
  
  /*
  * Return an object containing the counts of how many times the same items show up in an array. 
  * ex: [1, 2, 2, 3, 4, 4] => {1:1, 2:2, 3:1, 4:2}
  */
  getTotals(array): Object {
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
      console.log("Previous profile exists in DB");
      let mostRecentLog = this.previousProfiles[this.previousProfiles.length-1];
      console.log("Last log: ", mostRecentLog.statsData);
      
      new Promise( (resolve, reject) => {
        this.statsService.getProfileDataByDate(mostRecentLog.date, "empty").subscribe( async (res) => {
          await this.calculateStats(res);
          
          let profile = {};
          
          Object.keys(this.profileToDisplay).forEach(field => {
            let profileValues = mostRecentLog.statsData[field];
            console.log("Field: ", field);
            //console.log("previous log values: ", mostRecentLog.statsData[field], ": ", profileValues);
            //console.log(this.profileToDisplay[field]);
            Object.entries(this.profileToDisplay[field]).forEach(([key, value]) => {
              //console.log("Key: ", key, "\tValue: ", value);
              if (mostRecentLog.statsData[field]) {
                if(mostRecentLog.statsData[field][key]){
                  let amount = (value + mostRecentLog.statsData[field][key]);
                  profileValues[key] = amount;
                  console.log(amount);
                  console.log("[",key, "] ", profileValues[key], "= ", value, " + ", mostRecentLog.statsData[field][key]);
                }
                else {
                  console.log("previous log does not have: ", key, " : ", value);
                  profileValues[key] = value;
                }
              }
                
              else {
                console.log("the key: ", key, " the value: ", value);
                profileValues[key] = value
              }
                
              /*
              if(mostRecentLog.statsData[field][key])
                profileValues[key] = value + mostRecentLog.statsData[field][key];
              else 
                profileValues[key] = value;
                */
            });
            profile[field] = profileValues;
            
          });
          console.log(profile);
          /*
          let profileValues = mostRecentLog.statsData["age"];
          Object.entries(this.profileToDisplay["age"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["age"][key])
              profileValues[key] = value + mostRecentLog.statsData["age"][key];
            else 
              profileValues[key] = value;
          });
          profile["age"] = profileValues;
          
          profileValues = mostRecentLog.statsData["country"];
          Object.entries(this.profileToDisplay["country"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["country"][key])
              profileValues[key] = value + mostRecentLog.statsData["country"][key];
            else 
              profileValues[key] = value;
          });
          profile["country"] = profileValues;
          
          profileValues = mostRecentLog.statsData["county"];
          Object.entries(this.profileToDisplay["county"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["county"][key])
              profileValues[key] = value + mostRecentLog.statsData["county"][key];
            else 
              profileValues[key] = value;
          });
          profile["county"] = profileValues;
          
          profileValues = mostRecentLog.statsData["dialectPreference"];
          Object.entries(this.profileToDisplay["dialectPreference"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["dialectPreference"][key])
              profileValues[key] = value + mostRecentLog.statsData["dialectPreference"][key];
            else 
              profileValues[key] = value;
          });
          profile["dialectPreference"] = profileValues;
          
          profileValues = mostRecentLog.statsData["gender"];
          Object.entries(this.profileToDisplay["gender"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["gender"][key])
              profileValues[key] = value + mostRecentLog.statsData["gender"][key];
            else 
              profileValues[key] = value;
          });
          profile["gender"] = profileValues;
          
          profileValues = mostRecentLog.statsData["fatherNativeTongue"];
          Object.entries(this.profileToDisplay["fatherNativeTongue"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["fatherNativeTongue"][key])
              profileValues[key] = value + mostRecentLog.statsData["fatherNativeTongue"][key];
            else 
              profileValues[key] = value;
          });
          profile["fatherNativeTongue"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishMedia"];
          Object.entries(this.profileToDisplay["irishMedia"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishMedia"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishMedia"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishMedia"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenMedia"];
          Object.entries(this.profileToDisplay["howOftenMedia"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenMedia"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenMedia"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenMedia"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishReading"];
          Object.entries(this.profileToDisplay["irishReading"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishReading"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishReading"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishReading"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenReading"];
          Object.entries(this.profileToDisplay["howOftenReading"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenReading"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenReading"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenReading"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishWriting"];
          Object.entries(this.profileToDisplay["irishWriting"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishWriting"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishWriting"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishWriting"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenWriting"];
          Object.entries(this.profileToDisplay["howOftenWriting"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenWriting"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenWriting"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenWriting"] = profileValues;
          
          profileValues = mostRecentLog.statsData["immersionCourse"];
          Object.entries(this.profileToDisplay["immersionCourse"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["immersionCourse"][key])
              profileValues[key] = value + mostRecentLog.statsData["immersionCourse"][key];
            else 
              profileValues[key] = value;
          });
          profile["immersionCourse"] = profileValues;
          
          profileValues = mostRecentLog.statsData["motherNativeTongue"];
          Object.entries(this.profileToDisplay["motherNativeTongue"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["motherNativeTongue"][key])
              profileValues[key] = value + mostRecentLog.statsData["motherNativeTongue"][key];
            else 
              profileValues[key] = value;
          });
          profile["motherNativeTongue"] = profileValues;
          
          profileValues = mostRecentLog.statsData["nativeSpeakerStatus"];
          Object.entries(this.profileToDisplay["nativeSpeakerStatus"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["nativeSpeakerStatus"][key])
              profileValues[key] = value + mostRecentLog.statsData["nativeSpeakerStatus"][key];
            else 
              profileValues[key] = value;
          });
          profile["nativeSpeakerStatus"] = profileValues;
          
          profileValues = mostRecentLog.statsData["notFromIreland"];
          Object.entries(this.profileToDisplay["notFromIreland"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["notFromIreland"][key])
              profileValues[key] = value + mostRecentLog.statsData["notFromIreland"][key];
            else 
              profileValues[key] = value;
          });
          profile["notFromIreland"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherCountryOfStudy"];
          Object.entries(this.profileToDisplay["otherCountryOfStudy"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherCountryOfStudy"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherCountryOfStudy"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherCountryOfStudy"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherLanguageProficiency"];
          Object.entries(this.profileToDisplay["otherLanguageProficiency"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherLanguageProficiency"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherLanguageProficiency"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherLanguageProficiency"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherLanguages"];
          Object.entries(this.profileToDisplay["otherLanguages"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherLanguages"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherLanguages"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherLanguages"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherPostgradStudies"];
          Object.entries(this.profileToDisplay["otherPostgradStudies"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherPostgradStudies"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherPostgradStudies"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherPostgradStudies"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherStudies"];
          Object.entries(this.profileToDisplay["otherStudies"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherStudies"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherStudies"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherStudies"] = profileValues;
          
          profileValues = mostRecentLog.statsData["postgradYear"];
          Object.entries(this.profileToDisplay["postgradYear"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["postgradYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["postgradYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["postgradYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["primaryYear"];
          Object.entries(this.profileToDisplay["primaryYear"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["primaryYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["primaryYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["primaryYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["secondaryYear"];
          Object.entries(this.profileToDisplay["secondaryYear"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["secondaryYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["secondaryYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["secondaryYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["speakWith"];
          Object.entries(this.profileToDisplay["speakWith"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["speakWith"][key])
              profileValues[key] = value + mostRecentLog.statsData["speakWith"][key];
            else 
              profileValues[key] = value;
          });
          profile["speakWith"] = profileValues;
          
          profileValues = mostRecentLog.statsData["speakingFrequency"];
          Object.entries(this.profileToDisplay["speakingFrequency"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["speakingFrequency"][key])
              profileValues[key] = value + mostRecentLog.statsData["speakingFrequency"][key];
            else 
              profileValues[key] = value;
          });
          profile["speakingFrequency"] = profileValues;
          
          profileValues = mostRecentLog.statsData["spokenComprehensionLevel"];
          Object.entries(this.profileToDisplay["spokenComprehensionLevel"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["spokenComprehensionLevel"][key])
              profileValues[key] = value + mostRecentLog.statsData["spokenComprehensionLevel"][key];
            else 
              profileValues[key] = value;
          });
          profile["spokenComprehensionLevel"] = profileValues;
          
          profileValues = mostRecentLog.statsData["studentSchoolLevel"];
          Object.entries(this.profileToDisplay["studentSchoolLevel"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["studentSchoolLevel"][key])
              profileValues[key] = value + mostRecentLog.statsData["studentSchoolLevel"][key];
            else 
              profileValues[key] = value;
          });
          profile["studentSchoolLevel"] = profileValues;
          
          profileValues = mostRecentLog.statsData["studentSchoolType"];
          Object.entries(this.profileToDisplay["studentSchoolType"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["studentSchoolType"][key])
              profileValues[key] = value + mostRecentLog.statsData["studentSchoolType"][key];
            else 
              profileValues[key] = value;
          });
          profile["studentSchoolType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["synthOpinion"];
          Object.entries(this.profileToDisplay["synthOpinion"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["synthOpinion"][key])
              profileValues[key] = value + mostRecentLog.statsData["synthOpinion"][key];
            else 
              profileValues[key] = value;
          });
          profile["synthOpinion"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherPrimaryType"];
          Object.entries(this.profileToDisplay["teacherPrimaryType"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherPrimaryType"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherPrimaryType"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherPrimaryType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherSecondaryType"];
          Object.entries(this.profileToDisplay["teacherSecondaryType"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherSecondaryType"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherSecondaryType"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherSecondaryType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherSchoolTypes"];
          Object.entries(this.profileToDisplay["teacherSchoolTypes"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherSchoolTypes"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherSchoolTypes"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherSchoolTypes"] = profileValues;
          
          profileValues = mostRecentLog.statsData["thirdLevelOption"];
          Object.entries(this.profileToDisplay["thirdLevelOption"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["thirdLevelOption"][key])
              profileValues[key] = value + mostRecentLog.statsData["thirdLevelOption"][key];
            else 
              profileValues[key] = value;
          });
          profile["thirdLevelOption"] = profileValues;
          
          profileValues = mostRecentLog.statsData["thirdLevelYear"];
          Object.entries(this.profileToDisplay["thirdLevelYear"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["thirdLevelYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["thirdLevelYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["thirdLevelYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["usaOption"];
          Object.entries(this.profileToDisplay["usaOption"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["usaOption"][key])
              profileValues[key] = value + mostRecentLog.statsData["usaOption"][key];
            else 
              profileValues[key] = value;
          });
          profile["usaOption"] = profileValues;
          
          profileValues = mostRecentLog.statsData["totalYearsOfIrish"];
          Object.entries(this.profileToDisplay["totalYearsOfIrish"]).forEach(([key, value]) => {
            if(mostRecentLog.statsData["totalYearsOfIrish"][key])
              profileValues[key] = value + mostRecentLog.statsData["totalYearsOfIrish"][key];
            else 
              profileValues[key] = value;
          });
          profile["totalYearsOfIrish"] = profileValues;

          this.engagement.addAnalysisEvent(EventType["PROFILE-STATS"], profile);
          this.profileToDisplay = profile;
          console.log("Profile to display: ", this.profileToDisplay);
          */
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
