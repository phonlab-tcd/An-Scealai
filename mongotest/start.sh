#!/bin/sh
cat ./mongotest/mongotest.conf
mongod \
  --config ./mongotest/mongotest.conf \
  --logpath ./mongotest/logs/log \
  --dbpath ./mongotest/db/
