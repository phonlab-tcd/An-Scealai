GREEN="\e[1;32m"
RED="\e[1;31m"
RESET_COLOR="\e[0m"
set -o errexit

current_branch=`git rev-parse --abbrev-ref HEAD`

# BUILD QA
if [[ $BUILD_NG -gt 0 ]]; then
  npm run build:qa --prefix ngapp
  git add ngapp/qa_build
  git commit -m "autocommit ngapp/qa_build" || true
  git push
fi


# DEPLOY ON LIVE SERVER
echo -e "${GREEN}PASSWORD REQUIRED$RESET_COLOR"
ssh -t scealai@141.95.1.243 "
  echo \"kill tmux session\"
  tmux kill-session -t qa
  set -e
  cd an_scealai_qa && pwd
  git stash
  git pull && git rev-parse --abbrev-ref HEAD
  git checkout $current_branch && git rev-parse --abbrev-ref HEAD
  npm --prefix api install
  tmux new-session -t qa -d
  tmux send -t qa \"mongod --port 27018 --dbpath ../qa-data-mongod\" C-m
  tmux new-window -t qa
  tmux send -t qa \"npm --prefix api run start:qa\" C-m
  cp -r ngapp/qa_build/* dist/an-scealai/
  sleep 3
  tmux capture-pane -p -e
  "
echo -e "${GREEN}LIVE QA VERSION${RESET_COLOR}"
curl https://www.abair.ie/qa/anscealaibackend/version 2> /dev/null | grep version
