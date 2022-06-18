const voiceRecording = require('./voiceRecording');

describe('voiceRecording.filesCollection()',()=>{
  it('returns a string ending in .files',()=>{
    const col = voiceRecording.filesCollection();
    expect(col.endsWith('.files')).toBe(true);;
  });
});

describe('voiceRecording.file(_id)',()=>{
  it('gets file doc with valid id', async ()=>{
    const uploadId = await voiceRecording
      .upload(Buffer.from('hello'),'filename');
    const f = await voiceRecording.file(uploadId);
    expect(f._id.toString()).toBe(uploadId.toString());
  });
});
