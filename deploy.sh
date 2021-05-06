#!/bin/bash

# Pull latest code from git repo
git pull

# String replace backend address in abairconfig.json
sed -i 's/http:\/\/localhost:4000\//https:\/\/www.abair.tcd.ie\/anscealaibackend\//' src/abairconfig.json

# Build to dist/ directory with /scealai/ as base href
ng build --prod --base-href /scealai/
