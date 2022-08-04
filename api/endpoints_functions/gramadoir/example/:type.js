const mongoose = require('mongoose');
const { GramadoirCache } = require('../../../models/gramadoir');

const either = [ok=>({ok}),err=>({err})];

module.exports = async (req, res, next) => {
  let docs = await GramadoirCache.find({'grammarTags.type': req.params.type}).then(...either);
  if(docs.err) return next(docs.err);

  docs = docs.ok.flatMap(doc=>doc.grammarTags.filter(t=>t.type === req.params.type).map(tag => ({
    before: doc.text.slice(0,+ tag.start),
    during: doc.text.slice(+ tag.start, + tag.start + tag.length),
    after:  doc.text.slice(+ tag.start + tag.length),
    messages: tag.messages,
  })));

  const style = `
  <style>
  ul > div {
    background-color: rgba(100,255,100,0.8);
    margin: 4em;
    border-radius: 1em;
  }
  .text {
    width: 40%;
    text-align: justify
    padding: 1em;
  }
  .messages {
    width: 40%;
    padding: 1em;
  }
  .doc {
    display: flex;
    justify-content: space-evenly; 
  }
  </style>`

  docs = docs.map((doc,i) => `
  <div class=doc>
    <div class=text>
      <p>${doc.before}<span style="background-color: rgba(255,100,100,0.8)">${doc.during}</span>${doc.after}</p>
    </div>
    <div class=messages>
      <p>${doc.messages.ga}</p>
      <p>${doc.messages.en}</p>
    </div>
  </div>`).reduce((a,b)=>a+b);
  return res.send(style + '<ul>' + docs + '</ul>');;
}