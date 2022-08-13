const { ObjectId } = require('bson');
const { describe, it } = require('@jest/globals');
const Story = require('./story');

describe('story schema',()=>{
    it('create with owner', async()=>
        expect(Story.create({owner: ObjectId()}))
        .resolves
        .toBeDefined()
        );
    it('reject without an owner', async()=>
        expect(Story.create({}))
        .rejects.toThrow()
        );
});