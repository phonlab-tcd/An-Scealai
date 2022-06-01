#!/bin/sh
pwd
cat ./mongotest/conf.yml
mkdir -p ./mongotest/logs
echo "" > ./mongotest/logs/log
mongod \
  --config ./mongotest/conf.yml \
  --logpath ./mongotest/logs/log \
  --dbpath ./mongotest/db/
