git branch -r | \
  grep --only-match "v[[:digit:]]\+\.[[:digit:]]\+\.[[:digit:]]\+" | \
  sed '/-/!{s/$/_/}' | \
  sort -V | \
  sed 's/_$//'
