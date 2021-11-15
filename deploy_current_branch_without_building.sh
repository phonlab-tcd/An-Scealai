source reinstall_api_dependencies.sh
if [ $? != 0 ] ; then
  echo -e "\033[31;1;4m" # print this in red
  echo "Failed to reinstall_api_dependencies.sh . Exiting deployment."
  echo -e "\033[0m" # reset colors to default
  exit 1
fi
source restart_api.sh
if [ $? != 0 ] ; then
  echo -e "\033[31;1;4m" # print this in red
  echo "Failed to restart_api.sh . Exiting deployment."
  echo -e "\033[0m" # reset colors to default
  exit 1
fi
source load_ngapp_to_live_site.sh
if [ $? != 0 ] ; then
  echo -e "\033[31;1;4m" # print this in red
  echo "ERROR WHILE MOVING NGAPP TO DIST"
  echo -e "\033[0m" # reset colors to default
  exit 1
fi
