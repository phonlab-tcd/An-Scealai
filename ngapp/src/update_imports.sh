if [[ "$1" == "" ]]; then
  echo 'no'
  exit
fi
COMMAND="s:['\"].*$1['\"]:'app/services/$1':g"
echo $COMMAND

# find -type f | grep ".ts$" | xargs echo 
