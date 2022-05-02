#! /bin/bash

# IT MIGHT BE NECESSARY TO KILL MONGOD NODE AND ANGULAR BEFORE RUNNING THIS SCRIPT

tmux new-session -s "an-scealai" -d

tmux send "cat ./mongotest/mongotest.conf && mongod --config ./mongotest/mongotest.conf --logpath ./mongotest/logs/log --dbpath ./mongotest/db/" C-m
tmux rename-window "mongod"

# This command requires tail and jq. jq is a json colorizer/formatter

# Check if running jq returned 0 meaning it's installed
jq --version > /dev/null
has_jq=$?
if [ $has_jq == 0 ]; then
  # format mongod output with jq
  mongotailcmd="tail -f ./mongotest/logs/log | jq"
else
  # don't filter the output of mongod
  mongotailcmd="tail -f ./mongotest/logs/log"
fi

tmux split-window
tmux send "$mongotailcmd" C-m

tmux new-window
tmux send "npm start --prefix ngapp" C-m

tmux new-window
tmux send "echo \"sleeping for 1 second\"" C-m
# Requires sleep
tmux send "sleep 1" C-m
tmux send "npm start --prefix api" C-m

tmux new-window
tmux send "sleep 4" C-m
tmux send "firefox localhost:4200" C-m

tmux select-layout tiled

tmux attach
