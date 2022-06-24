import mongoose from 'mongoose';
import { modelOptions, prop, getModelForClass, Ref} from '@typegoose/typegoose';

class Messages {
  @prop() ga?: string;
  @prop() en?: string;
}

class QuillHighlightTag {
  @prop() start?: number;
  @prop() length?: number;
  @prop() type?: string; // TODO enumerate gramadoir tag types
  @prop() messages?: Messages;
}

@modelOptions({schemaOptions: {collection: 'gramadoir.cache'}})
export class GramadoirCache {
  @prop({unique: true, required: true})
  text?: string;

  @prop({type: ()=>[QuillHighlightTag]})
  grammarTags?: [];
}

export class GramadoirCacheLink{
  @prop({ref: ()=>GramadoirCache})
  gramadoirCacheId: Ref<GramadoirCache>

  @prop()
  timestamp?: Date;
}


@modelOptions({schemaOptions: {collection: 'gramadoir.story.history'}})
class GramadoirStoryHistory {
    @prop({required: true})
    userId?: mongoose.Types.ObjectId;

    @prop({required: true})
    storyId?: mongoose.Types.ObjectId;

    @prop({type: ()=>[GramadoirCacheLink]})
    versions?: [GramadoirCacheLink];
}


module.exports = {
  GramadoirCache:         getModelForClass(GramadoirCache),
  GramadoirStoryHistory:  getModelForClass(GramadoirStoryHistory),
}
