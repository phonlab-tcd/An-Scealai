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
  thirdLevelStudies: (typeof THIRD_LEVEL_STUDIES)[number];
  thirdLevelYear: (typeof THIRD_LEVEL_YEARS)[number];
  usaIrishStudies: (typeof USA_IRISH_STUDIES)[number];
  otherCountryOfStudy: string;
  otherPostGradStudies: string;
  postGradYear: | (typeof THIRD_LEVEL_YEARS)[0] | (typeof THIRD_LEVEL_YEARS)[1] | (typeof THIRD_LEVEL_YEARS)[4];
  inImmersionCourse: (typeof IMMERSION_OPTIONS)[number];

  teacherSchoolLevels: typeof TEACHER_SCHOOL_LEVELS;
  teacherPrimarySchoolType: (typeof SCHOOL_TYPES)[number];
  teacherSecondarySchoolType: (typeof SCHOOL_TYPES)[number];

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
  "6-9",
  "10-19",
  "20-29",
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
  "Baile Átha Cliath",
  "Contae Átha Cliath",
  "Contae an Chabháin",
  "Contae Cheatharlach",
  "Contae Chiarraí",
  "Contae Chill Chainnigh",
  "Contae Chill Dara",
  "Contae Chill Mhantáin",
  "Contae an Chláir",
  "Contae Chorcaí",
  "Contae Dhún na nGall",
  "Contae na Gaillimhe",
  "Contae na hIarmhí",
  "Contae Laoise",
  "Contae Liatroma",
  "Contae Loch Garman",
  "Contae an Longfoirt",
  "Contae Lú",
  "Contae Luimnigh",
  "Contae Mhaigh Eo",
  "Contae na Mí",
  "Contae Mhuineacháin",
  "Contae Phort Láirge",
  "Contae Ros Comáin",
  "Contae Shligigh",
  "Contae Thiobraid Árann",
  "Contae Uíbh Fhailí",
  "Béal Feirste",
  "Contae Aontroma",
  "Contae Ard Mhacha",
  "Contae Dhoire",
  "Contae an Dúin",
  "Contae Thír Eoghain",
  "Contae Fhear Manach",
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
  "I am studying Irish in the USA",
  "I am studying Irish outside of Ireland or USA",
  "I am a postgraduate student",
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

export const THIRD_LEVEL_STUDIES = [
  "",
  "I am studying Irish",
  "I am studying Education Primary (with Irish as a major component)",
  "I am studying Education Primary (with Irish as a minor component)",
  "I am studying Education as a Postgraduate student",
  "Other",
] as const;

export const THIRD_LEVEL_YEARS = [
  "",
  "I am in 1st year",
  "I am in 2nd year",
  "I am in 3rd year of a 4 year course",
  "I am in final year",
  "Other",
] as const;

export const USA_IRISH_STUDIES = [
  "",
  "I am taking an Irish class at a University",
  "I am not enrolled in an Irish language class at a University",
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
  "Bilingual (native)",
  "Bilingual (other)",
] as const;

export const DIALECTS = [
  "",
  "Gaeilge Uladh",
  "Gaeilge Chonnact",
  "Gaolainn na Mumhan",
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
}

export const IRISH_MEDIA_OPTIONS: IrishMediaOptions = {
  rnag: false,
  tg4: false,
  bbcUladh: false,
  rnalife: false,
  radioRiRa: false,
  socialMedia: false,
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
