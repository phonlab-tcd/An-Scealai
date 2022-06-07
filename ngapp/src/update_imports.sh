echo $1

find -type f | grep ".ts$" | sed -i "s:['\"].*${1}['\"]:'app/services/${1}':g"
