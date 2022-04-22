rm -rf ngapp/node_modules
rm -rf api/node_modules

# redirect stdout and stderr to installAPI.log
npm i --prefix api >> installAPI.log 2>&1 &
npm i --prefix ngapp | tee installNG.log 2>&1 &
