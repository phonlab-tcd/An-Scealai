import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthenticationService } from '../authentication.service'
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-register-profile',
  templateUrl: './register-profile.component.html',
  styleUrls: ['./register-profile.component.scss']
})
export class RegisterProfileComponent implements OnInit {

  constructor(private profileService : ProfileService,
              public auth : AuthenticationService,
              private router : Router,
              public ts : TranslationService) { }

  //input : string;
  showError : boolean;

  genders : string[] = [
    "",
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say"
  ];

  gender : string = this.genders[0];

  ages : string[] = [
    "",
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
    "",
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
    "",
    "English school",
    "Gaelscoil",
    "Gaeltacht school",
    "I did not attend school in Ireland"
  ];
  
  studentSchoolType: string = this.schools[0];
  
  
  studentSchoolLevels: string[] = [
    "",
    "I am a primary school pupil",
    "I am a secondary school pupil",
    "I am a 3rd level student in Ireland",
    "I am studying Irish in the USA",
    "I am studying Irish outside of Ireland or USA",
    "I am a postgraduate student"
  ];
  
  studentSchoolLevel: string;
  
  primaryYears: string[] = [
    "",
    "I am in 1st class",
    "I am in 2nd class",
    "I am in 3rd class",
    "I am in 4th class",
    "I am in 5th class",
    "I am in 6th class"
  ];
  
  primaryYear: string;
  
  secondaryYears: string[] = [
    "",
    "I am in 1st year",
    "I am in 2nd year",
    "I am in 3rd year",
    "I am in 4th year",
    "I am in 5th year",
    "I am in 6th year",
  ];
  
  secondaryYear: string;
  
  thirdLevelOptions: string[] = [
    "",
    "I am studying Irish",
    "I am studying Education Primary (with Irish as a major component)",
    "I am studying Education Primary (with Irish as a minor component)",
    "I am studying Education as a Postgraduate student",
    "Other"
  ];
  
  thirdLevelOption: string;
  
  thirdLevelYearsShort: string[] = [
    "",
    "I am in 1st year",
    "I am in 2nd year",
    "I am in 3rd year of a 4 year course",
    "I am in final year"
  ];
  
  thirdLevelYears: string[] = [
    "",
    "I am in 1st year",
    "I am in 2nd year",
    "I am in 3rd year",
    "I am in final year"
  ]
  
  thirdLevelYear: string;
  
  postgradYear: string;
  
  otherStudies: string;
  
  usaOptions: string[] = [
    "",
    "I am taking an Irish class at a University",
    "I am not enrolled in an Irish language class at a University"
  ];
  
  
  usaOption: string;
  
  otherCountryOfStudy: string;
  
  otherPostgradStudies: string;
  
  immersionOptions: string[] = [
    "",
    "Yes",
    "No"
  ]
  
  immersionCourse: String = this.immersionOptions[0];
  
  teacherSchoolTypes = {
    primary: false,
    secondary: false,
    thirdLevel : false,
    gaeltacht : false
  };
  
  teacherPrimaryType: string;
  teacherSecondaryType: string;

  nativeSpeakerStatuses : string[] = [
    "",
    "Yes",
    "No",
    "Bilingual (native)",
    "Bilingual (other)"
  ];

  nativeSpeakerStatus : string = this.nativeSpeakerStatuses[0];

  dialectPreferences : string[] = [
    "",
    "Gaeilge Uladh",
    "Gaeilge Chonnact",
    "Gaolainn na Mumhan",
    "Other"
  ];

  dialectPreference : string = this.dialectPreferences[0];

  spokenComprehensionLevels : string[] = [
    "",
    "A few words when spoken slowly",
    "A few simple phrases when spoken slowly",
    "Parts of the conversation",
    "Most of the conversation when spoken clearly",
    "Almost everything when spoken at a normal pace"
  ];

  spokenComprehensionLevel : string = this.spokenComprehensionLevels[0];

  yearsOfIrish: number;
  
  otherLanguages: string;
  
  fatherNativeTongue: string;
  
  motherNativeTongue: string;
  
  otherLanguageProficiency: string;

  howOftenOptions : string[] = [
    "",
    "Every day",
    "Every week but not every day",
    "A few times a month",
    "Hardly ever",
  ];

  speakingFrequency : string = this.howOftenOptions[0];

  speakWithOptions : string[] = [
    "",
    "Learners and native speakers",
    "Native speakers",
    "Learners",
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
    "",
    "I don't like them",
    "They're okay, but I prefer a human voice",
    "I don't care if it is a computer or person",
    "Sometimes synthetic voices just fit",
    "Sometimes synthetic voices are better suited",
  ];

  synthOpinion : string = this.synthOpinions[0];

  ngOnInit() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    this.profileService.getForUser(userDetails._id).subscribe((res) => {
      if(res) {
        let p = res.profile;
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
        
        this.teacherPrimaryType = (p.teacherPrimaryType) ? p.teacherPrimaryType : this.teacherPrimaryType,
        this.teacherSecondaryType = (p.teacherSecondaryType) ? p.teacherSecondaryType : this.teacherSecondaryType,
        this.teacherSchoolTypes = (p.teacherSchoolTypes) ? p.teacherSchoolTypes: this.teacherSchoolTypes,

        this.nativeSpeakerStatus = p.nativeSpeakerStatus;
        this.dialectPreference = p.dialectPreference;
        this.spokenComprehensionLevel = p.spokenComprehensionLevel;
        this.yearsOfIrish = p.yearsOfIrish,
        this.otherLanguages = p.otherLanguages,
        this.fatherNativeTongue = p.fatherNativeTongue,
        this.motherNativeTongue = p.motherNativeTongue,
        this.otherLanguageProficiency = p.otherLanguageProficiency,
        
        this.speakingFrequency = p.speakingFrequency;
        this.speakWith = p.speakWith;
        this.irishMedia = p.irishMedia;
        this.irishReading = p.irishReading;
        this.irishWriting = p.irishWriting;
        this.howOftenMedia = p.howOftenMedia;
        this.howOftenReading = p.howOftenReading;
        this.howOftenWriting = p.howOftenWriting;
        this.synthOpinion = p.synthOpinion;
      }
    }, (err) => {
    });
    
  }

  saveDetails() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    let profile = {
      userId : userDetails._id,
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
      
      nativeSpeakerStatus : this.nativeSpeakerStatus,
      dialectPreference : this.dialectPreference,
      spokenComprehensionLevel : this.spokenComprehensionLevel,
      yearsOfIrish: (this.yearsOfIrish) ? this.yearsOfIrish : null, 
      otherLanguages: (this.otherLanguages) ? this.otherLanguages : null,
      fatherNativeTongue: (this.fatherNativeTongue) ? this.fatherNativeTongue : null,
      motherNativeTongue: this.motherNativeTongue,
      otherLanguageProficiency : this.otherLanguageProficiency,
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
    

    this.profileService.create(profile).subscribe((res) => {
      if(userDetails.role === 'STUDENT') {
        this.router.navigateByUrl('/contents');
      } else if(userDetails.role === 'TEACHER') {
        this.router.navigateByUrl('/teacher/dashboard');
      }
      
    });

  }

}
