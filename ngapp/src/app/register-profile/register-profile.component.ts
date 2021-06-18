import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthenticationService } from '../authentication.service'
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-register-profile',
  templateUrl: './register-profile.component.html',
  styleUrls: ['./register-profile.component.css']
})
export class RegisterProfileComponent implements OnInit {

  constructor(private profileService : ProfileService,
              public auth : AuthenticationService,
              private router : Router,
              public ts : TranslationService) { }

  //input : string;
  showError : boolean;
  
  email : string;

  genders : string[] = [
    this.ts.l.male,
    this.ts.l.female,
    this.ts.l.non_binary,
    this.ts.l.prefer_not_say
  ];

  gender : string = this.genders[0];

  ages : string[] = [
    "6-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70-79",
    "80+",
  ];

  age : string = this.ages[0];

  counties : string[] = [
    "Baile Átha Cliath",
    "Contae Átha Cliath",
    "Contae an Chabháin",
    "Contae Cheatharlach",
    "Contae Chiarraí­",
    "Contae Chill Chainnigh",
    "Contae Chill Dara",
    "Contae Chill Mhantáin",
    "Contae an Chláir",
    "Contae Chorcaí­",
    "Contae Dhún na nGall",
    "Contae na Gaillimhe",
    "Contae na hIarmhí­",
    "Contae Laoise",
    "Contae Liatroma",
    "Contae Loch Garman",
    "Contae an Longfoirt",
    "Contae Lú",
    "Contae Luimnigh",
    "Contae Mhaigh Eo",
    "Contae na Mí­",
    "Contae Mhuineacháin",
    "Contae Phort Láirge",
    "Contae Ros Comáin",
    "Contae Shligigh",
    "Contae Thiobraid Árann",
    "Contae Uí­bh Fhailí­",
    "Béal Feirste",
    "Contae Aontroma",
    "Contae Ard Mhacha",
    "Contae Dhoire",
    "Contae an Dúin",
    "Contae Thír Eoghain",
    "Contae Fhear Manach",
  ];

  county : string = this.counties[0];

  notFromIreland : boolean = false;

  country : string;

  schools : string[] = [
    this.ts.l.english_school,
    this.ts.l.gaelscoil,
    this.ts.l.gaeltacht_school,
    this.ts.l.school_not_in_ireland,
  ];
  
  studentSchoolType: string = this.schools[0];
  
  
  studentSchoolLevels: string[] = [
    "I am a primary school pupil",
    "I am a secondary school pupil",
    "I am a 3rd level student in Ireland",
    "I am studying Irish in the USA",
    "I am studying Irish outside of Ireland or USA",
    "I am a postgraduate student"
  ];
  
  studentSchoolLevel: string;
  
  primaryYears: string[] = [
    "I am in 1st class",
    "I am in 2nd class",
    "I am in 3rd class",
    "I am in 4th class",
    "I am in 5th class",
    "I am in 6th class",
  ];
  
  primaryYear: string;
  
  secondaryYears: string[] = [
    "I am in 1st year",
    "I am in 2nd year",
    "I am in 3rd year",
    "I am in 4th year",
    "I am in 5th year",
    "I am in 6th year",
  ];
  
  secondaryYear: string;
  
  thirdLevelOptions: string[] = [
    "I am studying Irish",
    "I am studying Education Primary (with Irish as a major component)",
    "I am studying Education Primary (with Irish as a minor component)",
    "I am studying Education as a Postgraduate student",
    "Other"
  ];
  
  thirdLevelOption: string;
  
  thirdLevelYears: string[] = [
    "I am in 1st year",
    "I am in 2nd year",
    "I am in 3rd year of a 4 year course",
    "I am in final year"
  ];
  
  thirdLevelYear: string;
  
  postgradYear: string;
  
  otherStudies: string;
  
  usaOptions: string[] = [
    "I am taking an Irish class at a University",
    "I am not enrolled in an Irish language class at a University"
  ];
  
  usaOption: string;
  
  otherCountryOfStudy: string;
  
  otherPostgradStudies: string;
  
  immersionCourse: boolean = false;
  
  teacherSchoolTypes = {
    primary: false,
    secondary: false,
    thirdLevel : false,
    gaeltacht : false
  };
  
  teacherPrimaryType: string;
  teacherSecondaryType: string;
  teacherSchoolName: string;

  nativeSpeakerStatuses : string[] = [
    this.ts.l.yes,
    this.ts.l.no,
    this.ts.l.bilingual_native,
    this.ts.l.bilingual_other,
  ];

  nativeSpeakerStatus : string = this.nativeSpeakerStatuses[0];

  dialectPreferences : string[] = [
    this.ts.l.gaeilge_uladh,
    this.ts.l.gaeilge_chonnacht,
    this.ts.l.gaolainn_na_mumhan,
    this.ts.l.other,
  ];

  dialectPreference : string = this.dialectPreferences[0];

  spokenComprehensionLevels : string[] = [
    this.ts.l.comprehension_level_1,
    this.ts.l.comprehension_level_2,
    this.ts.l.comprehension_level_3,
    this.ts.l.comprehension_level_4,
    this.ts.l.comprehension_level_5,
  ];

  spokenComprehensionLevel : string = this.spokenComprehensionLevels[0];

  yearsOfIrish: number;
  
  otherLanguages: string;
  
  fatherNativeTongue: string;
  
  motherNativeTongue: string;

  howOftenOptions : string[] = [
    this.ts.l.every_day,
    this.ts.l.every_week,
    this.ts.l.few_times_a_month,
    this.ts.l.hardly_ever,
  ];

  speakingFrequency : string = this.howOftenOptions[0];

  speakWithOptions : string[] = [
    this.ts.l.learners_and_natives,
    this.ts.l.natives,
    this.ts.l.learners,
  ];

  speakWith : string = this.speakWithOptions[0];

  irishMedia = {
    rnag : false,
    tg4 : false,
    bbcUladh : false,
    rnalife : false,
    radioRiRa : false,
    socialMedia : false
  };

  howOftenMedia : string = this.howOftenOptions[0];

  howOftenReading : string = this.howOftenOptions[0];

  howOftenWriting : string = this.howOftenOptions[0];

  irishMediaChecked() : boolean {
    return (this.irishMedia.bbcUladh
      || this.irishMedia.radioRiRa
      || this.irishMedia.rnag
      || this.irishMedia.rnalife
      || this.irishMedia.socialMedia
      || this.irishMedia.tg4);
  }

  irishReading = {
    newspapers : false,
    socialMedia : false,
    books : false,
  };

  irishReadingChecked() : boolean {
    return (this.irishReading.newspapers
      || this.irishReading.books
      || this.irishReading.socialMedia);
  }

  irishWriting = {
    email : false,
    socialMedia : false,
    blog : false,
    teachingMaterial : false,
    articles : false,
    shortStories : false,
    books : false,
    poetry : false,
  }

  irishWritingChecked() : boolean {
    return (
      this.irishWriting.articles
      || this.irishWriting.blog
      || this.irishWriting.books
      || this.irishWriting.email
      || this.irishWriting.poetry
      || this.irishWriting.shortStories
      || this.irishWriting.socialMedia
      || this.irishWriting.teachingMaterial
    );
  }

  synthOpinions : string[] = [
    this.ts.l.synth_opinion_1,
    this.ts.l.synth_opinion_2,
    this.ts.l.synth_opinion_3,
    this.ts.l.synth_opinion_4,
    this.ts.l.synth_opinion_5,
  ];

  synthOpinion : string = this.synthOpinions[0];

  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;
    console.log(userDetails._id);

    this.profileService.getForUser(userDetails._id).subscribe((res) => {
      if(res) {
        let p = res.profile;
        this.email = p.email;
        this.gender = p.gender;
        this.age = p.age;
        this.county = p.county;
        this.notFromIreland = p.notFromIreland;
        this.country = p.country;
        
        this.studentSchoolType = p.studentSchoolType,
        this.studentSchoolLevel = p.studentSchoolLevel,
        this.primaryYear = p.primaryYear,
        this.secondaryYear = p.secondaryYear,
        this.thirdLevelOption = p.thirdLevelOption,
        this.thirdLevelYear = p.thirdLevelYear,
        this.postgradYear = p.postgradYear,
        this.otherStudies = p.otherStudies,
        this.usaOption = p.usaOption,
        this.otherCountryOfStudy = p.otherCountryOfStudy,
        this.otherPostgradStudies = p.otherPostgradStudies,
        this.immersionCourse = p.immersionCourse,
        
        this.teacherPrimaryType = p.teacherPrimaryType,
        this.teacherSecondaryType = p.teacherSecondaryType,
        this.teacherSchoolTypes = p.teacherSchoolTypes,
        this.teacherSchoolName = p.teacherSchoolName,

        this.nativeSpeakerStatus = p.nativeSpeakerStatus;
        this.dialectPreference = p.dialectPreference;
        this.spokenComprehensionLevel = p.spokenComprehensionLevel;
        this.yearsOfIrish = p.yearsOfIrish,
        this.otherLanguages = p.otherLanguages,
        this.fatherNativeTongue = p.fatherNativeTongue,
        this.motherNativeTongue = p.motherNativeTongue,
        this.speakingFrequency = p.speakingFrequency;
        this.speakWith = p.speakWith;
        this.irishMedia = p.irishMedia;
        this.irishWriting = p.irishWriting;
        this.howOftenMedia = p.howOftenMedia;
        this.howOftenReading = p.howOftenReading;
        this.howOftenWriting = p.howOftenWriting;
        this.synthOpinion = p.synthOpinion;
      }
    }, (err) => {
      console.log("No previous profile data associated with user.");
    });
/*
    if(userDetails.role === 'TEACHER') {
      this.schools[3] = this.ts.l.school_not_in_ireland_teacher;
    }
    */
    
  }

  saveDetails() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    let profile = {
      userId : userDetails._id,
      email: this.email,
      gender : this.gender,
      age : this.age,
      county : (!this.notFromIreland) ? this.county : null,
      notFromIreland : this.notFromIreland,
      country : (this.notFromIreland) ? this.country : "Ireland",
      
      studentSchoolType: this.studentSchoolType,
      studentSchoolLevel: this.studentSchoolLevel,
      primaryYear: (this.primaryYear) ? this.primaryYear : null,
      secondaryYear: (this.secondaryYear) ? this.secondaryYear : null,
      thirdLevelOption: (this.thirdLevelOption) ? this.thirdLevelOption : null,
      thirdLevelYear: (this.thirdLevelYear) ? this.thirdLevelYear : null,
      postgradYear: (this.postgradYear) ? this.postgradYear : null,
      otherStudies: (this.otherStudies) ? this.otherStudies : null,
      usaOption: (this.usaOption) ? this.usaOption : null, 
      otherCountryOfStudy: (this.otherCountryOfStudy) ? this.otherCountryOfStudy : null, 
      otherPostgradStudies: (this.otherPostgradStudies) ? this.otherPostgradStudies : null, 
      immersionCourse: this.immersionCourse,
      
      teacherPrimaryType: (this.teacherPrimaryType) ? this.teacherPrimaryType : null,
      teacherSecondaryType: (this.teacherSecondaryType) ? this.teacherSecondaryType : null,
      teacherSchoolTypes: this.teacherSchoolTypes,
      teacherSchoolName: this.teacherSchoolName,
      
      nativeSpeakerStatus : this.nativeSpeakerStatus,
      spokenComprehensionLevel : this.spokenComprehensionLevel,
      yearsOfIrish: (this.yearsOfIrish) ? this.yearsOfIrish : null, 
      otherLanguages: (this.otherLanguages) ? this.otherLanguages : null,
      fatherNativeTongue: (this.fatherNativeTongue) ? this.fatherNativeTongue : null,
      motherNativeTongue: this.motherNativeTongue,
      speakingFrequency : this.speakingFrequency,
      speakWith : this.speakWith,
      irishMedia : this.irishMedia,
      irishReading : this.irishReading,
      irishWriting : this.irishWriting,
      howOftenMedia : this.howOftenMedia,
      howOftenReading : this.howOftenReading,
      howOftenWriting : this.howOftenWriting,
      synthOpinion : this.synthOpinion,
    };
    
    console.log(profile);

    this.profileService.create(profile).subscribe((res) => {
      if(userDetails.role === 'STUDENT') {
        this.router.navigateByUrl('/contents');
      } else if(userDetails.role === 'TEACHER') {
        this.router.navigateByUrl('/teacher/dashboard');
      }
      
    });

  }

}
