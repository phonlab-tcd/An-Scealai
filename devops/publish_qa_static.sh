#!/bin/bash
# NOTE: trailing slash in ngapp/qa_build/ causes rsync to copy contents of qa_build to an-scealai, without keeping top level name `qa_build`
# i.e. ngapp/qa_build/x.txt gets moved to /home/scealai/an_scealai_qa/dist/an-scealai/x.txt

if [ ! -d ngapp/qa_build ] ; then
	echo "need ngapp/qa_build folder in path (try running from root of git tree)"
fi

# push local ngapp/qa_build to server
rsync -r --info=progress2 ngapp/qa_build/ scealai@ovh:/home/scealai/an_scealai_qa/dist/an-scealai
