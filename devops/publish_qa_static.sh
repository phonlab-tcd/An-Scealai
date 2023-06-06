#!/bin/bash
# NOTE: trailing slashi in ngapp/qa_build/ causes rsync to copy contents of qa_build to an-scealai, with keeping top level name `qa_build`
rsync -r ngapp/qa_build/ scealai@141.95.1.243:/home/scealai/an_scealai_qa/dist/an-scealai