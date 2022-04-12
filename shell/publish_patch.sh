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
if [ $new_api_version != $new_ngapp_versio ]; then
  echo -e "${RED}version mismatch. quitting.$RESET_COLOR"
  exit 1
fi
