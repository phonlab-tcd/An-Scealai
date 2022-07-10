GREEN="\e[1;32m"
RED="\e[1;31m"
RESET_COLOR="\e[0m"

# ONLY CONTINUE IF ON MASTER BRANCH
if [ $(git symbolic-ref --short HEAD) = "master" ]; then
  echo -e "${GREEN}on master$RESET_COLOR"
else
  echo -e "${RED}not on master. quitting.$RESET_COLOR"
  exit 1
fi

# GET SEMVER OF LATEST PUBLISHED BRANCH
latest_version=$(bash shell/latest_version.sh)

# MAKE SURE API-VERSION = LATEST
echo "latest version is: $latest_version"
if [ $latest_version = "v"$(bash shell/api_version.sh) ]; then
  echo -e "${GREEN}api version matches$RESET_COLOR"
else
  echo -e "${RED}api version doesn't match$RESET_COLOR"
  exit 1
fi

# MAKE SURE NGAPP-VERSION = LATEST
if [ $latest_version = "v"$(bash shell/ngapp_version.sh) ]; then
  echo -e "${GREEN}ngapp version matches$RESET_COLOR"
else
  echo -e "${RED}ngapp version doesn't match$RESET_COLOR"
  exit 1
fi

# BUMP VERSIONS
new_api_version=$(npm version patch --prefix api)
new_ngapp_version=$(npm version patch --prefix ngapp)
echo "new versions: api@$new_api_version ngapp@$new_ngapp_version"
if [ $new_api_version != $new_ngapp_version ]; then
  echo -e "${RED}version mismatch. quitting.$RESET_COLOR"
  exit 1
fi

# CREATE VERSION BRANCH
git checkout -b "$new_api_version"
if [ "$?" != "0" ]; then
  echo -e "${RED}error creating version branch. quitting.$RESET_COLOR"
  exit 1
fi

# BUILD PROD
npm run build:prod --prefix ngapp
if [ "$?" != "0" ]; then
  echo -e "${RED}build failed. quitting.$RESET_COLOR"
  exit 1
fi

# PUSH UPDATES
git add api/package* ngapp/package* ngapp/unpublished_dist && \
  git commit -m "autocommit publish api@$new_api_version ngapp@$ngapp_new_version" && \
  git push origin $new_api_version --set-upstream
if [ "$?" != "0" ]; then
  echo -e "${RED}error pushing changes to $new_api_version. quitting.$RESET_COLOR"
  exit 1
fi

# DEPLOY ON LIVE SERVER
echo -e "${GREEN}PASSWORD REQUIRED$RESET_COLOR"
ssh -t scealai@141.95.1.243 "
cd An-Scealai &&
  git pull &&
  git checkout $new_api_version &&
  bash reinstall.sh &&
  bash deploy_current_branch_without_building.sh"

curl -X GET "www.abair.ie/anscealaibackend/version"
