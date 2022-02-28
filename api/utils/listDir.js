const fs = require('fs');
const path = require('path');
module.exports.fromRoot = (p) => {
  return new Promise((resolve,reject) => {
    fs.readdir(path.join(require.main.path,p),(err,list)=>{
      err ? reject(err) : resolve(list);
    }); 
  });
}
