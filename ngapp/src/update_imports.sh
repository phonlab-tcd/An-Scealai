if [[ "$1" == "" ]]; then
  echo 'no source'
  exit
fi
if [[ "$2" == "" ]]; then
  echo 'no destination'
  exit
fi
COMMAND="s:['\"].*$1['\"]:'app/services/$2':g"
echo $COMMAND

find -type f | grep ".ts$" | xargs sed -i "$COMMAND"
