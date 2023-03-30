const recordingUtil = require('./recordingUtils');

describe('voiceRecording.filesCollection()',()=>{
  it('returns a string ending in .files',()=>{
    const col = recordingUtil.filesCollection();
    expect(col.endsWith('.files')).toBe(true);;
  });
});

describe('recordingUtil.file(_id)',()=>{
  it('gets file doc with valid id', async ()=>{
    const uploadId = await recordingUtil
      .upload(Buffer.from('hello'),'filename');
    const f = await recordingUtil.file(uploadId);
    expect(f._id.toString()).toBe(uploadId.toString());
  });
});