[![on-push](https://github.com/phonlab-tcd/An-Scealai/actions/workflows/main.yml/badge.svg)](https://github.com/phonlab-tcd/An-Scealai/actions/workflows/main.yml)

# An Scéalaí

https://abair.ie/scealai/

### What is An Scéalaí?
###### *Taken from our User Guide*
An Scéalaí is an online learning platform for students of the Irish language.
It provides an environment in which users can write and correct Irish texts,
or stories.
One of An Scéalaí’s unique features is the ability to listen back
to a computer-generated voice reading your story *as Gaeilge*.
As well as this, users can run their story through a grammar-checker
that highlights any spelling mistakes or other grammatical errors found
in the text.
More detail on these technologies can be found at the Technology
tab on our website.

An Scéalaí also serves as a research project by Trinity College Dublin,
investigating the effectiveness of different language-learning methods.
We invite you to try using audio check as well as grammar check to correct
spelling and grammar mistakes in your stories.
This will provide us with useful data to help design
language-learning resources in the future!

You can contact us with any queries/feedback at scealai.info@gmail.com

## Setting Up
To dowload the code:
```bash
$ git clone https://github.com/OisinNolan/an-scealai.git
$ cd an-scealai
```

To install Node dependencies:
```bash
$ npm install --prefix api && npm install --prefix ngapp
```
or
```bash
$ bash reinstall.sh
```

## Running the App (in development mode)
### Manually starting all services
#### nginx
An Scéalaí should be run behind nginx. Install it on your system.
Setup nginx using the config in ./conf/dev.nginx.conf (i.e. copy that config to <nginx-prefix>/sites-available (on debian etc.) or to <nginx-prefix>/servers/ if installed with HomeBrew). There is a script in ./bin/macos_install_dev_nginx.sh with an example of how to set up nginx.

#### Frontend
1) From the root directory, `/an-scealai`, navigate to the `ngapp` directory, which contains the frontend project:
```bash
$ cd ngapp
```
2) Start the frontend app:
  ```bash
  $ npm start
```
#### Database
3) Run the Mongo Daemon (perhaps set up mongo as a systemd service). Depends on your OS.

#### Backend
4) copy the ./api/.env.example file to ./api/.env and fill in the missing fields in ./api/.env. Consider setting the "AWS_SES_DISABLE=true" option, if you do not have keys for AWS Simple Email Service.

5) In development, start the typescript compiler in watch mode, `cd ./api; npx tsc --watch`.

6) Start the backend nodejs server: `cd ./api; npm start`

7) Navigate to http://localhost:4040/ (if nginx is running), or to http://localhost:4200/ to go straight to the angular server (backend won't work).


# CHANGE LOG

## v1.1.4
- stricter authorization on /story/withId/:id endpoint

## v1.1.3
- begin to attribute ownership to all new stories

## v1.1.2
- [BUGFIX] download story button downloads with javascript to enable authentication

## v1.1.1
- update "main" field in api/package.json

## v1.1.0
- backend authentication (user must have valid jwt to access resources)
- auth interceptor applies jwt to requests

## v1.0.22
- [BUGFIX] admin-component classroom view not loading

## v1.0.21
- recording engagement events for playing syntheses

## v1.0.20
- adding nemo voices and dropdown menu for voices in synthesis-player

## v1.0.19
- endpoint `gramadoir/insert` not responding [BUGFIX]

## v1.0.18
- mongodb node driver@4.7.0

## v1.0.17
- gramsrv
- a4 writing area for quill
- fix favicon vs baseHref bug
- kill bookImg in recording pages
(probably some more changes I'm forgetting at the moment -- Neimhin Sun 10 Jul 2022 15:54:51 IST)

## v1.0.15
LARA update

## v1.0.12
Avatar in Beta tab.

## v1.0.11
Abair 2 component with audio caching

## v1.0.10
Record gramadoir responses for stories throughout time.

## v1.0.9
we don't talk about v1.0.9

## v1.0.8
bugfix: in `ngapp/src/app/engagement.service.ts`
`for in` was used instead of a `for of` loop to serialize
grammar tag data, resulting in no data being sent and inserted into the database.
