GREEN="\e[1;32m"
RED="\e[1;31m"
RESET_COLOR="\e[0m"

current_branch=`git rev-parse --abbrev-ref HEAD`

# BUILD QA
if [[ $BUILD_NG -gt 0 ]]; then
  npm run build:qa --prefix ngapp
  git add ngapp/qa_build
  git commit -m "autocommit ngapp/qa_build"
  git push
fi


# DEPLOY ON LIVE SERVER
echo -e "${GREEN}PASSWORD REQUIRED$RESET_COLOR"
ssh -t scealai@141.95.1.243 "
  echo \"kill tmux session\"
  tmux kill-session -t qa
  cd an_scealai_qa && pwd &&
  git pull && git rev-parse --abbrev-ref HEAD &&
  git checkout $current_branch && git rev-parse --abbrev-ref HEAD &&
  npm --prefix api install &&
  npm --prefix ngapp install &&
  tmux new-session -t qa -d &&
  tmux send -t qa \"npm --prefix api run start:qa\" C-m &&
  cp -r ngapp/qa_build/* dist/an-scealai/ &&
  TERM=xterm tmux at -t qa
  "

curl https://www.abair.ie/qa/anscealaibackend/version
