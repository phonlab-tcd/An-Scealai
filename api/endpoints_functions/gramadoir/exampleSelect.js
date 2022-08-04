const mongoose = require('mongoose');
const { GramadoirCache } = require('../../models/gramadoir');

const either = [ok=>({ok}),err=>({err})];

module.exports = async (req, res, next) => {
  let docs = await GramadoirCache.find({},{grammarTags: 1}).then(...either);
  if(docs.err) return next(docs.err);

  docs = docs.ok.flatMap(doc=>doc.grammarTags);
  docs = docs.flatMap(doc=>doc.type);
  let types = {};
  docs.forEach(type => types[type] = true);
  const style = `<style>.root {display: flex;}</style>`;
  types = Object.keys(types).sort();
  console.log(types);
  docs = types.map(type=> `
  <form  action="/gramadoir/example/${type}">
   <input type="submit" value="${type}"/>
  </form>`).reduce((a,b)=>a+b);
  return res.send(style + '<div class=root>' + docs + '</div>');;
}