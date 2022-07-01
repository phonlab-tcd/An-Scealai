import { prop, getModelForClass, modelOptions} from '@typegoose/typegoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Feedback {
  @prop() text?: string;
  @prop() seenByStudent?: boolean;
  @prop() audioId?: string;
}

@modelOptions({schemaOptions: {collection: 'story'}})
class Story {
  @prop()               title?: string;
  @prop()               dialect?: string;
  @prop()               text?: string;
  @prop()               htmlText?: string;
  @prop()               author?: string;
  @prop()               studentId?: string;
  @prop()               activeRecording?: string;
  @prop()               date?: Date;
  @prop()               lastUpdated?: Date;
  @prop({default: {}})  feedback?: Feedback;
}

export default getModelForClass(Story); 
module.exports = getModelForClass(Story);
