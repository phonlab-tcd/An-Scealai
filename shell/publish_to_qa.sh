GREEN="\e[1;32m"
RED="\e[1;31m"
RESET_COLOR="\e[0m"
set -e

# INSTALL
bash shell/reinstall.sh
# BUILD QA
npm run build:qa --prefix ngapp

current_branch=`git rev-parse --abbrev-ref HEAD`
echo $current_branch

git add ngapp/qa_build
git commit -m "autocommit ngapp/qa_build"
git push

# DEPLOY ON LIVE SERVER
echo -e "${GREEN}PASSWORD REQUIRED$RESET_COLOR"
ssh -t scealai@141.95.1.243 "
  cd an_scealai_qa &&
  git pull &&
  git checkout $current_branch &&
  bash shell/reinstall.sh &&
  tmux kill-session -t qa &&
  tmux new-session -t qa -d &&
  tmux send -t qa \"npm run start:qa\" &&
  cp -r ngapp/qa_build/* dist/an-scealai/
  "

curl https://www.abair.ie/qa/anscealaibackend/version
