# Scealai Endpoint Standards

## Router


To define and endpoint of the form `/scealai/<routename>/`
create a file called:

`./api/routes/<routename>.route.js`

```javascript
// ./api/routes/<routename>.route.js

const express = require('express');
const <routename>Routes = express.Router();
```

Add the route to `server.js`

```javascript
// ./api/server.js

const <routename>Route = require('./routes/<routename>.route');
.
.
.
app.use('/routename', <routename>Route);
```


## async await

Prefer using `async await` with a `.catch()` over `.then(...)`





