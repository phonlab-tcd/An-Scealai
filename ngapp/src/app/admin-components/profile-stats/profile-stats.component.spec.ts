import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileStatsComponent } from './profile-stats.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterPipe } from '../../pipes/filter.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileStatsComponent', () => {
  let component: ProfileStatsComponent;
  let fixture: ComponentFixture<ProfileStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ ProfileStatsComponent, FilterPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should calculate the total values for each profile field', () => {
    let profile1 = {"age" : "30-39",
                  	"country" : "Ireland",
                  	"county" : "Contae Chill Dara",
                  	"dialectPreference" : "Gaeilge Chonnact",
                  	"fatherNativeTongue" : "English",
                  	"gender" : "Prefer not to say",
                  	"howOftenMedia" : "",
                  	"howOftenReading" : "",
                  	"howOftenWriting" : "",
                  	"immersionCourse" : "Yes",
                  	"irishMedia" : {
                  		"rnag" : false,
                  		"tg4" : false,
                  		"bbcUladh" : false,
                  		"rnalife" : false,
                  		"radioRiRa" : false,
                  		"socialMedia" : false
                  	},
                  	"irishReading" : {
                  		"newspapers" : false,
                  		"socialMedia" : false,
                  		"books" : false
                  	},
                  	"irishWriting" : {
                  		"email" : false,
                  		"socialMedia" : false,
                  		"blog" : false,
                  		"teachingMaterial" : false,
                  		"articles" : false,
                  		"shortStories" : false,
                  		"books" : false,
                  		"poetry" : false
                  	},
                  	"motherNativeTongue" : "English",
                  	"nativeSpeakerStatus" : "Bilingual (native)",
                  	"notFromIreland" : false,
                  	"otherCountryOfStudy" : null,
                  	"otherLanguageProficiency" : "french, german",
                  	"otherLanguages" : "miaou 80%, miew 20%",
                  	"otherPostgradStudies" : "Culinary",
                  	"otherStudies" : null,
                  	"postgradYear" : null,
                  	"primaryYear" : null,
                  	"secondaryYear" : null,
                  	"speakWith" : "Native speakers",
                  	"speakingFrequency" : "A few times a month",
                  	"spokenComprehensionLevel" : "A few words when spoken slowly",
                  	"studentSchoolLevel" : "I am a postgraduate student",
                  	"studentSchoolType" : "",
                  	"synthOpinion" : "I don't like them",
                  	"teacherPrimaryType" : null,
                  	"teacherSchoolTypes" : {
                  		"primary" : false,
                  		"secondary" : false,
                  		"thirdLevel" : false,
                  		"gaeltacht" : false
                  	},
                  	"teacherSecondaryType" : null,
                  	"thirdLevelOption" : null,
                  	"thirdLevelYear" : null,
                  	"usaOption" : null,
                  	"yearsOfIrish" : "4"};
                    
                    
    let profile2 = {"age" : "30-39",
                  	"country" : "Ireland",
                  	"county" : "Contae Chill Dara",
                  	"dialectPreference" : "Gaeilge Chonnact",
                  	"fatherNativeTongue" : "English",
                  	"gender" : "Prefer not to say",
                  	"howOftenMedia" : "",
                  	"howOftenReading" : "",
                  	"howOftenWriting" : "",
                  	"immersionCourse" : "Yes",
                  	"irishMedia" : {
                  		"rnag" : false,
                  		"tg4" : false,
                  		"bbcUladh" : false,
                  		"rnalife" : false,
                  		"radioRiRa" : false,
                  		"socialMedia" : false
                  	},
                  	"irishReading" : {
                  		"newspapers" : false,
                  		"socialMedia" : false,
                  		"books" : false
                  	},
                  	"irishWriting" : {
                  		"email" : false,
                  		"socialMedia" : false,
                  		"blog" : false,
                  		"teachingMaterial" : false,
                  		"articles" : false,
                  		"shortStories" : false,
                  		"books" : false,
                  		"poetry" : false
                  	},
                  	"motherNativeTongue" : "English",
                  	"nativeSpeakerStatus" : "Bilingual (native)",
                  	"notFromIreland" : false,
                  	"otherCountryOfStudy" : null,
                  	"otherLanguageProficiency" : "french, german",
                  	"otherLanguages" : "miaou 80%, miew 20%",
                  	"otherPostgradStudies" : "Culinary",
                  	"otherStudies" : null,
                  	"postgradYear" : null,
                  	"primaryYear" : null,
                  	"secondaryYear" : null,
                  	"speakWith" : "Native speakers",
                  	"speakingFrequency" : "A few times a month",
                  	"spokenComprehensionLevel" : "A few words when spoken slowly",
                  	"studentSchoolLevel" : "I am a postgraduate student",
                  	"studentSchoolType" : "",
                  	"synthOpinion" : "I don't like them",
                  	"teacherPrimaryType" : null,
                  	"teacherSchoolTypes" : {
                  		"primary" : false,
                  		"secondary" : false,
                  		"thirdLevel" : false,
                  		"gaeltacht" : false
                  	},
                  	"teacherSecondaryType" : null,
                  	"thirdLevelOption" : null,
                  	"thirdLevelYear" : null,
                  	"usaOption" : null,
                  	"yearsOfIrish" : "4"};
  
    let profile3 = {"age" : "30-39",
                  	"country" : "Ireland",
                  	"county" : "Contae Chill Dara",
                  	"dialectPreference" : "Gaeilge Chonnact",
                  	"fatherNativeTongue" : "English",
                  	"gender" : "Prefer not to say",
                  	"howOftenMedia" : "",
                  	"howOftenReading" : "",
                  	"howOftenWriting" : "",
                  	"immersionCourse" : "Yes",
                  	"irishMedia" : {
                  		"rnag" : false,
                  		"tg4" : false,
                  		"bbcUladh" : false,
                  		"rnalife" : false,
                  		"radioRiRa" : false,
                  		"socialMedia" : false
                  	},
                  	"irishReading" : {
                  		"newspapers" : false,
                  		"socialMedia" : false,
                  		"books" : false
                  	},
                  	"irishWriting" : {
                  		"email" : false,
                  		"socialMedia" : false,
                  		"blog" : false,
                  		"teachingMaterial" : false,
                  		"articles" : false,
                  		"shortStories" : false,
                  		"books" : false,
                  		"poetry" : false
                  	},
                  	"motherNativeTongue" : "English",
                  	"nativeSpeakerStatus" : "Bilingual (native)",
                  	"notFromIreland" : false,
                  	"otherCountryOfStudy" : null,
                  	"otherLanguageProficiency" : "french, german",
                  	"otherLanguages" : "miaou 80%, miew 20%",
                  	"otherPostgradStudies" : "Culinary",
                  	"otherStudies" : null,
                  	"postgradYear" : null,
                  	"primaryYear" : null,
                  	"secondaryYear" : null,
                  	"speakWith" : "Native speakers",
                  	"speakingFrequency" : "A few times a month",
                  	"spokenComprehensionLevel" : "A few words when spoken slowly",
                  	"studentSchoolLevel" : "I am a postgraduate student",
                  	"studentSchoolType" : "",
                  	"synthOpinion" : "I don't like them",
                  	"teacherPrimaryType" : null,
                  	"teacherSchoolTypes" : {
                  		"primary" : false,
                  		"secondary" : false,
                  		"thirdLevel" : false,
                  		"gaeltacht" : false
                  	},
                  	"teacherSecondaryType" : null,
                  	"thirdLevelOption" : null,
                  	"thirdLevelYear" : null,
                  	"usaOption" : null,
                  	"yearsOfIrish" : "4"};
  
  
    let profiles = [profile1, profile2, profile3];
    
    let profileToBe = {"age": {"30-39":"3"}, 
                      "country": {"Ireland":"3"}, 
                      "county": {"Contae Chill Dara":"3"}, 
                      "dialectPreference": {"Gaeilge Chonnact":"3"}, 
                      "fatherNativeTongue": {"English":"3"},
                      "gender": {"Female":"3"},  
                      "howOftenMedia":{},
                      "howOftenReading":{},
                      "howOftenWriting":{},
                      "immersionCourse": {"Yes":"3"}, 
                      "irishMedia":{},
                      "irishReading":{},
                      "irishWriting":{},
                      "motherNativeTongue": {"English":"3"}, 
                      "nativeSpeakerStatus": {"Bilingual (native)":"3"}, 
                      "notFromIreland": {}, 
                      "otherCountryOfStudy": {}, 
                      "otherLanguageProficiency": {"french, german":"3"},
                      "otherLanguages": {"miaou 80%, miew 20%": "3"},
                      "otherPostgradStudies": {"Culinary": "3"},
                      "otherStudies": {},
                      "postgradYear": {},
                      "primaryYear": {},
                      "secondaryYear": {},
                      "speakWith": {"Native speakers": "3"},
                      "speakingFrequency": {"A few times a month": "3"},
                      "spokenComprehensionLevel": {"A few words when spoken slowly": "3"},
                      "studentSchoolLevel": {"I am a postgraduate student": "3"},
                      "studentSchoolType": {},
                      "synthOpinion": {"I don't like them": "3"},
                      "teacherPrimaryType": {},
                      "teacherSchoolTypes": {},
                      "teacherSecondaryType": {},
                      "thirdLevelOption": {},
                      "thirdLevelYear": {},
                      "usaOption": {},
                      "yearsOfIrish": {"4": "3"}};
    
    component.calculateStats(profiles);
    expect(component.dataToDisplay).toEqual(profileToBe);
  });

});
