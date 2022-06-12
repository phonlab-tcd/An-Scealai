import { describe, it }         from 'vitest';
import { afterAll, beforeAll }  from 'vitest';
import { randomString }         from '../utils/randomString.js';
import { MongoMemoryServer }    from 'mongodb-memory-server';
import   User                   from './user.js'
import   mongoose               from 'mongoose';

const mongod = MongoMemoryServer.create();
beforeAll(async ()=>{
  const m = await mongod;
  const uri = m.getUri();
  await mongoose.connect(uri);
});

afterAll(async ()=>{
  const m = await mongod;
  m.stop(); 
});

describe('user model',()=>{
  it('creates a user on the db', async ()=>{
    const username = randomString();
    await User.create({username}); 
  });
});


