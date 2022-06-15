

There are two urls setup for use in quality assurance testing:
* https://abair.ie/qa/scealai
* https://abair.ie/qa/anscealaibackend

## Frontend QA setup
The first url `https://abair.ie/qa/scealai`
serves up the contents of the folder
`/home/scealai/an_scealai_test/dist/an-scealai`.

**IMPORTANT**
The build you put into `/home/scealai/an_scealai_test/dist/an-scealai`
should be a *qa build*, which means its backend url
is `https://abair.ie/qa/anscealaibackend/` and **NOT**
`https://abair.ie/anscealaibackend`.

You can create a *qa build* by running `npm --prefix ngapp run build_qa`
which builds to `/ngapp/qa_build`. This script
uses the `qa` configuration in `/ngapp/angular.json` which
uses a fileReplacement to swap `abairconfig.json` for
`abairconfig.qa.json`.

To load the build into the public folder run (**CAREFUL**):
`rm ngapp/dist/an-scealai/*`
`cp -r ngapp/qa_build/** ngapp/dist/an-scealai`.
**ONLY DO THIS IF YOU ARE IN `/home/scealai/an_scealai_qa/`**

# Backend QA setup
The second url `https://abair.ie/qa/anscealaibackend` redirects
to `localhost:4002` on the server.

So, running the api on port 4002 will make it visible on that url,
but **CAREFUL**, by default it will be using the real database `an-scealai`.
Instead make sure it is using the `qa` database. As of writing this,
the infrasture for doing this is not set up on all branches so **BE CAREFUL**.
Ideally there should be a script in `/api/package.json` called `start_qa` which
starts the api on PORT=4002 and with DB=qa. Thus in order
to start the QA api you could run `npm --prefix api run start_qa`.
