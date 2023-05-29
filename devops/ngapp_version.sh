cat ngapp/package.json  | \
  grep -m 1    "version" | \
  grep -m 1 -o "[0-9]\+\.[0-9]\+\.[0-9]\+"
