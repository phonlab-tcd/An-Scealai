import { describe , it, expect } from "@jest/globals";
import * as recordingUtil from "./recordingUtils";

describe('voiceRecording.filesCollection()',()=>{
  it('returns a string ending in .files',()=>{
    const col = recordingUtil.filesCollection();
    expect(col.endsWith('.files')).toBe(true);;
  });
});

describe('recordingUtil.file(_id)',()=>{
  it('gets file doc with valid id', async ()=>{
    const uploadId = await recordingUtil
    // @ts-ignore
      .upload(Buffer.from('hello'),'filename', {}, 'voiceRecording');
    const f = await recordingUtil.file(uploadId, 'voiceRecording');
    // @ts-ignore
    expect(f._id.toString()).toBe(uploadId.toString());
  });
});