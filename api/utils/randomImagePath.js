

const path = require('path');
const fs = require('fs').promises;

const root = path.join(__dirname,'..','..','picture_description','images');

let themes = ['dog'];
let images = [['001.png']];

function getRandomIndex(length){
  return Math.floor(Math.random() * length);
}

module.exports = () => {
  const t = getRandomIndex(themes.length);
  const i = getRandomIndex(images[t].length);
  return path.join(themes[t],images[t][i]);
}

(async function refresh() {
  console.log('REFRESHING IMAGE PATHS');
  const _themes = await fs.readdir(__dirname+'/../../picture_description/images');
  const _images = await Promise.all(
    _themes.map(theme=>{
      console.log('reading dir',theme);
      return fs.readdir(path.join(root,theme));
    })
  );
  console.log(_themes);
  console.log(_images);
  themes = _themes;
  images = _images;
  setTimeout(refresh,60*60*1000);
})();

(function tryit(){
  console.log(module.exports());
  setTimeout(tryit,1000);
})()
