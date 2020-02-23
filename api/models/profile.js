const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Profile = new Schema({
    userId : String,
    gender : String,
    age : String,
    county : String,
    notFromIreland : Boolean,
    country : String,
    school : String,
    nativeSpeakerStatus : String,
    dialectPreference : String,
    spokenComprehensionLevel : String,
    cefrLevel : String,
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