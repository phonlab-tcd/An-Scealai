const fs = require('fs');
const path = require('path');
process.env.PRIVATE_KEY = fs.readFileSync(path.join(__dirname,'jwtRS256.key')).toString();
process.env.PUBLIC_KEY = fs.readFileSync(path.join(__dirname,'jwtRS256.key.pub')).toString();