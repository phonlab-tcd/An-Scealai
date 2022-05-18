#!/bin/sh
set -o errexit
cat ./mongotest/mongotest.conf
mongod \
  --config ./mongotest/mongotest.conf \
  --logpath ./mongotest/logs/log \
  --dbpath ./mongotest/db/ &

tail -f ./mongotest/logs/log

