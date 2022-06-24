
const request = require('request');
const abairBaseUrl = require('../util/abair_base_url');
const logger = require('../util/logger');
// querystring is native to node.js
const querystring = require('querystring');
const { GramadoirCache, GramadoirStoryHistory } = require('../model/gramadoir');
const Story = require('../model/story');
const User = require('../model/user');
const API400Error = require('../util/APIError');
const mongoose = require('mongoose');


const mustBeArray=()=>new API400Error('qtags must be array');
function reject(e) { return new Promise((_,rej)=>rej(e)) }

//  @description - grammar tags into db
//
//  @param {string} text
//
//  @param {[quill-highlight-tag]} qtags
async function upsertGramadoirCacheItem(text, qtags) {
  if(!(qtags instanceof Array)) return reject(mustBeArray());
  return new Promise((resolve,reject) => {
    GramadoirCache.findOneAndUpdate(
      { text: text },
      { grammarTags: qtags },
      { upsert: true, new: true },
      (err,doc)=>{
        if (err) { return reject(err) }
        return resolve(doc)
      });
  });
}


async function upsertStoryGramadoirVersion({storyId, userId, gramadoirCacheId, timestamp}) {
  console.log('storyId',storyId);
  console.log(await Story.find());
  const story = await Story.findById(storyId);
  const [user,gram] = await Promise.all([
    User.findById(new mongoose.Types.ObjectId(userId)),
    GramadoirCache.findById(gramadoirCacheId),
  ]);
  if(!story) return reject('storyId invalid in upsertStoryGramadoirVersion');
  if(!user)  return reject('userId invalid in upsertStoryGramadoirVersion');
  if(!gram)  return reject('gramadoirCacheId invalid in upsertStoryGramadoirVersion');

  const query = {userId,storyId};
  timestamp = timestamp || new Date();
  const versions = {gramadoirCacheId,timestamp};
  const operation = {$push: {versions}};
  const opts = {upsert:true,new:true};
  return GramadoirStoryHistory
    .findOneAndUpdate(query,operation,opts);
}

/** @description - Get a promise which resolves to a
 *    list of tags describing grammar errors in the given text.
 * The grammar tags are written in the language passed in.
 *
 * @param {string} text - The Irish
 *    language text which will be checked for errors.
 *
 * @param {'ga' | 'en'} language - The iso
 *    language code to of the language to describe the errors in. 'ga' or 'en'.
 *
 * @return {Promise} - resolves to an array of grammar tags.
e*    rejects to a request error.
 */
function requestGrammarTags(text, language) {
  return new Promise( (resolve, reject) => {
    const form = {
      teacs: text.replace(/\n/g, ' '),
      teanga: language,
    };

    const formData = querystring.stringify(form);

    logger.info({function: 'requestGrammarTags', formData: formData});

    request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // uri: 'https://cadhan.com/api/gramadoir/1.0',
      uri: abairBaseUrl + '/cgi-bin/api-gramadoir-1.0.pl',
      body: formData,
      method: 'POST',
    }, (err, resp, grammarTags) => {
      if (err) {
        logger.error(err);
        return reject(err);
      } else {
        return resolve(grammarTags);
      }
    });
  });
}

module.exports = {
  requestGrammarTags,
  upsertGramadoirCacheItem,
  upsertStoryGramadoirVersion,
};
