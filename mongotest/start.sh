#!/bin/sh
cat ./mongotest/mongotest.conf
echo "" > ./mongotest/logs/log
mongod \
  --config ./mongotest/mongotest.conf \
  --logpath ./mongotest/logs/log \
  --dbpath ./mongotest/db/
