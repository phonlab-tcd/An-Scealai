#!/bin/bash

# Pull latest code from git repo
git pull
git checkout master

# Clean install node dependencies
rm -r ngapp/node_modules
npm install --prefix ./ngapp
rm -r api/node_modules
npm install --prefix ./api

# String replace backend address in abairconfig.json
sed -i 's/http:\/\/localhost:4000\//https:\/\/www.abair.tcd.ie\/anscealaibackend\//' src/abairconfig.json

# Build to dist/ directory with /scealai/ as base href
npm --prefix ngapp run build
