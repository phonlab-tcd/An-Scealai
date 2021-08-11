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
  
  profiles: any[] = [];
  previousProfiles: any[] = [];
  profileToDisplay: any;
  displayAllProfiles: boolean = false;
  displaySelectedProfile: boolean = false;
  selectDateRange: boolean = true;
  
  //hold counts for different types of entries
  ageCount: string[] = [];
  countriesCount: string[] = [];
  countiesCount: string[] = [];
  dialectPreferencesCount: string[] = [];
  genderCount: string[] = [];
  fatherNativeTongueCount: string[] = [];
  irishMediaCount: string[] = [];
  howOftenMediaCount: string[] = [];
  irishReadingCount: string[] = [];
  howOftenReadingCount: string[] = [];
  irishWritingCount: string[] = [];
  howOftenWritingCount: string[] = [];
  immersionCourseCount: string[] = [];
  motherNativeTongueCount: string[] = [];
  nativeSpeakerStatusCount: string[] = [];
  notFromIrelandCount: string[] = [];
  otherCountryOfStudyCount: string[] = [];
  otherLanguageProficiencyCount: string[] = [];
  otherLanguagesCount: string[] = [];
  otherPostgradStudiesCount: string[] = [];
  otherStudiesCount: string[] = [];
  postgradYearCount: string[] = [];
  primaryYearCount: string[] = [];
  secondaryYearCount: string[] = [];
  speakWithCount: string[] = [];
  speakingFrequencyCount: string[] = [];
  spokenComprehensionLevelCount: string[] = [];
  studentSchoolLevelCount: string[] = [];
  studentSchoolTypeCount: string[] = [];
  synthOpinionCount: string[] = [];
  teacherPrimaryTypeCount: string[] = [];
  teacherSecondaryTypeCount: string[] = [];
  teacherSchoolTypesCount: string[] = [];
  thirdLevelOptionCount: string[] = [];
  thirdLevelYearCount: string[] = [];
  usaOptionCount: string[] = [];
  yearsOfIrishCount: string[] = [];
  
  //hold total counts for unique entry types
  totalAges = {};
  totalCountries = {};
  totalCounties = {};
  totalDialectPreferences = {};
  totalGender = {};
  totalFatherNativeTongue = {}
  totalIrishMedia = {}
  totalHowOftenMedia = {};
  totalIrishReading = {};
  totalHowOftenReading = {};
  totalIrishWriting = {};
  totalHowOftenWriting = {};
  totalImmersionCourse = {};
  totalMotherNativeTongue = {};
  totalNativeSpeakerStatus = {};
  totalNotFromIreland = {};
  totalOtherCountryOfStudy = {};
  totalOtherLanguageProficiency = {};
  totalOtherLanguages = {};
  totalOtherPostgradStudies = {};
  totalOtherStudies = {};
  totalPostgradYear = {};
  totalPrimaryYear = {};
  totalSecondaryYear = {};
  totalSpeakWith = {};
  totalSpeakingFrequency = {};
  totalSpokenComprehensionLevel = {};
  totalStudentSchoolLevel = {};
  totalStudentSchoolType = {};
  totalSynthOpinion = {};
  totalTeacherPrimaryType = {};
  totalTeacherSecondaryType = {};
  totalTeacherSchoolTypes = {};
  totalThirdLevelOption = {};
  totalThirdLevelYear = {};
  totalUsaOption = {};
  totalYearsOfIrish = {};
  
  constructor(private statsService : StatsService, public ts: TranslationService, private engagement: EngagementService) { }

  ngOnInit(): void {
    this.engagement.getPreviousAnalysisData("PROFILE-STATS").subscribe( (res) => {
      this.previousProfiles = res;
      console.log("Previous Profiles: ", this.previousProfiles);
    });
  }
  
  async getProfileData() {
    let startDate = (this.range.get("start").value) ? this.range.get("start").value : "empty";
    let endDate = (this.range.get("end").value) ? this.range.get("end").value : "empty";
    
    return new Promise( (resolve, reject) => {
      this.statsService.getProfileDataByDate(startDate, endDate).subscribe( async (res) => {
        this.profiles = res;
        console.log("Profiles returned for given dates: ", this.profiles);
        await this.calculateStats();
        resolve();
      });
    }); 
  }
  
  async calculateStats() {
    this.profiles.forEach( profile => {
      if (profile[0] !== undefined) {
        if (profile[0].age !== undefined) this.ageCount.push(profile[0].age);
        if (profile[0].country) this.countriesCount.push(profile[0].country);
        if (profile[0].county) this.countiesCount.push(profile[0].county);
        if (profile[0].dialectPreference) this.dialectPreferencesCount.push(profile[0].dialectPreference);
        if (profile[0].gender) this.genderCount.push(profile[0].gender);
        if (profile[0].fatherNativeTongue) this.fatherNativeTongueCount.push(profile[0].fatherNativeTongue);
        if (profile[0].irishMedia) {
          for(let key in profile[0].irishMedia) {
            if(profile[0].irishMedia[key]) this.irishMediaCount.push(key);
          }
        }
        if (profile[0].howOftenMedia) this.howOftenMediaCount.push(profile[0].howOftenMedia);
        if (profile[0].irishReading) {
          for(let key in profile[0].irishReading) {
            if(profile[0].irishReading[key]) this.irishReadingCount.push(key);
          }
        }
        if (profile[0].howOftenReading) this.howOftenReadingCount.push(profile[0].howOftenReading);
        if (profile[0].irishWriting) {
          for(let key in profile[0].irishWriting) {
            if(profile[0].irishWriting[key]) this.irishWritingCount.push(key);
          }
        }
        if (profile[0].howOftenWriting) this.howOftenWritingCount.push(profile[0].howOftenWriting);
        if (profile[0].immersionCourse) this.immersionCourseCount.push(profile[0].immersionCourse);
        if (profile[0].motherNativeTongue) this.motherNativeTongueCount.push(profile[0].motherNativeTongue);
        if (profile[0].nativeSpeakerStatus) this.nativeSpeakerStatusCount.push(profile[0].nativeSpeakerStatus);
        if (profile[0].notFromIreland) this.notFromIrelandCount.push(profile[0].notFromIreland);
        if (profile[0].otherCountryOfStudy) this.otherCountryOfStudyCount.push(profile[0].otherCountryOfStudy);
        if (profile[0].otherLanguageProficiency) this.otherLanguageProficiencyCount.push(profile[0].otherLanguageProficiency);
        if (profile[0].otherLanguages) this.otherLanguagesCount.push(profile[0].otherLanguages);
        if (profile[0].otherPostgradStudies) this.otherPostgradStudiesCount.push(profile[0].otherPostgradStudies);
        if (profile[0].otherStudies) this.otherStudiesCount.push(profile[0].otherStudies);
        if (profile[0].postgradYear) this.postgradYearCount.push(profile[0].postgradYear);
        if (profile[0].primaryYear) this.primaryYearCount.push(profile[0].primaryYear);
        if (profile[0].secondaryYear) this.secondaryYearCount.push(profile[0].secondaryYear);
        if (profile[0].speakWith) this.speakWithCount.push(profile[0].speakWith);
        if (profile[0].speakingFrequency) this.speakingFrequencyCount.push(profile[0].speakingFrequency);
        if (profile[0].spokenComprehensionLevel) this.spokenComprehensionLevelCount.push(profile[0].spokenComprehensionLevel);
        if (profile[0].studentSchoolLevel) this.studentSchoolLevelCount.push(profile[0].studentSchoolLevel);
        if (profile[0].studentSchoolType) this.studentSchoolTypeCount.push(profile[0].studentSchoolType);
        if (profile[0].synthOpinion) this.synthOpinionCount.push(profile[0].synthOpinion);
        if (profile[0].teacherPrimaryType) this.teacherPrimaryTypeCount.push(profile[0].teacherPrimaryType);
        if (profile[0].teacherSecondaryType) this.teacherSecondaryTypeCount.push(profile[0].teacherSecondaryType);
        if (profile[0].teacherSchoolTypes) {
          for(let key in profile[0].teacherSchoolTypes) {
            if(profile[0].teacherSchoolTypes[key]) this.teacherSchoolTypesCount.push(key);
          }
        }
        if (profile[0].thirdLevelOption) this.thirdLevelOptionCount.push(profile[0].thirdLevelOption);
        if (profile[0].thirdLevelYear) this.thirdLevelYearCount.push(profile[0].thirdLevelYear);
        if (profile[0].usaOption) this.usaOptionCount.push(profile[0].usaOption);
        if (profile[0].yearsOfIrish) this.yearsOfIrishCount.push(profile[0].yearsOfIrish);
      }
    });
    
    this.totalAges = this.getTotals(this.ageCount);
    this.totalCountries = this.getTotals(this.countriesCount);
    this.totalCounties = this.getTotals(this.countiesCount);
    this.totalDialectPreferences = this.getTotals(this.dialectPreferencesCount);
    this.totalGender = this.getTotals(this.genderCount);
    this.totalFatherNativeTongue = this.getTotals(this.fatherNativeTongueCount);
    this.totalIrishMedia = this.getTotals(this.irishMediaCount);
    this.totalHowOftenMedia = this.getTotals(this.howOftenMediaCount);
    this.totalIrishReading = this.getTotals(this.irishReadingCount);
    this.totalHowOftenReading = this.getTotals(this.howOftenReadingCount);
    this.totalIrishWriting = this.getTotals(this.irishWritingCount);
    this.totalHowOftenWriting = this.getTotals(this.howOftenWritingCount);
    this.totalImmersionCourse = this.getTotals(this.immersionCourseCount);
    this.totalMotherNativeTongue = this.getTotals(this.motherNativeTongueCount);
    this.totalNativeSpeakerStatus = this.getTotals(this.nativeSpeakerStatusCount);
    this.totalNotFromIreland = this.getTotals(this.notFromIrelandCount);
    this.totalOtherCountryOfStudy = this.getTotals(this.otherCountryOfStudyCount);
    this.totalOtherLanguageProficiency = this.getTotals(this.otherLanguageProficiencyCount);
    this.totalOtherLanguages = this.getTotals(this.otherLanguagesCount);
    this.totalOtherPostgradStudies = this.getTotals(this.otherPostgradStudiesCount);
    this.totalOtherStudies = this.getTotals(this.otherStudiesCount);
    this.totalPostgradYear = this.getTotals(this.postgradYearCount);
    this.totalPrimaryYear = this.getTotals(this.primaryYearCount);
    this.totalSecondaryYear = this.getTotals(this.secondaryYearCount);
    this.totalSpeakWith = this.getTotals(this.speakWithCount);
    this.totalSpeakingFrequency = this.getTotals(this.speakingFrequencyCount);
    this.totalSpokenComprehensionLevel = this.getTotals(this.spokenComprehensionLevelCount);
    this.totalStudentSchoolLevel = this.getTotals(this.studentSchoolLevelCount);
    this.totalStudentSchoolType = this.getTotals(this.studentSchoolTypeCount);
    this.totalSynthOpinion = this.getTotals(this.synthOpinionCount);
    this.totalTeacherPrimaryType = this.getTotals(this.teacherPrimaryTypeCount);
    this.totalTeacherSecondaryType = this.getTotals(this.teacherSecondaryTypeCount);
    this.totalTeacherSchoolTypes = this.getTotals(this.teacherSchoolTypesCount);
    this.totalThirdLevelOption = this.getTotals(this.thirdLevelOptionCount);
    this.totalThirdLevelYear = this.getTotals(this.thirdLevelYearCount);
    this.totalUsaOption = this.getTotals(this.usaOptionCount);
    this.totalYearsOfIrish = this.getTotals(this.yearsOfIrishCount);
    return;
  }
  
  getTotals(array): Object {
    let count = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
  }
  
  async addNewProfileData() {
    let profile = {};
    this.displayAllProfiles = false;
    
    if(this.previousProfiles.length > 0) {
      console.log("Previous profile exists in DB");
      let mostRecentLog = this.previousProfiles[this.previousProfiles.length-1];
      console.log("Last log: ", mostRecentLog.statsData);
      
      new Promise( (resolve, reject) => {
        this.statsService.getProfileDataByDate(mostRecentLog.date, "empty").subscribe( async (res) => {
          this.profiles = res;
          await this.calculateStats();

          let profileValues = mostRecentLog.statsData["age"];
          Object.entries(this.totalAges).forEach(([key, value]) => {
            if(mostRecentLog.statsData["age"][key])
              profileValues[key] = value + mostRecentLog.statsData["age"][key];
            else 
              profileValues[key] = value;
          });
          profile["age"] = profileValues;
          
          profileValues = mostRecentLog.statsData["country"];
          console.log("Total ages: ", this.totalCountries);
          console.log("Ages last logged: ",mostRecentLog.statsData["country"]);
          Object.entries(this.totalCountries).forEach(([key, value]) => {
            if(mostRecentLog.statsData["country"][key])
              profileValues[key] = value + mostRecentLog.statsData["country"][key];
            else 
              profileValues[key] = value;
          });
          profile["country"] = profileValues;
          
          profileValues = mostRecentLog.statsData["county"];
          Object.entries(this.totalCounties).forEach(([key, value]) => {
            if(mostRecentLog.statsData["county"][key])
              profileValues[key] = value + mostRecentLog.statsData["county"][key];
            else 
              profileValues[key] = value;
          });
          profile["county"] = profileValues;
          
          profileValues = mostRecentLog.statsData["dialectPreference"];
          Object.entries(this.totalDialectPreferences).forEach(([key, value]) => {
            if(mostRecentLog.statsData["dialectPreference"][key])
              profileValues[key] = value + mostRecentLog.statsData["dialectPreference"][key];
            else 
              profileValues[key] = value;
          });
          profile["dialectPreference"] = profileValues;
          
          profileValues = mostRecentLog.statsData["gender"];
          Object.entries(this.totalGender).forEach(([key, value]) => {
            if(mostRecentLog.statsData["gender"][key])
              profileValues[key] = value + mostRecentLog.statsData["gender"][key];
            else 
              profileValues[key] = value;
          });
          profile["gender"] = profileValues;
          
          profileValues = mostRecentLog.statsData["fatherNativeTongue"];
          Object.entries(this.totalFatherNativeTongue).forEach(([key, value]) => {
            if(mostRecentLog.statsData["fatherNativeTongue"][key])
              profileValues[key] = value + mostRecentLog.statsData["fatherNativeTongue"][key];
            else 
              profileValues[key] = value;
          });
          profile["fatherNativeTongue"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishMedia"];
          Object.entries(this.totalIrishMedia).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishMedia"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishMedia"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishMedia"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenMedia"];
          Object.entries(this.totalHowOftenMedia).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenMedia"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenMedia"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenMedia"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishReading"];
          Object.entries(this.totalIrishReading).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishReading"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishReading"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishReading"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenReading"];
          Object.entries(this.totalHowOftenReading).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenReading"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenReading"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenReading"] = profileValues;
          
          profileValues = mostRecentLog.statsData["irishWriting"];
          Object.entries(this.totalIrishWriting).forEach(([key, value]) => {
            if(mostRecentLog.statsData["irishWriting"][key])
              profileValues[key] = value + mostRecentLog.statsData["irishWriting"][key];
            else 
              profileValues[key] = value;
          });
          profile["irishWriting"] = profileValues;
          
          profileValues = mostRecentLog.statsData["howOftenWriting"];
          Object.entries(this.totalHowOftenWriting).forEach(([key, value]) => {
            if(mostRecentLog.statsData["howOftenWriting"][key])
              profileValues[key] = value + mostRecentLog.statsData["howOftenWriting"][key];
            else 
              profileValues[key] = value;
          });
          profile["howOftenWriting"] = profileValues;
          
          profileValues = mostRecentLog.statsData["immersionCourse"];
          Object.entries(this.totalImmersionCourse).forEach(([key, value]) => {
            if(mostRecentLog.statsData["immersionCourse"][key])
              profileValues[key] = value + mostRecentLog.statsData["immersionCourse"][key];
            else 
              profileValues[key] = value;
          });
          profile["immersionCourse"] = profileValues;
          
          profileValues = mostRecentLog.statsData["motherNativeTongue"];
          Object.entries(this.totalMotherNativeTongue).forEach(([key, value]) => {
            if(mostRecentLog.statsData["motherNativeTongue"][key])
              profileValues[key] = value + mostRecentLog.statsData["motherNativeTongue"][key];
            else 
              profileValues[key] = value;
          });
          profile["motherNativeTongue"] = profileValues;
          
          profileValues = mostRecentLog.statsData["nativeSpeakerStatus"];
          Object.entries(this.totalNativeSpeakerStatus).forEach(([key, value]) => {
            if(mostRecentLog.statsData["nativeSpeakerStatus"][key])
              profileValues[key] = value + mostRecentLog.statsData["nativeSpeakerStatus"][key];
            else 
              profileValues[key] = value;
          });
          profile["nativeSpeakerStatus"] = profileValues;
          
          profileValues = mostRecentLog.statsData["notFromIreland"];
          Object.entries(this.totalNotFromIreland).forEach(([key, value]) => {
            if(mostRecentLog.statsData["notFromIreland"][key])
              profileValues[key] = value + mostRecentLog.statsData["notFromIreland"][key];
            else 
              profileValues[key] = value;
          });
          profile["notFromIreland"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherCountryOfStudy"];
          Object.entries(this.totalOtherCountryOfStudy).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherCountryOfStudy"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherCountryOfStudy"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherCountryOfStudy"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherLanguageProficiency"];
          Object.entries(this.totalOtherLanguageProficiency).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherLanguageProficiency"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherLanguageProficiency"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherLanguageProficiency"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherLanguages"];
          Object.entries(this.totalOtherLanguages).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherLanguages"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherLanguages"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherLanguages"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherPostgradStudies"];
          Object.entries(this.totalOtherPostgradStudies).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherPostgradStudies"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherPostgradStudies"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherPostgradStudies"] = profileValues;
          
          profileValues = mostRecentLog.statsData["otherStudies"];
          Object.entries(this.totalOtherStudies).forEach(([key, value]) => {
            if(mostRecentLog.statsData["otherStudies"][key])
              profileValues[key] = value + mostRecentLog.statsData["otherStudies"][key];
            else 
              profileValues[key] = value;
          });
          profile["otherStudies"] = profileValues;
          
          profileValues = mostRecentLog.statsData["postgradYear"];
          Object.entries(this.totalPostgradYear).forEach(([key, value]) => {
            if(mostRecentLog.statsData["postgradYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["postgradYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["postgradYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["primaryYear"];
          Object.entries(this.totalPrimaryYear).forEach(([key, value]) => {
            if(mostRecentLog.statsData["primaryYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["primaryYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["primaryYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["secondaryYear"];
          Object.entries(this.totalSecondaryYear).forEach(([key, value]) => {
            if(mostRecentLog.statsData["secondaryYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["secondaryYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["secondaryYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["speakWith"];
          Object.entries(this.totalSpeakWith).forEach(([key, value]) => {
            if(mostRecentLog.statsData["speakWith"][key])
              profileValues[key] = value + mostRecentLog.statsData["speakWith"][key];
            else 
              profileValues[key] = value;
          });
          profile["speakWith"] = profileValues;
          
          profileValues = mostRecentLog.statsData["speakingFrequency"];
          Object.entries(this.totalSpeakingFrequency).forEach(([key, value]) => {
            if(mostRecentLog.statsData["speakingFrequency"][key])
              profileValues[key] = value + mostRecentLog.statsData["speakingFrequency"][key];
            else 
              profileValues[key] = value;
          });
          profile["speakingFrequency"] = profileValues;
          
          profileValues = mostRecentLog.statsData["spokenComprehensionLevel"];
          Object.entries(this.totalSpokenComprehensionLevel).forEach(([key, value]) => {
            if(mostRecentLog.statsData["spokenComprehensionLevel"][key])
              profileValues[key] = value + mostRecentLog.statsData["spokenComprehensionLevel"][key];
            else 
              profileValues[key] = value;
          });
          profile["spokenComprehensionLevel"] = profileValues;
          
          profileValues = mostRecentLog.statsData["studentSchoolLevel"];
          Object.entries(this.totalStudentSchoolLevel).forEach(([key, value]) => {
            if(mostRecentLog.statsData["studentSchoolLevel"][key])
              profileValues[key] = value + mostRecentLog.statsData["studentSchoolLevel"][key];
            else 
              profileValues[key] = value;
          });
          profile["studentSchoolLevel"] = profileValues;
          
          profileValues = mostRecentLog.statsData["studentSchoolType"];
          Object.entries(this.totalStudentSchoolType).forEach(([key, value]) => {
            if(mostRecentLog.statsData["studentSchoolType"][key])
              profileValues[key] = value + mostRecentLog.statsData["studentSchoolType"][key];
            else 
              profileValues[key] = value;
          });
          profile["studentSchoolType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["synthOpinion"];
          Object.entries(this.totalSynthOpinion).forEach(([key, value]) => {
            if(mostRecentLog.statsData["synthOpinion"][key])
              profileValues[key] = value + mostRecentLog.statsData["synthOpinion"][key];
            else 
              profileValues[key] = value;
          });
          profile["synthOpinion"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherPrimaryType"];
          Object.entries(this.totalTeacherPrimaryType).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherPrimaryType"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherPrimaryType"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherPrimaryType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherSecondaryType"];
          Object.entries(this.totalTeacherSecondaryType).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherSecondaryType"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherSecondaryType"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherSecondaryType"] = profileValues;
          
          profileValues = mostRecentLog.statsData["teacherSchoolTypes"];
          Object.entries(this.totalTeacherSchoolTypes).forEach(([key, value]) => {
            if(mostRecentLog.statsData["teacherSchoolTypes"][key])
              profileValues[key] = value + mostRecentLog.statsData["teacherSchoolTypes"][key];
            else 
              profileValues[key] = value;
          });
          profile["teacherSchoolTypes"] = profileValues;
          
          profileValues = mostRecentLog.statsData["thirdLevelOption"];
          Object.entries(this.totalThirdLevelOption).forEach(([key, value]) => {
            if(mostRecentLog.statsData["thirdLevelOption"][key])
              profileValues[key] = value + mostRecentLog.statsData["thirdLevelOption"][key];
            else 
              profileValues[key] = value;
          });
          profile["thirdLevelOption"] = profileValues;
          
          profileValues = mostRecentLog.statsData["thirdLevelYear"];
          Object.entries(this.totalThirdLevelYear).forEach(([key, value]) => {
            if(mostRecentLog.statsData["thirdLevelYear"][key])
              profileValues[key] = value + mostRecentLog.statsData["thirdLevelYear"][key];
            else 
              profileValues[key] = value;
          });
          profile["thirdLevelYear"] = profileValues;
          
          profileValues = mostRecentLog.statsData["usaOption"];
          Object.entries(this.totalUsaOption).forEach(([key, value]) => {
            if(mostRecentLog.statsData["usaOption"][key])
              profileValues[key] = value + mostRecentLog.statsData["usaOption"][key];
            else 
              profileValues[key] = value;
          });
          profile["usaOption"] = profileValues;
          
          profileValues = mostRecentLog.statsData["totalYearsOfIrish"];
          Object.entries(this.totalYearsOfIrish).forEach(([key, value]) => {
            if(mostRecentLog.statsData["totalYearsOfIrish"][key])
              profileValues[key] = value + mostRecentLog.statsData["totalYearsOfIrish"][key];
            else 
              profileValues[key] = value;
          });
          profile["totalYearsOfIrish"] = profileValues;

          //this.engagement.addAnalysisEvent(EventType["PROFILE-STATS"], profile);
          this.profileToDisplay = profile;
          console.log("Profile to display: ", this.profileToDisplay);
          this.displaySelectedProfile = true;
          resolve();
        });
      }); 
    }
    else {
      await this.getProfileData();
      profile = {
        "age": this.totalAges,
        "country": this.totalCountries,
        "county": this.totalCounties,
        "dialectPreference": this.totalDialectPreferences,
        "gender": this.totalGender,
        "fatherNativeTongue": this.totalFatherNativeTongue,
        "irishMedia": this.totalIrishMedia,
        "howOftenMedia": this.totalHowOftenMedia,
        "irishReading": this.totalIrishReading,
        "howOftenReading": this.totalHowOftenReading,
        "irishWriting": this.totalIrishWriting,
        "howOftenWriting": this.totalHowOftenWriting,
        "immersionCourse": this.totalImmersionCourse,
        "motherNativeTongue": this.totalMotherNativeTongue,
        "nativeSpeakerStatus": this.totalNativeSpeakerStatus,
        "notFromIreland": this.totalNotFromIreland,
        "otherCountryOfStudy": this.totalOtherCountryOfStudy,
        "otherLanguageProficiency": this.totalOtherLanguageProficiency,
        "otherLanguages": this.totalOtherLanguages,
        "otherPostgradStudies": this.totalOtherPostgradStudies,
        "otherStudies": this.totalOtherStudies,
        "postgradYear": this.totalPostgradYear,
        "primaryYear": this.totalPrimaryYear,
        "secondaryYear": this.totalSecondaryYear,
        "speakWith": this.totalSpeakWith,
        "speakingFrequency": this.totalSpeakingFrequency,
        "spokenComprehensionLevel": this.totalSpokenComprehensionLevel,
        "studentSchoolLevel": this.totalStudentSchoolLevel,
        "studentSchoolType": this.totalStudentSchoolType,
        "synthOpinion": this.totalSynthOpinion,
        "teacherPrimaryType": this.totalTeacherPrimaryType,
        "teacherSecondaryType": this.totalTeacherSecondaryType,
        "teacherSchoolTypes": this.totalTeacherSchoolTypes,
        "thirdLevelOption": this.totalThirdLevelOption,
        "thirdLevelYear": this.totalThirdLevelYear,
        "usaOption": this.totalUsaOption,
        "totalYearsOfIrish": this.totalYearsOfIrish
      }
      this.engagement.addAnalysisEvent(EventType["PROFILE-STATS"], profile);
    }

  }
  
  setProfileToDisplay(profile) {
    this.profileToDisplay = profile.statsData;
  }

}
