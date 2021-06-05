#! /bin/bash
#

tmux new-session -s "mongo - ng - node" -d

tmux send "mongod --config ./mongotest/mongotest.conf" C-m
tmux rename-window "mongod"

tmux split-window
# This command requires tail and jq. jq is a json colorizer/formatter
tmux send "tail -f ./mongotest/logs/log | jq" C-m
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
