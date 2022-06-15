#!/bin/sh
pwd
cat ./mongotest/mongotest.conf
mkdir -p ./mongotest/logs
echo "" > ./mongotest/logs/log
mongod \
  --config ./mongotest/mongotest.conf \
  --logpath ./mongotest/logs/log \
  --dbpath ./mongotest/db/
