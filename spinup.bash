#! /bin/bash

# IT MIGHT BE NECESSARY TO KILL MONGOD NODE AND ANGULAR BEFORE RUNNING THIS SCRIPT
set -e

tmux new-session -s "an-scealai" -d

tmux send "./mongotest/start.sh" C-m
tmux rename-window "mongod"

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
