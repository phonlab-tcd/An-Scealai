

const path = require('path');
const fs = require('fs').promises;
const _ = require('lodash');

const root = path.join(__dirname,'..','..','picture_description','images');

let themes = ['dog'];
let images = [['001.png']];
let allPaths = [path.join('image','dog','001.png')];

function getRandomIndex(length){
  return Math.floor(Math.random() * length);
}

module.exports = (n=1) => {
  return  _.sampleSize(allPaths, n);
}

(async function refresh() {
  const _themes = await fs.readdir(__dirname+'/../../picture_description/images');
  const _images = await Promise.all(
    _themes.map(theme=>{
      return fs.readdir(path.join(root,theme));
    })
  );
  allPaths = _.flatten(_images.map((list,idx)=>{
    return list.map((name) => path.join('image',_themes[idx],name))
  }));
  themes = _themes;
  images = _images;
  setTimeout(refresh,60*60*1000);
})();
