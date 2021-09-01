rm -rf ngapp/node_modules
rm -rf api/node_modules
npm i --prefix api > reinstallAPI.log &
npm i --prefix ngapp
