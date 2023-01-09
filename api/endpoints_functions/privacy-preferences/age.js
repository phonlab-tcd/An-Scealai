const mongoose = require('mongoose');
const schema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    range: {type: String, enum: ["under16","over16"]}
});
const model = mongoose.model('UserAge',schema);

export const get = async function(req,res,next) {
    const doc = await model.findOne({owner: req.user._id}).then(ok=>({ok}),err=>({err}));
    if(doc.err) return res.status(400).json();
    if(!doc.ok) return res.json("unknown");
    res.json(doc.ok.range);
}

export const post = async function(req,res,next) {
    const doc = await model
        .findOneAndUpdate({owner: req.user._id},{$set: {range: req.body.range}},{upsert: true, new: true})
        .then(ok=>({ok}),err=>({err}));
    console.log(doc);
    if(doc.err) return res.status(400).json();
    if(!doc.ok) return res.json("unknown");
    res.json(doc.ok.range);
}
