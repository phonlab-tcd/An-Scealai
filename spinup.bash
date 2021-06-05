#! /bin/bash
#

tmux new-session -s "mongo - ng - node" -d

tmux send "mongod --config ./mongotest/mongotest.conf" C-m
tmux rename-window "mongo"

tmux new-window
tmux send "npm start --prefix ngapp" C-m
tmux rename-window "ngapp"

tmux new-window
tmux send "npm start --prefix api" C-m
tmux rename-window "api"

tmux attach
