export interface Profile {
  _id?: string;
  ownerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  gender: (typeof GENDERS)[number];
  age: (typeof AGES)[number];
  county: (typeof COUNTIES)[number];
  notFromIreland: boolean;
  country: string;
  
  studentSchoolType: (typeof SCHOOL_TYPES)[number];
  studentSchoolLevel: (typeof STUDENT_SCHOOL_LEVELS)[number];
  primaryYear: (typeof PRIMARY_YEARS)[number];
  secondaryYear: (typeof SECONDARY_YEARS)[number];
  thirdLevelYear: (typeof THIRD_LEVEL_YEARS)[number];
  otherStudies: string;
  postgradYear: | (typeof THIRD_LEVEL_YEARS)[0] | (typeof THIRD_LEVEL_YEARS)[1] | (typeof THIRD_LEVEL_YEARS)[4];
  inImmersionCourse: (typeof IMMERSION_OPTIONS)[number];

  teacherSchoolLevels: typeof TEACHER_SCHOOL_LEVELS;
  teacherPrimarySchoolType: (typeof SCHOOL_TYPES)[number];
  teacherSecondarySchoolType: (typeof SCHOOL_TYPES)[number];
  teachingSubjects: string;

  nativeSpeakerStatus: (typeof NATIVE_SPEAKER_STATUS)[number];
  dialectPreference: (typeof DIALECTS)[number];
  spokenComprehensionLevel: (typeof COMPREHENSION_LEVELS)[number];
  yearsOfIrish: number | null;
  otherLanguages: string;
  fatherNativeTongue: string;
  motherNativeTongue: string;
  otherLanguageProficiency: string;
  howOftenSpeakIrish: (typeof HOW_OFTEN)[number];
  whoSpeakWith: (typeof WHO_SPEAK_WITH)[number];

  irishMedia: typeof IRISH_MEDIA_OPTIONS;
  irishReading: typeof IRISH_READING_OPTIONS;
  irishWriting: typeof IRISH_WRITING_OPTIONS;
  howOftenMedia: (typeof HOW_OFTEN)[number];
  howOftenReading: (typeof HOW_OFTEN)[number];
  howOftenWriting: (typeof HOW_OFTEN)[number];
  synthOpinion: (typeof SYNTH_OPINION)[number];
}

export const AGES = [
  "",
  "10-14",
  "15-19",
  "20-24",
  "25-29",
  "30-39",
  "40-49",
  "50-59",
  "60-69",
  "70-79",
  "80+",
] as const;

export const GENDERS = [
  "",
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
] as const;

export const COUNTIES = [
  "",
  "Dublin",
  "Cavan",
  "Carlow",
  "Kerry",
  "Kilkenny",
  "Kildare",
  "Wicklow",
  "Clare",
  "Cork",
  "Donegal",
  "Galway",
  "Westmeath",
  "Laois",
  "Leitrim",
  "Wexford",
  "Longford",
  "Louth",
  "Limerick",
  "Mayo",
  "Meath",
  "Monaghan",
  "Waterford",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Offaly",
  "Belfast",
  "Antrim",
  "Armagh",
  "Derry",
  "Down",
  "Tyrone",
  "Fermanagh"
] as const;

export const SCHOOL_TYPES = [
  "",
  "English school",
  "Gaelscoil",
  "Gaeltacht school",
  "I did not attend school in Ireland",
] as const;

export const STUDENT_SCHOOL_LEVELS = [
  "",
  "I am a primary school pupil",
  "I am a secondary school pupil",
  "I am a 3rd level student in Ireland",
  "I am a postgraduate student",
  "I am enrolled in an Irish class in the USA",
  "I am enrolled in an Irish class outside of Ireland/USA",
  "I am learning Irish independently"
] as const;

export const PRIMARY_YEARS = [
  "",
  "I am in 1st class",
  "I am in 2nd class",
  "I am in 3rd class",
  "I am in 4th class",
  "I am in 5th class",
  "I am in 6th class",
] as const;

export const SECONDARY_YEARS = [
  "",
  "I am in 1st year",
  "I am in 2nd year",
  "I am in 3rd year",
  "I am in 4th year",
  "I am in 5th year",
  "I am in 6th year",
] as const;

export const THIRD_LEVEL_YEARS = [
  "",
  "I am in 1st year",
  "I am in 2nd year",
  "I am in 3rd year of a 4 year course",
  "I am in final year",
  "Other",
] as const;

interface TeacherSchoolLevels {
  primary: boolean;
  secondary: boolean;
  thirdLevel: boolean;
  gaeltacht: boolean;
}

export const TEACHER_SCHOOL_LEVELS: TeacherSchoolLevels = {
  primary: false,
  secondary: false,
  thirdLevel: false,
  gaeltacht: false,
};

export const IMMERSION_OPTIONS = ["", "Yes", "No"] as const;

export const NATIVE_SPEAKER_STATUS = [
  "",
  "Yes",
  "No",
  "Bilingual",
] as const;

export const DIALECTS = [
  "",
  "Ulster",
  "Connaught",
  "Munster",
  "Other",
] as const;

export const COMPREHENSION_LEVELS = [
  "",
  "A few words when spoken slowly",
  "A few simple phrases when spoken slowly",
  "Parts of the conversation",
  "Most of the conversation when spoken clearly",
  "Almost everything when spoken at a normal pace",
] as const;

export const WHO_SPEAK_WITH = [
  "",
  "Learners and native speakers",
  "Native speakers",
  "Learners",
] as const;

interface IrishMediaOptions {
  rnag: boolean;
  tg4: boolean;
  bbcUladh: boolean;
  rnalife: boolean;
  radioRiRa: boolean;
  socialMedia: boolean;
  cula4: boolean;
  podcasts: boolean;
  rte: boolean;
}

export const IRISH_MEDIA_OPTIONS: IrishMediaOptions = {
  rnag: false,
  tg4: false,
  bbcUladh: false,
  rnalife: false,
  radioRiRa: false,
  socialMedia: false,
  cula4: false,
  podcasts: false,
  rte: false
};

interface IrishReadingOptions {
  newspapers: boolean;
  socialMedia: boolean;
  books: boolean;
}

export const IRISH_READING_OPTIONS: IrishReadingOptions = {
  newspapers: false,
  socialMedia: false,
  books: false,
};

interface IrishWritingOptions {
  email: boolean;
  socialMedia: boolean;
  blog: boolean;
  teachingMaterial: boolean;
  articles: boolean;
  shortStories: boolean;
  books: boolean;
  poetry: boolean;
}

export const IRISH_WRITING_OPTIONS: IrishWritingOptions = {
  email: false,
  socialMedia: false,
  blog: false,
  teachingMaterial: false,
  articles: false,
  shortStories: false,
  books: false,
  poetry: false,
};

export const HOW_OFTEN = [
  "",
  "Every day",
  "Every week but not every day",
  "A few times a month",
  "Hardly ever",
] as const;

export const SYNTH_OPINION = [
  "",
  "I don't like them",
  "They're okay, but I prefer a human voice",
  "I don't care if it is a computer or person",
  "Sometimes synthetic voices just fit",
  "Sometimes synthetic voices are better suited",
] as const;
