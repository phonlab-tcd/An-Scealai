There are two urls setup for use in quality assurance testing:
* https://abair.ie/qa/scealai
* https://abair.ie/qa/anscealaibackend

## Frontend QA setup
The first url `https://abair.ie/qa/scealai`
serves up the contents of the folder
`/home/scealai/an_scealai_qa/dist/an-scealai`.

**IMPORTANT**
The build you put into `/home/scealai/an_scealai_qa/dist/an-scealai`
should be a *qa build*, which means its backend url
is `https://abair.ie/qa/anscealaibackend/` and **NOT**
`https://abair.ie/anscealaibackend`.

You can create a *qa build* by running `npm --prefix ngapp run build:qa`
which builds to `ngapp/qa_build`. This script
uses the `qa` configuration in `ngapp/angular.json` which
uses a fileReplacement to swap `abairconfig.json` for
`abairconfig.qa.json`.

To load the build into the public folder run:
`shell/publish_qa_static.sh`
Note: password required to run this script.

# Backend QA setup
The second url `https://abair.ie/qa/anscealaibackend` redirects
to `localhost:4002` on the server.

There is a `systemd` service set up on the banba server, so
the qa site can be restarted with `sudo systemctl restart scealai-qa`.
To update the qa site to a different version checkout the version with git in
`/home/scealai/qa/An-Scealai/` and then restart the service.