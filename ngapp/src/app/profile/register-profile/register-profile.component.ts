import { Component, OnInit } from "@angular/core";
import { ProfileService } from "app/core/services/profile.service";
import { AuthenticationService, UserDetails, } from "app/core/services/authentication.service";
import { Router } from "@angular/router";
import { TranslationService } from "app/core/services/translation.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Profile, AGES, GENDERS, COUNTIES, SCHOOL_TYPES, STUDENT_SCHOOL_LEVELS, PRIMARY_YEARS,
   SECONDARY_YEARS, THIRD_LEVEL_STUDIES, THIRD_LEVEL_YEARS, USA_IRISH_STUDIES, IMMERSION_OPTIONS,
    TEACHER_SCHOOL_LEVELS, NATIVE_SPEAKER_STATUS, DIALECTS, COMPREHENSION_LEVELS, HOW_OFTEN,
     WHO_SPEAK_WITH, IRISH_MEDIA_OPTIONS, IRISH_READING_OPTIONS, IRISH_WRITING_OPTIONS, SYNTH_OPINION, } from "app/core/models/profile";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: "app-register-profile",
  templateUrl: "./register-profile.component.html",
  styleUrls: ["./register-profile.component.scss"],
})
export class RegisterProfileComponent implements OnInit {
  constructor(
    private profileService: ProfileService,
    public auth: AuthenticationService,
    private router: Router,
    public ts: TranslationService
  ) {}

  userDetails: UserDetails | null = null;

  genderOptions = GENDERS;
  gender: (typeof GENDERS)[number] = this.genderOptions[0];

  ageOptions = AGES;
  age: (typeof AGES)[number] = this.ageOptions[0];

  countyOptions = COUNTIES;
  county: (typeof COUNTIES)[number] = this.countyOptions[0];

  notFromIreland: boolean = false;
  country: string = "";

  schoolTypeOptions = SCHOOL_TYPES;
  studentSchoolType: (typeof SCHOOL_TYPES)[number] = this.schoolTypeOptions[0];

  studentSchoolLevelOptions = STUDENT_SCHOOL_LEVELS;
  studentSchoolLevel: (typeof STUDENT_SCHOOL_LEVELS)[number] = this.studentSchoolLevelOptions[0];

  primaryYearOptions = PRIMARY_YEARS;
  primaryYear: (typeof PRIMARY_YEARS)[number] = this.primaryYearOptions[0];

  secondaryYearOptions = SECONDARY_YEARS;
  secondaryYear: (typeof SECONDARY_YEARS)[number] = this.secondaryYearOptions[0];

  thirdLevelOptions = THIRD_LEVEL_STUDIES;
  thirdLevelOption: (typeof THIRD_LEVEL_STUDIES)[number] = this.thirdLevelOptions[0];

  thirdLevelYearOptions = THIRD_LEVEL_YEARS;
  thirdLevelYear: (typeof THIRD_LEVEL_YEARS)[number] = this.thirdLevelYearOptions[0];

  postGradYear:
    | (typeof THIRD_LEVEL_YEARS)[0]
    | (typeof THIRD_LEVEL_YEARS)[1]
    | (typeof THIRD_LEVEL_YEARS)[4] = this.thirdLevelYearOptions[0];

  usaIrishStudiesOptions = USA_IRISH_STUDIES;
  usaIrishStudies: (typeof USA_IRISH_STUDIES)[number] = USA_IRISH_STUDIES[0];

  otherCountryOfStudy: string = "";
  otherPostGradStudies: string = "";

  immersionOptions = IMMERSION_OPTIONS;
  inImmersionCourse: (typeof IMMERSION_OPTIONS)[number] = this.immersionOptions[0];

  teacherSchoolLevels = TEACHER_SCHOOL_LEVELS;
  teacherPrimarySchoolType: (typeof SCHOOL_TYPES)[number] = this.schoolTypeOptions[0];
  teacherSecondarySchoolType: (typeof SCHOOL_TYPES)[number] = this.schoolTypeOptions[0];

  nativeSpeakerStatusOptions = NATIVE_SPEAKER_STATUS;
  nativeSpeakerStatus: (typeof NATIVE_SPEAKER_STATUS)[number] = this.nativeSpeakerStatusOptions[0];

  dialectPreferenceOptions = DIALECTS;
  dialectPreference: (typeof DIALECTS)[number] = this.dialectPreferenceOptions[0];

  spokenComprehensionLevelOptions = COMPREHENSION_LEVELS;
  spokenComprehensionLevel: (typeof COMPREHENSION_LEVELS)[number] = this.spokenComprehensionLevelOptions[0];

  yearsOfIrish: number | null = null;
  otherLanguages: string = "";
  fatherNativeTongue: string = "";
  motherNativeTongue: string = "";
  otherLanguageProficiency: string = "";

  howOftenOptions = HOW_OFTEN;
  howOftenSpeakIrish: (typeof HOW_OFTEN)[number] = this.howOftenOptions[0];

  speakWithOptions = WHO_SPEAK_WITH;
  whoSpeakWith: (typeof WHO_SPEAK_WITH)[number] = this.speakWithOptions[0];

  irishMedia = IRISH_MEDIA_OPTIONS;
  irishReading = IRISH_READING_OPTIONS;
  irishWriting = IRISH_WRITING_OPTIONS;

  howOftenMedia: (typeof HOW_OFTEN)[number] = this.howOftenOptions[0];
  howOftenReading: (typeof HOW_OFTEN)[number] = this.howOftenOptions[0];
  howOftenWriting: (typeof HOW_OFTEN)[number] = this.howOftenOptions[0];

  synthOpinions = SYNTH_OPINION;
  synthOpinion: (typeof SYNTH_OPINION)[number] = this.synthOpinions[0];

  /**
   * See if the user has checked any of the boxes for either Irish
   * Media, Reading, or Writing
   * @param objectOfItems keys are items and values are true/false
   * @returns true if at least one item is true, otherwise false
   */
  anyItemsChecked( objectOfItems: | typeof IRISH_MEDIA_OPTIONS | typeof IRISH_WRITING_OPTIONS | typeof IRISH_READING_OPTIONS ) {
    return Object.values(objectOfItems).some((item) => item);
  }

  /**
   * Get any previous profile information already saved for the user
   */
  ngOnInit() {
    this.userDetails = this.auth.getUserDetails();
    if (!this.userDetails) return;

    this.profileService.getForUser(this.userDetails._id).subscribe({
      next: (res) => {
        const p: Profile = res.profile;
        console.log(p);
        this.gender = p.gender;
        this.age = p.age;
        this.county = p.county;
        this.notFromIreland = p.notFromIreland;
        this.country = p.country;

        this.studentSchoolType = p.studentSchoolType;
        this.studentSchoolLevel = p.studentSchoolLevel;
        this.primaryYear = p.primaryYear;
        this.secondaryYear = p.secondaryYear;
        this.thirdLevelOption = p.thirdLevelStudies;
        this.thirdLevelYear = p.thirdLevelYear;
        this.postGradYear = p.postGradYear;
        this.otherPostGradStudies = p.otherPostGradStudies;
        this.usaIrishStudies = p.usaIrishStudies;
        this.otherCountryOfStudy = p.otherCountryOfStudy;
        this.inImmersionCourse = p.inImmersionCourse;

        this.teacherPrimarySchoolType = p.teacherPrimarySchoolType ?? this.teacherPrimarySchoolType;
        this.teacherSecondarySchoolType = p.teacherSecondarySchoolType ?? this.teacherSecondarySchoolType;
        this.teacherSchoolLevels = p.teacherSchoolLevels ?? this.teacherSchoolLevels;

        this.nativeSpeakerStatus = p.nativeSpeakerStatus;
        this.dialectPreference = p.dialectPreference;
        this.spokenComprehensionLevel = p.spokenComprehensionLevel;
        this.yearsOfIrish = p.yearsOfIrish;
        (this.otherLanguages = p.otherLanguages),
          (this.fatherNativeTongue = p.fatherNativeTongue);
        this.motherNativeTongue = p.motherNativeTongue;
        this.otherLanguageProficiency = p.otherLanguageProficiency;

        this.howOftenSpeakIrish = p.howOftenSpeakIrish;
        this.whoSpeakWith = p.whoSpeakWith;
        this.irishMedia = p.irishMedia;
        this.irishReading = p.irishReading;
        this.irishWriting = p.irishWriting;
        this.howOftenMedia = p.howOftenMedia;
        this.howOftenReading = p.howOftenReading;
        this.howOftenWriting = p.howOftenWriting;
        this.synthOpinion = p.synthOpinion;
      },
      error: () => {
        console.log("no profile");
      },
    });
  }

  /**
   * Save profile information data to the DB and reroute the user
   */
  saveDetails() {
    const userDetails = this.auth.getUserDetails();
    if (!userDetails) return;

    const newProfile: Profile = {
      ownerId: userDetails._id,
      gender: this.gender,
      age: this.age,
      county: this.county,
      notFromIreland: false,
      country: this.country,
      studentSchoolType: this.studentSchoolType,
      studentSchoolLevel: this.studentSchoolLevel,
      primaryYear: this.primaryYear,
      secondaryYear: this.secondaryYear,
      thirdLevelStudies: this.thirdLevelOption,
      thirdLevelYear: this.thirdLevelYear,
      usaIrishStudies: this.usaIrishStudies,
      otherCountryOfStudy: this.otherCountryOfStudy,
      otherPostGradStudies: this.otherPostGradStudies,
      postGradYear: this.postGradYear,
      inImmersionCourse: this.inImmersionCourse,
      teacherSchoolLevels: this.teacherSchoolLevels,
      teacherPrimarySchoolType: this.teacherPrimarySchoolType,
      teacherSecondarySchoolType: this.teacherSecondarySchoolType,
      nativeSpeakerStatus: this.nativeSpeakerStatus,
      dialectPreference: this.dialectPreference,
      spokenComprehensionLevel: this.spokenComprehensionLevel,
      yearsOfIrish: this.yearsOfIrish,
      otherLanguages: this.otherLanguages,
      fatherNativeTongue: this.fatherNativeTongue,
      motherNativeTongue: this.motherNativeTongue,
      otherLanguageProficiency: this.otherLanguageProficiency,
      howOftenSpeakIrish: this.howOftenSpeakIrish,
      whoSpeakWith: this.whoSpeakWith,
      irishMedia: this.irishMedia,
      irishReading: this.irishReading,
      irishWriting: this.irishWriting,
      howOftenMedia: this.howOftenMedia,
      howOftenReading: this.howOftenReading,
      howOftenWriting: this.howOftenWriting,
      synthOpinion: this.synthOpinion,
    };

    // save profile and route user to homepage
    this.profileService.create(newProfile).subscribe({
      next: () => {},
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        if (userDetails.role === "STUDENT") {
          this.router.navigateByUrl("/student");
        } else if (userDetails.role === "TEACHER") {
          this.router.navigateByUrl("/teacher");
        }
      },
    });
  }
}
