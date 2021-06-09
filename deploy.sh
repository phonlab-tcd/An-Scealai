#!/bin/bash

# Pull latest code from git repo
# Maybe we should hold off on pulling automatically until we have a good test suite
#git pull
#git checkout master

# install node dependencies
# Not sure if we should delete node_modules before installing.
npm install --prefix ./ngapp
npm install --prefix ./api

# String replace backend address in abairconfig.json   
# (Now done in ngapp's package.json)
#sed -i 's/http:\/\/localhost:4000\//https:\/\/www.abair.tcd.ie\/anscealaibackend\//' ngapp/src/abairconfig.json

# Build to ngapp/unpublished_dist/ directory with /scealai/ as base href
npm --prefix ngapp run build_prod

if [ $? != 0 ] ; then
  echo "I think the build failed. Exiting deployment."
  exit 1
fi

# Use current date in name of backup folder
CURRENT_DATE=`date +"%d_%m_%Y_%T"`

# Create a backup of the live site with the current date in the name
BACKUP_DIR_NAME=./dist/backup_${CURRENT_DATE}
echo "Moving ./dist/an-scealai to ${BACKUP_DIR_NAME}" 
mv ./dist/an-scealai ${BACKUP_DIR_NAME}

echo "Copying ./ngapp/unpublished_dist to ./dist/an-scealai"
cp -r ./ngapp/unpublished_dist ./dist/an-scealai
