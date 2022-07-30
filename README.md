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

## Running the App
### With `tmux`
There is a `bash`/`tmux` script in
the root folder called `spinup.sh`.
Run it with `bash spinup.sh`. If you have
all the required dependencies installed you should now
be able to view the site at `http://localhost:4200`

### Manually starting all services
#### Frontend
1) From the root directory, `/an-scealai`, navigate to the `ngapp` directory, which contains the frontend project:
```
$ cd ngapp
```
2) Start the frontend app:

*  a) (Using global installation of Angular):
  ```bash
  $ ng serve
  ```
*  b) (Using local installation of Angular):
  ```bash
  $ npm start
```
#### Database
3) Run the Mongo Daemon with the following command:
```bash
$ mongod
```
* If this doesn't work you may need root priveleges:
```bash
$ sudo mongod
```
* If it still doesn't work, you may need to create a folder called `/data/db` or `C:\data\db` on Windows. This is where MongoDB will store files.
```bash
$ mkdir data
$ mkdir data/db
$ sudo mongod --dbpath=data/db
```
(See https://stackoverflow.com/a/61423909 for more)
#### Backend
4) Add the following [sendinblue](https://www.sendinblue.com/) authentication details to `/an-scealai/api/sendinblue.json`. This allows the backend to send verification emails for user registration. [See this tutorial for more information](https://schadokar.dev/posts/how-to-send-email-in-nodejs/).
```javascript
{
  "user": "<username>",
  "pass": "<password>"
}
```
5) In the API folder, `/an-scealai/api`, run the following command to start the Backend server:
```bash
$ cd api/
$ nodemon server.js
```

6) Navigate to http://localhost:4200/.


# CHANGE LOG

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
