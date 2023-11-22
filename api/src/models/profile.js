const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Profile = new Schema({
    ownerId: { type: mongoose.Types.ObjectId, ref: 'User' },
    gender : String,
    age : String,
    county : String,
    notFromIreland : Boolean,
    country : String,
    
    studentSchoolType: String,
    studentSchoolLevel: String,
    primaryYear: String,
    secondaryYear: String,
    thirdLevelStudies: String,
    thirdLevelYear: String,
    usaIrishStudies: String,
    otherCountryOfStudy: String,
    otherPostGradStudies: String,
    postgradYear: String,
    inImmersionCourse: String,

    teacherSchoolTypes: {
      primary: Boolean,
      secondary: Boolean,
      thirdLevel : Boolean,
      gaeltacht : Boolean
    },
    teacherPrimarySchoolType: String,
    teacherSecondarySchoolType: String,

    nativeSpeakerStatus : String,
    dialectPreference : String,
    spokenComprehensionLevel : String,
    yearsOfIrish : String,
    otherLanguages: String,
    fatherNativeTongue: String,
    motherNativeTongue: String,
    otherLanguageProficiency: String,
    howOftenSpeakIrish : String,
    whoSpeakWith : String,

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
    collection: 'profile',
    timestamps: true,
});

module.exports = mongoose.model('Profile', Profile);