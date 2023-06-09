#!/bin/bash
# NOTE: trailing slash in ngapp/qa_build/ causes rsync to copy contents of qa_build to an-scealai, without keeping top level name `qa_build`
# i.e. ngapp/qa_build/x.txt gets moved to /home/scealai/an_scealai_qa/dist/an-scealai/x.txt


# first backup live version to local device
rsync -r --info=progress2 scealai@141.95.1.243:/home/scealai/an_scealai_qa/dist/an-scealai remote-qa-build-backup
rsync -r --info=progress2 ngapp/qa_build/ scealai@141.95.1.243:/home/scealai/an_scealai_qa/dist/an-scealai
