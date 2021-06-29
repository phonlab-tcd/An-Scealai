const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Profile = new Schema({
    userId : String,
    email: String,
    gender : String,
    age : String,
    county : String,
    notFromIreland : Boolean,
    country : String,
    studentSchoolType: String,
    studentSchoolLevel: String,
    primaryYear: String,
    secondaryYear: String,
    thirdLevelOption: String,
    thirdLevelYear: String,
    postgradYear: String,
    otherStudies: String,
    usaOption: String,
    otherCountryOfStudy: String,
    otherPostgradStudies: String,
    immersionCourse: Boolean,
    teacherPrimaryType: String,
    teacherSecondaryType: String,
    teacherSchoolName: String,
    teacherSchoolTypes: {
      primary: Boolean,
      secondary: Boolean,
      thirdLevel : Boolean,
      gaeltacht : Boolean
    },
    nativeSpeakerStatus : String,
    dialectPreference : String,
    spokenComprehensionLevel : String,
    yearsOfIrish : String,
    otherLanguages: String,
    fatherNativeTongue: String,
    motherNativeTongue: String,
    otherLanguageProficiency: String,
    speakingFrequency : String,
    speakWith : String,
    irishMedia : {
        rnag : Boolean,
        tg4 : Boolean,
        bbcUladh : Boolean,
        rnalife : Boolean,
        radioRiRa : Boolean,
        socialMedia : Boolean,
    },
    irishReading : {
        newspapers : Boolean,
        socialMedia : Boolean,
        books : Boolean,
    },
    irishWriting : {
        email : Boolean,
        socialMedia : Boolean,
        blog : Boolean,
        teachingMaterial : Boolean,
        articles : Boolean,
        shortStories : Boolean,
        books : Boolean,
        poetry : Boolean,
    },
    howOftenMedia : String,
    howOftenReading : String,
    howOftenWriting : String,
    synthOpinion : String,
}, {
    collection: 'profile'
});

module.exports = mongoose.model('Profile', Profile);