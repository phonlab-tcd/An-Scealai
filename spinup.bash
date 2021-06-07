#! /bin/bash

# IT MIGHT BE NECESSARY TO KILL MONGOD NODE AND ANGULAR BEFORE RUNNING THIS SCRIPT

tmux new-session -s "an-scealai" -d

tmux send "mongod --config ./mongotest/mongotest.conf" C-m
tmux rename-window "mongod"

# This command requires tail and jq. jq is a json colorizer/formatter

# Check if running jq returned 0 meaning it's installed
jq --version | /dev/null
has_jq=$?
if [ $? == 0 ]; then
  mongotailcmd="tail -f ./mongotest/logs/log | jq"
else
  mongotailcmd="tail -f ./mongotest/logs/log"
fi

tmux split-window
tmux send "$mongotailcmd" C-m
tmux rename-window "outputs"

tmux split-window 
tmux send "npm start --prefix ngapp" C-m

tmux split-window
tmux send "echo \"sleeping for 1 second\"" C-m
# Requires sleep
tmux send "sleep 1" C-m
tmux send "npm start --prefix api" C-m

tmux select-layout tiled

tmux attach
