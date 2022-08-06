
const request = require('request');
const abairBaseUrl = require('../abair_base_url.cjs');
const logger = require('../logger.cjs');
// querystring is native to node.js
const querystring = require('querystring');
const { GramadoirCache, GramadoirStoryHistory } = require('../models/gramadoir');
const Story = require('../models/story.cjs');
const User = require('../models/user.cjs');
const { API400Error } = require('./APIError.cjs');


const either = Object.freeze([ok=>({ok}),err=>({err})]);

//  @description - grammar tags into db
//
//  @param {string} text
//
//  @param {[quill-highlight-tag]} qtags
async function upsertGramadoirCacheItem(text, qtags) {
  if(!(qtags instanceof Array)) throw new API400Error('qtags must be array');
  const query = {text};
  const update = {grammarTags: qtags};
  const opts = {upsert:true,new:true};
  const cacheItem = await GramadoirCache.findOneAndUpdate(query,update,opts)
    .then(...either);
  if(cacheItem.err) throw cacheItem.err;
  return cacheItem.ok;
}

//  @description - story version grammar errors update 
//
//  @param {ObjectId} storyId
//
//  @param {ObjectId} userId
//
//  @param {ObjectId} gramadoirCacheId
//
//  @param {string | falsy} timestamp - falsy means now, string
//      will be coerced to Date
async function upsertStoryGramadoirVersion(
  storyId, userId, gramadoirCacheId, timestamp) {
  const story = Story.findOne({_id: storyId});
  const user = User.findOne({_id: userId});
  const gram = GramadoirCache.findOne({_id: gramadoirCacheId});
  if(!(await story)) throw new Error('storyId invalid in upsertStoryGramadoirVersion');
  if(!(await user))  throw new Error('userId invalid in upsertStoryGramadoirVersion');
  if(!(await gram))  throw new Error('gramadoirCacheId invalid in upsertStoryGramadoirVersion');

  return new Promise((resolve,reject) => {
    GramadoirStoryHistory.findOneAndUpdate(
        { userId: userId,
          storyId: storyId, },
        { $push:
          {versions:
            { gramadoirCacheId: gramadoirCacheId,
              timestamp: timestamp || new Date(),
            }
          }
        },
        { upsert: true, new: true },
        (err)=>{
          if(err) { return reject(err) }
          return resolve();
        }
      );
    });
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

module.exports.requestGrammarTags = requestGrammarTags;
module.exports.upsertGramadoirCacheItem = upsertGramadoirCacheItem;
module.exports.upsertStoryGramadoirVersion = upsertStoryGramadoirVersion;
